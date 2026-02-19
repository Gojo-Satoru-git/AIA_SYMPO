import { db } from "../config/firebase.js";
import admin from "firebase-admin";
import crypto from "crypto";
import { cancelOrderAndReleaseSeats } from "../service/order.service.js";
import { CASHFREE_SECRET_KEY } from "../config/env1.js";

export const cashfreeWebhook = async (req, res) => {
  try {
    let rawBody;
    
    if (Buffer.isBuffer(req.body)) {
      rawBody = req.body.toString("utf8");
    } else if (req.rawBody) {
      rawBody = req.rawBody.toString("utf8");
    } else if (typeof req.body === 'string') {
      rawBody = req.body;
    } else {
      rawBody = JSON.stringify(req.body);
    }
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    if (!signature) return res.status(400).send("Missing signature");

    const webhookSecret = CASHFREE_SECRET_KEY();
    if (!webhookSecret) {
      console.error("❌ CASHFREE_WEBHOOK_SECRET not set");
      return res.status(500).send("Webhook secret not configured");
    }

    // Cashfree's signature = HMAC-SHA256(timestamp + rawBody, secret) → base64
    const signaturePayload = timestamp + rawBody;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(signaturePayload)
      .digest("base64");

    if (signature !== expectedSignature) {
      console.error("❌ Signature mismatch");
      console.error("  Received :", signature);
      console.error("  Expected :", expectedSignature);

      if (process.env.NODE_ENV !== "development") {
        return res.status(400).send("Invalid signature");
      }
      console.warn("⚠️ Proceeding anyway (dev mode)");
    } else {
      console.log("✅ Signature verified");
    }

    await processWebhook(rawBody, res);
  } catch (err) {
    console.error("❌ Webhook error:", err);
    // Always return 200 so Cashfree doesn't retry indefinitely
    return res.status(200).json({ status: "error", message: "Acknowledged" });
  }
};

async function processWebhook(rawBody, res) {
  const webhookData = JSON.parse(rawBody);
  const { data, type } = webhookData;


  // Ignore test pings from Cashfree dashboard
  if (type === "WEBHOOK" && data?.test_object) {
    return res.json({ status: "ok", message: "Test webhook acknowledged" });
  }

  if (!data) {
    return res.status(400).send("Missing data field");
  }

  // ✅ Cashfree's nested structure — order_id and payment_status live here:
  //    data.order.order_id
  //    data.payment.payment_status  ("SUCCESS", "FAILED", "USER_DROPPED", etc.)
  const order_id = data?.order?.order_id;
  const payment_status = data?.payment?.payment_status;
  const cf_payment_id = data?.payment?.cf_payment_id ?? null;
  const payment_message = data?.payment?.payment_message ?? null;
  const payment_time = data?.payment?.payment_time ?? null;

  if (!order_id) {
    console.error("❌ Missing order_id in payload. data keys:", Object.keys(data));
    return res.status(400).send("Missing order_id");
  }

  const ordersQuery = await db
        .collection("orders")
        .where("cashfree_order_id", "==", order_id)
        .limit(1)
        .get();

      if (ordersQuery.empty) {
        console.error(`❌ Order not found in Firestore for cashfree_order_id: ${order_id}`);
        return res.status(200).json({ status: "ok", message: "Order not found, acknowledged" });
      }

      const orderRef = ordersQuery.docs[0].ref;
      const snap = ordersQuery.docs[0];
      const order = snap.data();

  // ── SUCCESS ──────────────────────────────────────────────────────────────
  // Cashfree sends payment_status "SUCCESS" (not "PAID") in webhooks
  // The event type for success is "PAYMENT_SUCCESS_WEBHOOK"
  const isSuccess =
    payment_status === "SUCCESS" ||
    type === "PAYMENT_SUCCESS_WEBHOOK";

  if (isSuccess) {
    if (order.status !== "PAID") {
      // ✅ Generate QR token for successful payment
      const qrToken = crypto.randomBytes(32).toString("hex");
      
      await orderRef.update({
        status: "PAID",
        cashfree_payment_id: cf_payment_id,
        payment_time,
        qrToken, // ✅ Add QR token generation
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ Order marked PAID with QR token: ${order_id}`);
    } else {
      console.log(`ℹ️ Order already PAID, skipping: ${order_id}`);
    }
    return res.json({ status: "ok" });
  }

  // ── FAILURE ───────────────────────────────────────────────────────────────
  const failureStatuses = ["FAILED", "CANCELLED", "EXPIRED", "USER_DROPPED", "TIMEOUT", "INACTIVE"];
  const isFailure =
    failureStatuses.includes(payment_status) ||
    type === "PAYMENT_FAILED_WEBHOOK" ||
    type === "PAYMENT_USER_DROPPED_WEBHOOK";

  if (isFailure) {
    if (["RESERVED", "PENDING", "ACTIVE"].includes(order.status)) {
      console.log(`⚠️ ${payment_status} for order ${order_id}, releasing seats...`);
      await cancelOrderAndReleaseSeats(order_id, payment_status);
      await orderRef.update({
        status: payment_status ?? "FAILED",
        failure_reason: payment_message,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ Seats released and status set to ${payment_status}: ${order_id}`);
    } else {
      // Already in a final state — just make sure status reflects reality
      await orderRef.update({
        status: payment_status ?? order.status,
        failure_reason: payment_message,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`ℹ️ Order already in final state ${order.status}, updated: ${order_id}`);
    }
    return res.json({ status: "ok" });
  }

  // ── OTHER ─────────────────────────────────────────────────────────────────
  console.log(`ℹ️ Unhandled event type: ${type}, status: ${payment_status}`);
  await orderRef.update({
    status: payment_status ?? order.status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return res.json({ status: "ok" });
}