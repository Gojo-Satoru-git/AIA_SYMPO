import { db } from "../config/firebase.js";
import admin from "firebase-admin";
import offers from "../data/promoCode.js";
import limitedSeatEvents from "../data/limitedSeatEvents.js";

export const createOrderRecord = async (userId, items , promoCode) => {
  let totalAmount = 0;
  let totalOldAmount = 0;
  const validatedItems = [];
  const orderRef = db.collection("orders").doc();


  await db.runTransaction(async (tx) => {

    const eventCache = []; // 🔴 CHANGED: store reads first

    /* =======================
       🔹 STEP 1: READ ONLY
       ======================= */
    for (const item of items) {
      if (!item.eventId || item.quantity <= 0) {
        const err = new Error("Invalid item");
        err.eventId = item.eventId;
        throw err;
      }

      const eventRef = db.collection("events").doc(String(item.eventId));
      const eventSnap = await tx.get(eventRef); // ✅ READ ONLY

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


      if (limitedSeatEvents.includes(String(item.eventId))) {
        const available = event.capacity - event.booked;
        if (available < item.quantity) {
          const err = new Error("Not enough seats");
          err.eventId = item.eventId;
          throw err;
        }
      }

      eventCache.push({ eventRef, event, item }); // 🔴 CHANGED
    }

    /* =======================
       🔹 STEP 2: WRITE ONLY
       ======================= */
    for (const e of eventCache) {
      const { eventRef, event, item } = e;
      if (limitedSeatEvents.includes(String(item.eventId))) {
        tx.update(eventRef, {
          booked: event.booked + item.quantity, // ✅ WRITE AFTER ALL READS
        });
      }

      let discount = 0;

      if(promoCode) {
        const promo = offers[promoCode.toUpperCase()];

        if(promo && new Date(promo.validTill) > new Date() && promo.applicableEvents.includes(String(item.eventId))) {
            discount = promo.discountAmount;
        }
      }


      const unitPriceAfterDiscount = Math.max(0, event.price - discount);
      const itemTotal = unitPriceAfterDiscount * item.quantity;

      totalAmount += itemTotal;
      totalOldAmount += event.price * item.quantity;

      validatedItems.push({
        eventId: String(item.eventId),
        title: event.title,
        quantity: item.quantity,
        price: event.price,
        used: false,
      });
    }

    /* =======================
       🔹 STEP 3: CREATE ORDER
       ======================= */
    tx.set(orderRef, {
      userId,
      amount: totalAmount,
      promoCode: promoCode || null,
      status: "RESERVED",
      items: validatedItems,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      qrToken: null,
      isUsed: false,
    });
  });

  return { totalAmount , totalOldAmount, orderId: orderRef.id };
};

export const cancelOrderAndReleaseSeats = async (orderId) => {
  const orderRef = db.collection("orders").doc(orderId);

  await db.runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) return;

    const order = orderSnap.data();
    if (order.status === "PAID") return;

    const eventCache = []; // 🔴 CHANGED

    /* READ FIRST */
    for (const item of order.items) {
      const eventRef = db.collection("events").doc(String(item.eventId));
      const eventSnap = await tx.get(eventRef);
      if (!eventSnap.exists) continue;

      eventCache.push({ eventRef, event: eventSnap.data(), item }); // 🔴 CHANGED
    }

    /* WRITE AFTER */
    for (const e of eventCache) {
      const { eventRef, event, item } = e;

      if (limitedSeatEvents.includes(String(item.eventId))) {
        tx.update(eventRef, {
          booked: Math.max(0, event.booked - item.quantity),
        });
      }
    }

    tx.update(orderRef, { status: "CANCELLED" });
  });
};
