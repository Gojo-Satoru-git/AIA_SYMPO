import api from "./api";

export const createPaymentOrder = async (cart, promoCode = null) => {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new Error("Cart is empty");
  }

  const items = cart.map((item) => ({
    eventId: String(item.id),
    quantity: item.quantity && Number(item.quantity) > 0 ? Number(item.quantity) : 1,
  }));

  const res = await api.post("/payment/order", {
    items,
    promoCode: promoCode || null,
  });

  const {
    firestoreOrderId,
    cashfreeOrderId,
    paymentSessionId,
    totalOldAmount,
    totalAmount,
  } = res.data;

  if (!firestoreOrderId || !cashfreeOrderId || !paymentSessionId) {
    throw new Error("Invalid payment order response");
  }

  // Convert rupees to paise for Cashfree (multiply by 100)
  const amountInPaise = Math.round(totalAmount * 100);

  return {
    firestoreOrderId,
    cashfreeOrderId,
    paymentSessionId,
    totalOldAmount,
    totalAmount,
    amountInPaise,
  };
};

export const verifyPaymentOrder = async (firestoreOrderIdOrCashfreeId, cart) => {
  if (!firestoreOrderIdOrCashfreeId) {
    throw new Error("Missing order identifier");
  }

  // Construct teams data for team events (workshops)
  const teams = cart
    .filter((item) => item.type === "team" || item.type === "workshop")
    .map((item) => {
      let teamData = item.teamData;
      
      // If teamData is stored in localStorage, retrieve it
      if (!teamData) {
        const stored = localStorage.getItem(`${item.title}-teamData`);
        teamData = stored;
      }

      // If teamData exists, parse it if it's a string
      if (teamData && typeof teamData === 'string') {
        try {
          teamData = JSON.parse(teamData);
        } catch (e) {
          console.warn(`Could not parse teamData for ${item.id}:`, e);
          teamData = null;
        }
      }

      return {
        id: item.id,
        teamData: teamData ? JSON.stringify(teamData) : null,
      };
    });

  // Support either firestoreOrderId or cashfreeOrderId
  let payload = {};

  if (typeof firestoreOrderIdOrCashfreeId === 'object') {
    payload = { ...firestoreOrderIdOrCashfreeId };
  } else if (typeof firestoreOrderIdOrCashfreeId === 'string') {
    const id = firestoreOrderIdOrCashfreeId;
    if (id.startsWith('order_') || id.includes('-')) {
      payload.cashfreeOrderId = id;
    } else {
      payload.firestoreOrderId = id;
    }
  }

  payload.teams = teams;

  const res = await api.post("/payment/verify", payload);

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Payment verification failed");
  }

  return res.data;
};
