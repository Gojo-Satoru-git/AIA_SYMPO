import { db } from "../config/firebase.js";
import offers from "../data/promoCode.js";
import { success, error } from "../utils/response.js";

export const getPromoPreview = async (req, res) => {
  try {
    const { code, items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return error(res, "Items are required", 400);
    }

    if (!code) {
      return error(res, "Promo code is required", 400);
    }

    console.log("Promo preview request received", { items, code });

    let totalAmount = 0;
    let totalOldAmount = 0;
    let totalDiscount = 0;

    const eventCache = [];

    /* =======================
       🔹 STEP 1: READ ONLY
       ======================= */
    for (const item of items) {
      if (!item.eventId || item.quantity <= 0) {
        return error(res, "Invalid item", 400);
      }

      const eventRef = db.collection("events").doc(String(item.eventId));
      const eventSnap = await eventRef.get();

      if (!eventSnap.exists) {
        return error(res, `Event not found: ${item.eventId}`, 404);
      }

      const event = eventSnap.data();

      if (!event.isActive) {
        return error(res, `Event inactive: ${item.eventId}`, 400);
      }

      eventCache.push({ event, item });
    }

    /* =======================
       🔹 STEP 2: VALIDATE PROMO
       ======================= */
    const promo = offers[code.toUpperCase()];

    if (!promo) {
      return error(res, "Invalid promo code", 400);
    }

    if (new Date(promo.validTill) <= new Date()) {
      return error(res, "Promo code expired", 400);
    }

    /* =======================
       🔹 STEP 3: CALCULATE
       ======================= */
    let appliedToAny = false;

    for (const { event, item } of eventCache) {
      let discount = 0;

      if (promo.applicableEvents.includes(String(item.eventId))) {
        discount = promo.discountAmount;
        appliedToAny = true;
      }

      const oldPrice = event.price * item.quantity;
      let newPrice = oldPrice - discount * item.quantity;

      if (newPrice < 0) newPrice = 0;

      totalOldAmount += oldPrice;
      totalAmount += newPrice;
      totalDiscount += discount * item.quantity;
    }

    if (!appliedToAny) {
      return error(res, "Promo not applicable to selected events", 400);
    }

    /* =======================
       🔹 RESPONSE
       ======================= */
    return success(res, {
      promoCode: code,
      totalOldAmount,
      totalAmount,
      totalDiscount,
      isPromoApplied: true
    });

  } catch (err) {
    console.error(err);
    return error(res, "Failed to preview promo", 500);
  }
};
