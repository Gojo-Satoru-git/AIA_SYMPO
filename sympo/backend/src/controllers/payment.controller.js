import admin from '../config/firebase.js'
import crypto from 'crypto';

import { createRazorpayOrder } from '../service/razorpay.service.js';
import { db } from "../config/firebase.js";

export const createOrder = async (req, res) => {
  try {
    const { eventIds } = req.body;
    const user = req.user;

    if (!user || !user.uid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return res.status(400).json({ message: "Invalid events" });
    }

    const uniqueEventIds = [...new Set(eventIds)];

    let total = 0;
    const eventDetails = [];

    for (const id of uniqueEventIds) {
      const eventSnap = await db.collection("events").doc(String(id)).get();

      if (!eventSnap.exists) {
        return res.status(400).json({
          message: `Invalid event ID: ${id}`,
        });
      }

      const eventData = eventSnap.data();

      if (!eventData.isActive) {
        return res.status(400).json({
          message: `Event not active: ${eventData.title}`,
        });
      }

      total += eventData.price;

      eventDetails.push({
        id: String(id),
        title: eventData.title,
        price: eventData.price,
        used: false,
      });
    }

    // Check already purchased events
    const existingOrders = await db
      .collection("orders")
      .where("userId", "==", user.uid)
      .where("status", "==", "PAID")
      .get();

    for (const doc of existingOrders.docs) {
      const data = doc.data();
      const alreadyBought = data.events?.map(e => e.id) || [];

      const overlap = uniqueEventIds.some(id =>
        alreadyBought.includes(id)
      );

      if (overlap) {
        return res.status(400).json({
          message: "You already purchased one or more selected events",
        });
      }
    }

    if (total <= 0) {
      return res.status(400).json({
        message: "Invalid total amount",
      });
    }

    const razorpayOrder = await createRazorpayOrder(total);

    await db.collection("orders").doc(razorpayOrder.id).set({
      userId: user.uid,
      email: user.email,
      amount: total,
      status: "PENDING",
      razorpay_order_id: razorpayOrder.id,
      razorpay_payment_id: null,
      qrToken: null,
      events: eventDetails,
      isUsed: false,
      usedAt: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });

  } catch (err) {
    console.error("Order creation error:", err);
    return res.status(500).json({ message: "Order creation failed" });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const user = req.user;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    if (!user || !user.uid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const orderRef = db.collection("orders").doc(razorpay_order_id);
    let qrToken;

    await db.runTransaction(async (transaction) => {
      const orderDoc = await transaction.get(orderRef);

      if (!orderDoc.exists) {
        throw new Error("Order not found");
      }

      const orderData = orderDoc.data();

      if (orderData.userId !== user.uid) {
        throw new Error("Unauthorized access to order");
      }

      // Idempotent handling
      if (orderData.status === "PAID") {
        qrToken = orderData.qrToken;
        return;
      }

      if (orderData.status !== "PENDING") {
        throw new Error("Order already processed");
      }

      qrToken = crypto.randomBytes(32).toString("hex");

      transaction.update(orderRef, {
        status: "PAID",
        razorpay_payment_id,
        qrToken,
      });
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified",
      qrToken,
    });

  } catch (err) {
    console.error("Payment verification error:", err);
    return res.status(400).json({
      message: err.message || "Payment verification failed",
    });
  }
};
