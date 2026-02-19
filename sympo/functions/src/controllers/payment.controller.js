import admin, { db } from "../config/firebase.js";
import crypto from "crypto";
import { createOrderRecord, cancelOrderAndReleaseSeats } from "../service/order.service.js";
import { createCashfreeOrder, fetchCashfreeOrder } from "../service/cashfree.service.js";

const PAYMENT_TIMEOUT_MS = 10 * 60 * 1000;

export const createOrder = async (req, res) => {
  try {
    const { items, promoCode } = req.body;

    const userDoc = await db.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists)
      return res.status(403).json({ message: "User profile not found." });

    const userProfile = userDoc.data();
    if (!userProfile.email || !userProfile.phone)
      return res.status(400).json({ message: "Complete profile before payment." });

    let orderData;
    try {
      orderData = await createOrderRecord(req.user.uid, items, promoCode);
    } catch (err) {
      return res.status(400).json({
        message: err.message || "Order creation failed",
        eventId: err.eventId || null,
      });
    }

    const { totalAmount, totalOldAmount, orderId } = orderData;

    const GATEWAY_PERCENT = 0.02; // 2%
    const PLATFORM_FEE = 0.18;     // 18%

    const gatewayFee = totalAmount * GATEWAY_PERCENT;
    const gstOnGateway = gatewayFee * PLATFORM_FEE;

    const convenienceFee = gatewayFee + gstOnGateway;

    const finalAmount = Math.ceil(totalAmount + convenienceFee);

    // REPLACE your existing cashfreeOrder try/catch block with this:
let cashfreeOrder;
try {
  cashfreeOrder = await createCashfreeOrder({
    orderId,
    amount: finalAmount,
    customer: {
      uid: req.user.uid,
      email: userProfile.email,
      phone: userProfile.phone,
    },
  });
} catch (cashfreeErr) {
  // If duplicate order_id conflict, fetch the existing Cashfree order
  if (
    cashfreeErr.message?.includes("already exists") ||
    cashfreeErr.message?.includes("duplicate")
  ) {
    try {
      const existingCfOrderId = `cf_${orderId}_`; // won't match — cancel instead
      await cancelOrderAndReleaseSeats(orderId, "FAILED");
      return res.status(400).json({
        message: "Duplicate payment order detected. Please try again.",
      });
    } catch {
      await cancelOrderAndReleaseSeats(orderId, "FAILED");
      return res.status(400).json({ message: "Payment order conflict." });
    }
  }

  await cancelOrderAndReleaseSeats(orderId, "FAILED");
  const errorMsg = cashfreeErr.message.includes("credentials")
    ? "Payment credentials not configured."
    : cashfreeErr.message.includes("unreachable")
    ? "Payment gateway unreachable."
    : cashfreeErr.message || "Payment service unavailable";

  return res.status(400).json({ message: errorMsg });
}

    await db.collection("orders").doc(orderId).update({
      cashfree_order_id: cashfreeOrder.order_id,
      expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + PAYMENT_TIMEOUT_MS),
      status: "PENDING", // 🔹 Payment initiated
    });

    res.json({
      firestoreOrderId: orderId,
      cashfreeOrderId: cashfreeOrder.order_id,
      paymentSessionId: cashfreeOrder.payment_session_id,
      convenienceFee,
      finalAmount,
      totalOldAmount,
      isPromoApplied: !!promoCode,
    });
  } catch (err) {
    res.status(400).json({ message: err.message, eventId: err.eventId });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    let { firestoreOrderId, cashfreeOrderId, teams } = req.body;

    console.log('=== VERIFY ORDER DEBUG ===');
    console.log('firestoreOrderId:', firestoreOrderId);
    console.log('cashfreeOrderId:', cashfreeOrderId);
    console.log('teams received:', JSON.stringify(teams, null, 2));
    console.log('teams length:', teams?.length);

    if (!firestoreOrderId && !cashfreeOrderId)
      return res.status(400).json({ message: "Order ID required" });

    if (!firestoreOrderId && cashfreeOrderId) {
      const q = await db
        .collection("orders")
        .where("cashfree_order_id", "==", String(cashfreeOrderId))
        .limit(1)
        .get();
      if (q.empty) return res.status(404).json({ message: "Order not found" });
      firestoreOrderId = q.docs[0].id;
    }

    const orderRef = db.collection("orders").doc(firestoreOrderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) return res.status(404).json({ message: "Order not found" });

    const order = orderSnap.data();
    if (order.userId !== req.user.uid)
      return res.status(403).json({ message: "Unauthorized" });

    if (order.status === "PAID"){
      console.log('ℹ️ Order already verified');
      
      // Process teams even for already-verified orders
      await processTeams(teams, firestoreOrderId, req.user.uid);
      
      return res.json({ 
        success: true, 
        alreadyVerified: true,
        qrToken: order.qrToken, 
        amount: order.amount, 
        items: order.items 
      });
    }
    
    if (order.expiresAt && admin.firestore.Timestamp.now() > order.expiresAt) {
      await cancelOrderAndReleaseSeats(firestoreOrderId, "EXPIRED");
      return res.status(400).json({ message: "Order expired" });
    }

    if (!order.cashfree_order_id)
      return res.status(400).json({ message: "Invalid order state" });

    const cashfreeOrder = await fetchCashfreeOrder(order.cashfree_order_id);
    
    // ✅ FIX: Cashfree returns "SUCCESS" for successful payments, not "PAID"
    if (cashfreeOrder.order_status !== "SUCCESS")
      return res.status(400).json({ message: "Payment not completed" });

    const qrToken = crypto.randomBytes(32).toString("hex");

    await orderRef.update({
      status: "PAID",
      cashfree_payment_id: cashfreeOrder.cf_payment_id || cashfreeOrder.order_id,
      qrToken,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, qrToken, amount: order.amount, items: order.items });
  } catch {
    res.status(500).json({ message: "Verification failed" });
  }
};

