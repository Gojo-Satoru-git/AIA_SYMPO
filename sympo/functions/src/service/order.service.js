import { db } from "../config/firebase.js";
import admin from "firebase-admin";

export const createOrderRecord = async (userId, items) => {
  let totalAmount = 0;
  const validatedItems = [];
  const orderRef = db.collection("orders").doc();

  await db.runTransaction(async (tx) => {
    for (const item of items) {
      if (!item.eventId || item.quantity <= 0) {
        const err = new Error("Invalid item");
        err.eventId = item.eventId;
        throw err;
      }

      const eventRef = db.collection("events").doc(String(item.eventId));
      const eventSnap = await tx.get(eventRef);

      if (!eventSnap.exists) {
        const err = new Error("Event not found");
        err.eventId = item.eventId;
        throw err;
      }

      const event = eventSnap.data();

      if (!event.isActive) {
        const err = new Error("Event inactive");
        err.eventId = item.eventId;
        throw err;
      }

      const ids = ["10", "11", "12", "13"];

      if (ids.includes(item.eventId)) {
        const available = event.capacity - event.booked;
        if (available < item.quantity) {
          const err = new Error("Not enough seats");
          err.eventId = item.eventId;
          throw err;
        }

        tx.update(eventRef, {
          booked: event.booked + item.quantity,
        });
      }

      const itemTotal = event.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        eventId: String(item.eventId),
        title: event.title,
        quantity: item.quantity,
        price: event.price,
        used: false,
      });
    }

    tx.set(orderRef, {
      userId,
      amount: totalAmount,
      currency: "INR",
      status: "RESERVED",
      items: validatedItems,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      razorpay_order_id: null,
      razorpay_payment_id: null,
      qrToken: null,
      isUsed: false,
    });
  });

  return { totalAmount, orderId: orderRef.id };
};

export const cancelOrderAndReleaseSeats = async (orderId) => {
  const orderRef = db.collection("orders").doc(orderId);

  await db.runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) return; 

    const order = orderSnap.data();

    if (order.status === "PAID") return; 

    for (const item of order.items) {
      const eventRef = db.collection("events").doc(String(item.eventId));
      const eventSnap = await tx.get(eventRef);
      if (!eventSnap.exists) continue; 

      const event = eventSnap.data();
      const ids = ["10","11","12","13"]; 

      if (ids.includes(item.eventId)) {
        tx.update(eventRef, {
          booked: Math.max(0, event.booked - item.quantity),
        });
      }
    }

    tx.update(orderRef, { status: "CANCELLED" });
  });
};

