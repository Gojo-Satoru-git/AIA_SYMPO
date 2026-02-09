import admin, { db } from "../config/firebase.js";
import crypto from "crypto";
import { createOrderRecord, cancelOrderAndReleaseSeats } from "../service/order.service.js";
import { createCashfreeOrder, fetchCashfreeOrder } from "../service/cashfree.service.js";

const PAYMENT_TIMEOUT_MS = 10 * 60 * 1000;

export const createOrder = async (req, res) => {
  try {
    const { items , promoCode } = req.body;

    // Fetch user profile from Firestore to get phone & email
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(403).json({ message: "User profile not found. Please complete registration." });
    }

    const userProfile = userDoc.data();

    // Validate user has required fields for payment
    if (!userProfile.email || !userProfile.phone) {
      return res.status(400).json({ message: "Complete profile before payment. Email and phone are required." });
    }

    const { totalAmount, totalOldAmount ,  orderId } = await createOrderRecord(req.user.uid, items , promoCode );

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
      // CRITICAL: If Cashfree fails, cancel the RESERVED order to release seats
      await cancelOrderAndReleaseSeats(orderId);
      
      // Return detailed error message for debugging
      const errorMsg = cashfreeErr.message.includes("credentials") 
        ? "Payment credentials not configured. Contact support."
        : cashfreeErr.message.includes("unreachable")
        ? "Payment gateway unreachable. Check internet connection."
        : cashfreeErr.message || "Payment service unavailable";
      
      return res.status(400).json({ message: errorMsg });
    }

    await db.collection("orders").doc(orderId).update({
      cashfree_order_id: cashfreeOrder.order_id,
      expiresAt: admin.firestore.Timestamp.fromMillis(
        Date.now() + PAYMENT_TIMEOUT_MS
      ),
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

    if (!firestoreOrderId && !cashfreeOrderId) {
      return res.status(400).json({ message: "Order ID required" });
    }

    // If client provided Cashfree order id (from redirect), find corresponding Firestore order
    if (!firestoreOrderId && cashfreeOrderId) {
      const q = await db.collection('orders')
        .where('cashfree_order_id', '==', String(cashfreeOrderId))
        .limit(1)
        .get();

      if (q.empty) {
        return res.status(404).json({ message: 'Order not found for given payment id' });
      }

      firestoreOrderId = q.docs[0].id;
    }

    const orderRef = db.collection("orders").doc(firestoreOrderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderSnap.data();

    if (order.userId !== req.user.uid) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    console.log('PAID' , JSON.stringify(order.items))

    // If already PAID, return existing QR token
    if (order.status === "PAID") {
      return res.json({ success: true, qrToken: order.qrToken , amount:order.amount ,  items:order.items });
    }

    // Check if order has expired
    if (order.expiresAt && admin.firestore.Timestamp.now() > order.expiresAt) {
      await cancelOrderAndReleaseSeats(firestoreOrderId);
      return res.status(400).json({ message: "Order expired" });
    }

    // Verify payment status with Cashfree
    if (!order.cashfree_order_id) {
      return res.status(400).json({ message: "Invalid order state" });
    }

    const cashfreeOrder = await fetchCashfreeOrder(order.cashfree_order_id);

    if (cashfreeOrder.order_status !== "PAID") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const qrToken = crypto.randomBytes(32).toString("hex");

    // Update order with payment confirmation
    await orderRef.update({
      status: "PAID",
      cashfree_payment_id: cashfreeOrder.cf_payment_id || cashfreeOrder.order_id,
      qrToken,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Add team data if provided
    if (teams?.length) {
      for (const team of teams) {
        try {
          const teamData = typeof team.teamData === 'string' ? JSON.parse(team.teamData) : team.teamData;
          await db.collection("teams").add({
            teamData,
            eventId: team.id,
            uid: req.user.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        } catch (teamErr) {
          // Don't fail order if team data fails
        }
      }
    }

    console.log('After add team' , JSON.stringify(order.items))

    res.json({ success: true, qrToken ,amount:order.amount , items:order.items });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};