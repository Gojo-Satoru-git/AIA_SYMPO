import crypto from "crypto";
import Razorpay from "razorpay";

import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "../config/env1.js";

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error("Missing Razorpay credentials");
}

const instance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (amount) => {
  try {
    // Validate amount
    if (!Number.isInteger(amount) || amount < 1 || amount > 5000000) {
      throw new Error("Invalid order amount");
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const order = await instance.orders.create(options);

    if (!order || !order.id) {
      throw new Error("Failed to create Razorpay order");
    }

    return order;
  } catch (err) {
    console.error("Razorpay order creation error:", err.message);
    throw new Error("Failed to create order with payment provider");
  }
};

export const verifyRazorpayPayment = (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
) => {
  try {
    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return false;
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    return expectedSignature === razorpay_signature;
  } catch (err) {
    console.error("Payment verification error:", err.message);
    return false;
  }
};
