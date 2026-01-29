import { db } from "../config/firebase.js";
import { createOrderRecord } from "../service/order.service.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../service/razorpay.service.js";
import crypto from 'crypto';

export const createOrder = async (req, res) => {
  try {
    // items should be [{ eventId: "123", quantity: 1 }]
    const { items } = req.body; 
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // 1. Service: Create DB Record
    const { totalAmount, orderId } = await createOrderRecord(req.user.uid, items);

    // 2. Service: Create Razorpay Order
    const razorpayOrder = await createRazorpayOrder(totalAmount);

    // 3. Update DB with Razorpay ID
    await db.collection("orders").doc(orderId).update({
      razorpay_order_id: razorpayOrder.id,
    });

    return res.status(201).json({
      orderId: razorpayOrder.id, // Razorpay ID for frontend SDK
      dbOrderId: orderId,        // Internal ID
      amount: razorpayOrder.amount,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    return res.status(500).json({ message: err.message || "Order failed" , eventId : err.eventId});
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // 1. Service: Verify Signature
    const isValid = verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) return res.status(400).json({ message: "Invalid signature" });

    const ordersQuery = await db.collection("orders")
      .where("razorpay_order_id", "==", razorpay_order_id)
      .limit(1).get();

    if (ordersQuery.empty) return res.status(404).json({ message: "Order not found" });

    const orderDoc = ordersQuery.docs[0];
    const orderData = orderDoc.data();

    if (orderData.status === "PAID") {
      return res.status(200).json({ success: true, qrToken: orderData.qrToken });
    }

    // 2. Generate QR Token
    const qrToken = crypto.randomBytes(32).toString("hex");

    await orderDoc.ref.update({
      status: "PAID",
      razorpay_payment_id,
      qrToken,
      updatedAt: new Date()
    });

    return res.status(200).json({ success: true, message: "Verified", qrToken });

  } catch (err) {
    console.error("Verify Error:", err);
    return res.status(500).json({ message: "Verification failed" });
  }
};