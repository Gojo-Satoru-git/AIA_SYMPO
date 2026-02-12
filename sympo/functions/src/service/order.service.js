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

/**
 * Cancel order and release seats
 * 
 * This function is called when:
 * - Payment fails (status: FAILED)
 * - User cancels payment (status: CANCELLED)
 * - User drops payment (status: USER_DROPPED)
 * - Payment expires (status: EXPIRED)
 * - Payment times out (status: TIMEOUT)
 * - User closes payment modal without paying (status: USER_DROPPED)
 * 
 * @param {string} orderId - The Firestore order ID
 * @param {string} newStatus - The status to set (default: "CANCELLED")
 */
export const cancelOrderAndReleaseSeats = async (orderId, newStatus = "CANCELLED") => {
  const orderRef = db.collection("orders").doc(orderId);

  await db.runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) {
      console.warn(`Order not found during cancellation: ${orderId}`);
      return;
    }

    const order = orderSnap.data();
    
    // Only release seats if order is in a reservable state
    if (!["RESERVED", "PENDING", "ACTIVE"].includes(order.status)) {
      console.log(`Order ${orderId} status is ${order.status}, no seat release needed`);
      return;
    }

    console.log(`Releasing seats for order ${orderId} (current status: ${order.status})`);

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
    let seatsReleased = 0;
    for (const [eventId, quantity] of Object.entries(aggregatedSeats)) {
      if (limitedSeatEvents.includes(eventId) && eventDataCache[eventId]) {
        const event = eventDataCache[eventId];
        const newBooked = Math.max(0, event.booked - quantity);
        
        tx.update(event.ref, {
          booked: newBooked
        });
        
        seatsReleased += quantity;
        console.log(`Released ${quantity} seats for event ${eventId} (${event.booked} → ${newBooked})`);
      }
    }

    console.log(`✅ Total seats released: ${seatsReleased} for order ${orderId}`);
    
    // STEP 5: Update order status
    tx.update(orderRef, {
      status: newStatus,
      failure_reason: getFailureReason(newStatus),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log(`✅ Order ${orderId} status updated to: ${newStatus}`);
  });
};

/**
 * Helper function to get failure reason based on status
 */
const getFailureReason = (status) => {
  const reasons = {
    "USER_DROPPED": "Payment modal closed by user",
    "CANCELLED": "Payment cancelled",
    "FAILED": "Payment failed",
    "EXPIRED": "Payment session expired",
    "TIMEOUT": "Payment timed out",
    "INACTIVE": "Order inactive"
  };
  
  return reasons[status] || "Payment not completed";
};

/**
 * Helper function to check if an order status represents a completed payment
 */
export const isPaymentSuccessful = (status) => {
  return status === "PAID";
};

/**
 * Helper function to check if an order status represents a failed/cancelled payment
 */
export const isPaymentFailed = (status) => {
  const failureStatuses = [
    "FAILED",
    "CANCELLED", 
    "EXPIRED",
    "USER_DROPPED",
    "TIMEOUT",
    "INACTIVE"
  ];
  return failureStatuses.includes(status);
};

/**
 * Helper function to check if an order is still in progress
 */
export const isPaymentPending = (status) => {
  const pendingStatuses = ["RESERVED", "PENDING", "ACTIVE"];
  return pendingStatuses.includes(status);
};

/**
 * Get human-readable status message
 */
export const getStatusMessage = (status) => {
  const statusMessages = {
    PAID: "Payment successful",
    FAILED: "Payment failed",
    CANCELLED: "Payment cancelled by user",
    USER_DROPPED: "User closed payment page",
    EXPIRED: "Payment session expired",
    TIMEOUT: "Payment timed out",
    INACTIVE: "Order inactive",
    ACTIVE: "Payment in progress",
    RESERVED: "Seats reserved, awaiting payment",
    PENDING: "Order pending"
  };
  
  return statusMessages[status] || `Status: ${status}`;
};