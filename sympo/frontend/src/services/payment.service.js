import api from "./api";

/* ======================================================
   CREATE CASHFREE PAYMENT ORDER
====================================================== */

/**
 * Create Cashfree payment order
 * @param {Array} cart - cart items
 * @param {String|null} promoCode
 */
export const createPaymentOrder = async (cart, promoCode = null) => {
  try {
    // 1️⃣ Validate cart
    if (!Array.isArray(cart) || cart.length === 0) {
      throw new Error("Cart is empty");
    }

    // 2️⃣ Build items payload
    const items = cart.map((item) => ({
      eventId: item.id,
      quantity: 1,
    }));

    // 3️⃣ Call backend
    const response = await api.post("/payment/order", {
      items,
      promoCode,
    });

    // 4️⃣ Validate response
    if (
      !response?.data ||
      !response.data.orderId ||
      !response.data.amount
    ) {
      throw new Error("Invalid order response from server");
    }

    return response;
  } catch (error) {
    console.error("Order creation failed:", error);
    throw error.response?.data || error;
  }
};

/* ======================================================
   VERIFY CASHFREE PAYMENT
   (Webhook is PRIMARY, this is BACKUP)
====================================================== */

/**
 * Verify payment after Cashfree redirect
 * @param {String} orderId - Cashfree order_id
 * @param {Array} cart - cart items
 */
export const verifyPaymentOrder = async (orderId, cart) => {
  try {
    // 1️⃣ Validate input
    if (!orderId) {
      throw new Error("Missing Cashfree orderId");
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      throw new Error("Cart is empty");
    }

    // 2️⃣ Prepare team payload (same logic as old Razorpay flow)
    const teams = cart
      .filter((item) => item.type === "team")
      .map((item) => ({
        id: item.id,
        teamData:
          item.teamData ||
          localStorage.getItem(`${item.title}-teamData`) ||
          null,
      }));

    // 3️⃣ Call backend verify API
    const response = await api.post("/payment/verify", {
      orderId,
      teams,
    });

    // 4️⃣ Validate backend response
    if (!response?.data?.success) {
      throw new Error("Payment verification failed");
    }

    return response;
  } catch (error) {
    console.error("Verification failed:", error);
    throw error.response?.data || error;
  }
};

/* ======================================================
   OPTIONAL: CANCEL PAYMENT / RELEASE SEATS
====================================================== */

/**
 * Cancel payment (manual user cancel)
 * @param {String} orderId
 */
export const cancelPaymentOrder = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error("Missing orderId");
    }

    const response = await api.post("/payment/cancel", { orderId });

    return response;
  } catch (error) {
    console.error("Payment cancellation failed:", error);
    throw error.response?.data || error;
  }
};
