import api from "./api";

// Validate event IDs format
const validateEventIds = (eventIds) => {
  if (!Array.isArray(eventIds) || eventIds.length === 0) {
    throw new Error("Invalid event IDs");
  }
  
  if (eventIds.length > 10) {
    throw new Error("Cannot purchase more than 10 items at once");
  }

  // Validate each ID is a string/number
  return eventIds.every(id => typeof id === 'string' || typeof id === 'number');
};

export const createPaymentOrder = async (eventIds) => {
  try {
    if (!validateEventIds(eventIds)) {
      throw new Error("Invalid event IDs format");
    }

    const response = await api.post("/payment/order", { eventIds });
    
    if (!response.data.orderId || !response.data.amount) {
      throw new Error("Invalid order response from server");
    }

    return response;
  } catch (error) {
    console.error("Order creation failed:", error);
    throw error.response?.data || error;
  }
};

export const verifyPaymentOrder = async (paymentData) => {
  try {
    if (!paymentData.razorpay_order_id || 
        !paymentData.razorpay_payment_id || 
        !paymentData.razorpay_signature) {
      throw new Error("Missing required payment verification data");
    }

    if (!/^[a-f0-9]{64}$/.test(paymentData.razorpay_signature)) {
      throw new Error("Invalid signature format");
    }

    const response = await api.post("/payment/verify", paymentData);
    
    if (!response.data.success) {
      throw new Error("Payment verification failed");
    }

    return response;
  } catch (error) {
    console.error("Payment verification failed:", error);
    throw error.response?.data || error;
  }
};