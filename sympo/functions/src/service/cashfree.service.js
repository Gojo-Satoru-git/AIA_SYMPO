import crypto from "crypto";
import Razorpay from "razorpay";
import { CASHFREE_APP_ID, CASHFREE_SECRET_KEY, FRONTEND_URL } from "../config/env1.js";

const CASHFREE_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

export const createCashfreeOrder = async ({ orderId, amount, customer }) => {
  const response = await axios.post(
    `${CASHFREE_BASE_URL}/orders`,
    {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customer.uid,
        customer_email: customer.email,
        customer_phone: customer.phone,
      },
      order_meta: {
        return_url: `${FRONTEND_URL}/payment-success?order_id={order_id}`,
      },
    },
    {
      headers: {
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const fetchCashfreeOrder = async (orderId) => {
  const res = await axios.get(
    `${CASHFREE_BASE_URL}/orders/${orderId}`,
    {
      headers: {
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
      },
    }
  );
  return res.data;
};