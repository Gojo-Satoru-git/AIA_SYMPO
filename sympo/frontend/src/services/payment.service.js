import api from "./api";

export const createPaymentOrder = async (cartItems) => {
  try {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }
    const itemsPayload = cartItems.map(item => ({
      eventId: item.id,
      quantity: 1
    }));

    const response = await api.post("/payment/order", { items: itemsPayload });
    
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing required payment verification data");
    }

    const response = await api.post("/payment/verify", paymentData);
    
    if (!response.data.success) {
      throw new Error("Payment verification failed");
    }

    return response;
  } catch (error) {
    console.error("Verification failed:", error);
    throw error.response?.data || error;
  }
};