import { db } from "../config/firebase.js";
import admin from "firebase-admin";
import offers from "../data/promoCode.js";
import limitedSeatEvents from "../data/limitedSeatEvents.js";

// Linked combo → event mapping
const linkedSeatsMap = {
  combo1: "10",
  combo2: "12",
  combo3: "14"
};

// ====== CREATE ORDER ======
export const createOrderRecord = async (userId, items, promoCode) => {
  const orderRef = db.collection("orders").doc();
  let totalAmount = 0;
  let totalOldAmount = 0;
  const validatedItems = [];

  await db.runTransaction(async (tx) => {
    const eventDataCache = {};

    // STEP 1: Build seat-only list (combo → linked event)
    const seatItems = [];
    for (const item of items) {
      const linkedEventId = linkedSeatsMap[item.eventId];

      if (linkedEventId) {
        seatItems.push({
          eventId: linkedEventId,
          quantity: item.quantity || 1
        });
      } else {
        seatItems.push({
          eventId: item.eventId,
          quantity: item.quantity || 1
        });
      }
    }

    // STEP 2: Read BOTH seat events and price events
    const uniqueEventIds = [
      ...new Set([
        ...seatItems.map(i => i.eventId),     // seat events
        ...items.map(i => i.eventId)          // pricing events (combo)
      ])
    ];

    for (const eventId of uniqueEventIds) {
      const eventRef = db.collection("events").doc(eventId);
      const eventSnap = await tx.get(eventRef);
      if (!eventSnap.exists) throw new Error(`Event not found: ${eventId}`);

      const event = eventSnap.data();
      if (!event.isActive) throw new Error(`Event inactive: ${event.title}`);

      eventDataCache[eventId] = { ...event, ref: eventRef };
    }

    // STEP 3: Aggregate seat quantities
    const aggregatedSeats = {};
    for (const item of seatItems) {
      aggregatedSeats[item.eventId] =
        (aggregatedSeats[item.eventId] || 0) + item.quantity;
    }

    // STEP 4: Validate seat availability
    for (const [eventId, quantity] of Object.entries(aggregatedSeats)) {
      if (limitedSeatEvents.includes(eventId)) {
        const event = eventDataCache[eventId];
        const available = event.capacity - event.booked;
        if (available < quantity) {
          throw new Error(
            `Not enough seats for "${event.title}". Only ${available} left.`
          );
        }
      }
    }

    // STEP 5: Calculate totals (price from original item)
    for (const item of items) {
      const event = eventDataCache[item.eventId]; // PRICE FROM combo or normal event
      if (!event) continue;

      let discount = 0;
      if (promoCode) {
        const promo = offers[promoCode.toUpperCase()];
        if (promo && new Date(promo.validTill) > new Date()) {
          if (promo.applicableEvents.includes(item.eventId)) {
            discount = promo.discountAmount;
          }
        }
      }

      const qty = item.quantity || 1;
      const unitPriceAfterDiscount = Math.max(0, event.price - discount);

      totalAmount += unitPriceAfterDiscount * qty;
      totalOldAmount += event.price * qty;

      validatedItems.push({
        eventId: String(item.eventId), // combo stays combo
        title: event.title,
        quantity: qty,
        price: event.price,
        used: false
      });
    }

    // STEP 6: Update ONLY real seat events
    for (const [eventId, quantity] of Object.entries(aggregatedSeats)) {
      if (limitedSeatEvents.includes(eventId)) {
        const event = eventDataCache[eventId];
        tx.update(event.ref, { booked: event.booked + quantity });
      }
    }

    // STEP 7: Order status
    const initialStatus = Object.keys(aggregatedSeats).some(eventId =>
      limitedSeatEvents.includes(eventId)
    )
      ? "RESERVED"
      : "PENDING";

    // STEP 8: Create order
    tx.set(orderRef, {
      userId,
      amount: totalAmount,
      promoCode: promoCode || null,
      status: initialStatus,
      items: validatedItems,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      qrToken: null,
      isUsed: false
    });
  });

  return { totalAmount, totalOldAmount, orderId: orderRef.id };
};

export const cancelOrderAndReleaseSeats = async (orderId) => {
  const orderRef = db.collection("orders").doc(orderId);

  await db.runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) return;

    const order = orderSnap.data();
    if (!["RESERVED", "PENDING"].includes(order.status)) return;

    // STEP 1: Build seat-only list (combo → linked event)
    const seatItems = [];
    for (const item of order.items || []) {
      const linkedEventId = linkedSeatsMap[item.eventId];

      if (linkedEventId) {
        seatItems.push({
          eventId: linkedEventId,
          quantity: item.quantity || 1
        });
      } else {
        seatItems.push({
          eventId: item.eventId,
          quantity: item.quantity || 1
        });
      }
    }

    // STEP 2: Aggregate seat quantities
    const aggregatedSeats = {};
    for (const item of seatItems) {
      aggregatedSeats[item.eventId] =
        (aggregatedSeats[item.eventId] || 0) + item.quantity;
    }

    // STEP 3: Read only seat events
    const uniqueEventIds = Object.keys(aggregatedSeats);
    const eventDataCache = {};

    for (const eventId of uniqueEventIds) {
      const eventRef = db.collection("events").doc(eventId);
      const eventSnap = await tx.get(eventRef);
      if (eventSnap.exists) {
        eventDataCache[eventId] = {
          ref: eventRef,
          booked: eventSnap.data().booked || 0
        };
      }
    }

    // STEP 4: Release booked seats (only real seat events)
    for (const [eventId, quantity] of Object.entries(aggregatedSeats)) {
      if (limitedSeatEvents.includes(eventId) && eventDataCache[eventId]) {
        const event = eventDataCache[eventId];
        tx.update(event.ref, {
          booked: Math.max(0, event.booked - quantity)
        });
      }
    }

    // STEP 5: Mark order cancelled
    tx.update(orderRef, {
      status: "CANCELLED",
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
};
