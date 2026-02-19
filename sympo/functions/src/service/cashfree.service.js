import axios from "axios";
import { CASHFREE_APP_ID, CASHFREE_SECRET_KEY, FRONTEND_URL } from "../config/env1.js"; // Firebase: env.js, localhost: env1.js

const CASHFREE_BASE_URL = "https://sandbox.cashfree.com/pg"

const FRONTEND_URL_VALUE = FRONTEND_URL();


export const createCashfreeOrder = async ({ orderId, amount, customer }) => {
  // Access secrets at runtime
  const appId =  CASHFREE_APP_ID()
  const secretKey = CASHFREE_SECRET_KEY();


  if (!appId || !secretKey) throw new Error("Payment gateway not configured.");

  if (!orderId || !amount || !customer.email || !customer.phone) {
    throw new Error("Missing required payment details");
  }

  if (amount <= 0) throw new Error("Invalid payment amount");

  const requestBody = {
    order_id: `cf_${orderId}_${Date.now()}`,
    order_amount: parseFloat(amount),
    order_currency: "INR",
    customer_details: {
      customer_id: customer.uid,
      customer_email: customer.email,
      customer_phone: customer.phone,
    },
    order_meta: { },
  };

  try {
    const response = await axios.post(`${CASHFREE_BASE_URL}/orders`, requestBody, {
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    console.error("[Cashfree] API error:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status, "Data:", err.response.data);
    }

    if (err.response?.status === 400) throw new Error(`Payment request invalid: ${err.response?.data?.message}`);
    if ([401, 403].includes(err.response?.status)) throw new Error("Payment gateway authentication failed.");
    if (err.message?.includes("ECONNREFUSED") || err.message?.includes("ENOTFOUND")) throw new Error("Payment gateway unreachable.");

    throw new Error(err.response?.data?.message || err.message || "Payment gateway error");
  }
};

export const fetchCashfreeOrder = async (orderId) => {
  const appId = CASHFREE_APP_ID();
  const secretKey = CASHFREE_SECRET_KEY();

  if (!appId || !secretKey) throw new Error("Payment gateway not configured.");

  try {
    const res = await axios.get(`${CASHFREE_BASE_URL}/orders/${orderId}`, {
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
      },
    });
    return res.data;
  } catch (err) {
    console.error("[Cashfree] Fetch error:", err.message);
    if (err.response) console.error("Status:", err.response.status, "Data:", err.response.data);
    throw new Error(err.response?.data?.message || "Failed to fetch payment status");
  }
};