import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const instance = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Function 1: Ask Razorpay to create a pending order
export const createRazorpayOrder = async (amount) => {
  const option = {
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await instance.orders.create(option);
    return order;
  } catch (error) {
    throw error;
  }
};

export const verifyRazorpayPayment = (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
) => {
  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === razorpay_signature;
};