/**
 * Cancel abandoned payment (when user closes payment modal or payment fails)
 * Accepts optional status parameter to set specific cancellation reason
 */
export const cancelAbandonedPayment = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ message: "Order ID required" });
    }

    // Use provided status or default to USER_DROPPED
    const cancelStatus = status || "USER_DROPPED";
    
    // Release seats and update status atomically
    await cancelOrderAndReleaseSeats(orderId, cancelStatus);

    res.json({ 
      success: true, 
      message: "Order cancelled and seats released",
      status: cancelStatus
    });
  } catch (err) {
    console.error("Failed to cancel abandoned order:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Failed to cancel order"
    });
  }
};

/**
 * Cleanup expired orders (run via cron job)
 * Automatically releases seats for orders that have exceeded their timeout
 */
export const cleanupExpiredOrders = async () => {
  const now = admin.firestore.Timestamp.now();
  
  const expiredOrders = await db
    .collection("orders")
    .where("status", "in", ["RESERVED", "PENDING"])
    .where("expiresAt", "<=", now)
    .get();

  for (const doc of expiredOrders.docs) {
    await cancelOrderAndReleaseSeats(doc.id, "EXPIRED");
    console.log("✅ Cleaned up expired order:", doc.id);
  }
  
  console.log(`🧹 Cleanup completed. Processed ${expiredOrders.size} expired orders.`);
};


async function processTeams(teams, orderId, userId) {
  if (!teams?.length) {
    console.log('⚠️ No teams data to process');
    return;
  }

  console.log(`📋 Processing ${teams.length} team(s)...`);
  
  for (const team of teams) {
    console.log(`\n🔍 Processing team for event ${team.id}`);
    
    try {
      if (!team.teamData) {
        console.log(`⚠️ No team data for event ${team.id}, skipping`);
        continue;
      }

      const teamData = typeof team.teamData === "string" ? JSON.parse(team.teamData) : team.teamData;
      
      if (!teamData || Object.keys(teamData).length === 0) {
        console.log(`⚠️ Team data is empty for event ${team.id}, skipping`);
        continue;
      }

      // Check if team already exists
      const existingTeam = await db.collection("teams")
        .where("orderId", "==", orderId)
        .where("eventId", "==", team.id)
        .limit(1)
        .get();

      if (!existingTeam.empty) {
        console.log(`ℹ️ Team already exists for event ${team.id}, skipping duplicate`);
        continue;
      }

      const teamDoc = await db.collection("teams").add({
        teamData,
        eventId: team.id,
        orderId: orderId,
        uid: userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      console.log(`✅ Team data saved for event ${team.id}, doc ID: ${teamDoc.id}`);
    } catch (err) {
      console.error(`❌ Failed to save team data for event ${team.id}:`, err);
      console.error('Error details:', err.message);
    }
  }
  
  console.log('✅ Team processing completed\n');
}