import crypto from "crypto";
import { db } from "../config/firebase.js";
import { cancelOrderAndReleaseSeats } from "../service/order.service.js";

export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest !== req.headers["x-razorpay-signature"]) {
    return res.status(400).send("Invalid signature");
  }

  const payload = req.body;

  if (payload.event === "payment.failed") {
    const orderId = payload.payload.payment.entity.order_id;

    console.log("Payment failed for order:", orderId);

    const snap = await db.collection("orders")
      .where("razorpay_order_id", "==", orderId)
      .limit(1)
      .get();

    if (!snap.empty) {
        const orderDoc = snap.docs[0];
        const order = orderDoc.data();

        if (order.status === "RESERVED") {
            await cancelOrderAndReleaseSeats(orderDoc.id);
        }
    }

  }

  res.json({ status: "ok" });
};
