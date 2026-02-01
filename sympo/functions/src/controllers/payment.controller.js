import { db } from "../config/firebase.js";
import { createOrderRecord } from "../service/order.service.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../service/razorpay.service.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    const { totalAmount, orderId } = await createOrderRecord(req.user.uid, items);
    const razorpayOrder = await createRazorpayOrder(totalAmount);

    await db.collection("orders").doc(orderId).update({
      razorpay_order_id: razorpayOrder.id,
    });

    res.json({
      orderId: razorpayOrder.id,
      dbOrderId: orderId,
      amount: razorpayOrder.amount,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(400).json({ message: err.message, eventId: err.eventId });
  }
};


export const verifyOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const valid = verifyRazorpayPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    if (!valid) return res.status(400).json({ message: "Invalid signature" });

    const snap = await db.collection("orders")
      .where("razorpay_order_id", "==", razorpay_order_id)
      .limit(1)
      .get();

    if (snap.empty) return res.status(404).json({ message: "Order not found" });

    const orderDoc = snap.docs[0];
    const order = orderDoc.data();

    // 🔒 STATUS GUARD
    if (order.status === "PAID") {
      return res.json({ success: true, qrToken: order.qrToken });
    }

    if (order.status === "CANCELLED") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    const qrToken = crypto.randomBytes(32).toString("hex");

    await orderDoc.ref.update({
      status: "PAID",
      razorpay_payment_id,
      qrToken,
      updatedAt: new Date(),
    });

    res.json({ success: true, qrToken });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};


import { cancelOrderAndReleaseSeats } from "../service/order.service.js";

export const cancelPayment = async (req, res) => {
  const { orderId } = req.body;

  console.log("Cancel request for orderId:", orderId);

  if (!orderId) return res.status(400).json({ message: "Missing orderId" });

  try {
    await cancelOrderAndReleaseSeats(orderId);
    return res.json({ success: true, message: "Order cancelled" });
  } catch (err) {
    console.error("Cancel failed:", err);
    return res.status(500).json({ message: "Cancel failed" });
  }
};
