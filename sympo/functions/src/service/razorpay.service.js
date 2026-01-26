import crypto from 'crypto';
import Razorpay from 'razorpay';

import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '../config/env1.js';


if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.warn("Missing Razorpay credentials in environment");
}

const instance = RAZORPAY_KEY_ID ? new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
}) : null;

export const createRazorpayOrder = async (amount) => {
  if (!instance) throw new Error("Razorpay not configured");

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
    return order;
  } catch (err) {
    console.error("Razorpay order creation error:", err.message);
    throw new Error("Payment provider error");
  }
};

export const verifyRazorpayPayment = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
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