import { db } from "../config/firebase.js";
import admin from "firebase-admin";
import crypto from "crypto";
import { cancelOrderAndReleaseSeats } from "../service/order.service.js";

export const cashfreeWebhook = async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers["x-webhook-signature"];
    const rawBody = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", process.env.CASHFREE_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("base64");

    if (signature !== expectedSignature) {
      return res.status(400).send("Invalid signature");
    }

    // Extract data
    const { order_id, order_status } = req.body.data;

    const orderRef = db.collection("orders").doc(order_id);
    const snap = await orderRef.get();

    if (!snap.exists) {
      return res.status(404).send("Order not found");
    }

    const order = snap.data();

    // Handle SUCCESS payment
    if (order_status === "PAID") {
      if (order.status !== "PAID") {
        await orderRef.update({
          status: "PAID",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    // Handle FAILED / CANCELLED / EXPIRED payment
    if (
      order_status === "FAILED" ||
      order_status === "CANCELLED" ||
      order_status === "EXPIRED"
    ) {
      console.log("Payment failed for order:", order_id);

      if (order.status === "RESERVED") {
        await cancelOrderAndReleaseSeats(order_id);
      }
    }

    res.json({ status: "ok" });

  } catch (err) {
    console.error("Cashfree webhook error:", err);
    res.status(500).send("Webhook processing failed");
  }
};
