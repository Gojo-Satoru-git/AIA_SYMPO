import { db } from "../config/firebase.js";
import admin from "firebase-admin";

export const createOrderRecord = async (userId, items) => {
  let totalAmount = 0;
  const validatedItems = [];

  for (const item of items) {
    if (!item.eventId || item.quantity <= 0) {
      throw new Error("Invalid item format");
    }

    const eventSnap = await db.collection("events")
      .doc(String(item.eventId))
      .get();

    if (!eventSnap.exists) {
      throw new Error("Event not found");
    }

    const event = eventSnap.data();

    if (!event.isActive) {
      throw new Error("Event not active");
    }

    const itemTotal = event.price * item.quantity;
    totalAmount += itemTotal;

    validatedItems.push({
      eventId: item.eventId,
      quantity: item.quantity,
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
  });

  return {
    totalAmount,
    validatedItems,
    orderId: orderRef.id,
  };
};
