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

    let cashfreeOrder;
    try {
      cashfreeOrder = await createCashfreeOrder({
        orderId,
        amount: totalAmount,
        customer: {
          uid: req.user.uid,
          email: userProfile.email,
          phone: userProfile.phone,
        },
      });
    } catch (cashfreeErr) {
      await cancelOrderAndReleaseSeats(orderId);
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
      totalAmount,
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
      return res.json({ 
        success: true, 
        alreadyVerified: true,
        qrToken: order.qrToken, 
        amount: order.amount, 
        items: order.items 
      });
    }
    if (order.expiresAt && admin.firestore.Timestamp.now() > order.expiresAt) {
      await cancelOrderAndReleaseSeats(firestoreOrderId);
      return res.status(400).json({ message: "Order expired" });
    }

    if (!order.cashfree_order_id)
      return res.status(400).json({ message: "Invalid order state" });

    const cashfreeOrder = await fetchCashfreeOrder(order.cashfree_order_id);
    if (cashfreeOrder.order_status !== "PAID")
      return res.status(400).json({ message: "Payment not completed" });

    const qrToken = crypto.randomBytes(32).toString("hex");

    await orderRef.update({
      status: "PAID",
      cashfree_payment_id: cashfreeOrder.cf_payment_id || cashfreeOrder.order_id,
      qrToken,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (teams?.length) {
      for (const team of teams) {
        try {
          const teamData = typeof team.teamData === "string" ? JSON.parse(team.teamData) : team.teamData;
          await db.collection("teams").add({
            teamData,
            eventId: team.id,
            uid: req.user.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        } catch {}
      }
    }

    res.json({ success: true, qrToken, amount: order.amount, items: order.items });
  } catch {
    res.status(500).json({ message: "Verification failed" });
  }
};

export const cancelAbandonedPayment = async (req, res) => {

  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "Order ID required" });

    await cancelOrderAndReleaseSeats(orderId);

    res.json({ success: true, message: "Order cancelled and seats released" });
  } catch (err) {
    console.error("Failed to cancel abandoned order", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const cleanupExpiredOrders = async () => {
  const now = admin.firestore.Timestamp.now();
  
  const expiredOrders = await db
    .collection("orders")
    .where("status", "in", ["RESERVED", "PENDING"])
    .where("expiresAt", "<=", now)
    .get();

  for (const doc of expiredOrders.docs) {
    await cancelOrderAndReleaseSeats(doc.id);
    console.log("Cleaned up expired order:", doc.id);
  }
};