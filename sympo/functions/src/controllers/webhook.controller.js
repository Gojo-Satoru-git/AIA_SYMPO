import { db } from "../config/firebase.js";
import admin from "firebase-admin";
import crypto from "crypto";
import { cancelOrderAndReleaseSeats } from "../service/order.service.js";

export const cashfreeWebhook = async (req, res) => {
  try {
    // Get raw body - when using express.raw(), req.body is a Buffer
    const rawBody = typeof req.body === 'string' 
      ? req.body 
      : Buffer.isBuffer(req.body) 
      ? req.body.toString('utf-8')
      : JSON.stringify(req.body);

    // Verify webhook signature
    const signature = req.headers["x-webhook-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", process.env.CASHFREE_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("base64");

    if (signature !== expectedSignature) {
      console.warn("Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    // Parse the body
    const { data } = JSON.parse(rawBody);
    const { order_id, order_status } = data;

    const orderRef = db.collection("orders").doc(order_id);
    const snap = await orderRef.get();

    if (!snap.exists) {
      console.warn("Order not found:", order_id);
      return res.status(404).send("Order not found");
    }

    const order = snap.data();

    // Handle SUCCESS payment
    if (order_status === "PAID" && order.status !== "PAID") {
      const paymentId = data?.cf_payment_id || data?.payment_id || null;
      await orderRef.update({
        status: "PAID",
        cashfree_payment_id: paymentId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log("Order marked as PAID:", order_id, 'paymentId:', paymentId);
    }

    // Handle FAILED / CANCELLED / EXPIRED payment
    if (
      ["FAILED", "CANCELLED", "EXPIRED"].includes(order_status) &&
      order.status === "RESERVED"
    ) {
      await cancelOrderAndReleaseSeats(order_id);
      console.log("Order cancelled and seats released:", order_id);
    }

    res.json({ status: "ok" });

  } catch (err) {
    console.error("Cashfree webhook error:", err);
    res.status(500).send("Webhook processing failed");
  }
};
