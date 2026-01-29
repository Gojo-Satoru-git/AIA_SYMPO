import { db } from "../config/firebase.js";
import admin from "firebase-admin";

export const createOrderRecord = async (userId, items) => {

  let totalAmount = 0;
  const validatedItems = [];

  for (const item of items) {
    if (!item.eventId || item.quantity <= 0) {
      const error = new Error("Invalid item in order");
      error.eventId = item.eventId;
      throw error;
    }

    const eventSnap = await db.collection("events")
      .doc(String(item.eventId))
      .get();

    if (!eventSnap.exists) {
       const error = new Error("Event not found");
       error.eventId = item.eventId;
       throw error;
    }

    const event = eventSnap.data();

    if (!event.isActive) {
      const error = new Error("Event is not active");
      error.eventId = item.eventId;
      throw error;
    }

    const ids=['10', '11', '12', '13'];

    if ( ids.includes(item.eventId) && event.capacity - event.booked <= 0) {
      const error = new Error("Not enough seats available");
      error.eventId = item.eventId;
      throw error;
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

  const orderRef = db.collection("orders").doc();

  await orderRef.set({
    userId,
    amount: totalAmount,
    currency: "INR",
    status: "PENDING",
    items: validatedItems,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    razorpay_order_id: null,
    razorpay_payment_id: null,
    qrToken: null,
    isUsed: false
  });

  return {
    totalAmount,
    validatedItems,
    orderId: orderRef.id,
  };
};
