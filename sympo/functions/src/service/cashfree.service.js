import axios from "axios";
import { CASHFREE_APP_ID, CASHFREE_SECRET_KEY, FRONTEND_URL, NODE_ENV } from "../config/env.js"; // Firebase: env.js, localhost: env1.js

const NODE_ENV_VALUE = NODE_ENV.value ? NODE_ENV.value() : NODE_ENV || "development";
const CASHFREE_BASE_URL = "https://api.cashfree.com/pg"

const FRONTEND_URL_VALUE = FRONTEND_URL.value ? FRONTEND_URL.value() : FRONTEND_URL || "http://localhost:5173";

console.log("[Cashfree] Initialized base URL:", CASHFREE_BASE_URL);

export const createCashfreeOrder = async ({ orderId, amount, customer }) => {
  // Access secrets at runtime
  const appId = typeof CASHFREE_APP_ID.value === "function" ? await CASHFREE_APP_ID.value() : CASHFREE_APP_ID;
  const secretKey = typeof CASHFREE_SECRET_KEY.value === "function" ? await CASHFREE_SECRET_KEY.value() : CASHFREE_SECRET_KEY;

  console.log("[Cashfree] Creating order for:", { orderId, amount, email: customer.email });

  if (!appId || !secretKey) throw new Error("Payment gateway not configured.");

  if (!orderId || !amount || !customer.email || !customer.phone) {
    throw new Error("Missing required payment details");
  }

  if (amount <= 0) throw new Error("Invalid payment amount");

  const requestBody = {
    order_id: String(orderId),
    order_amount: parseFloat(amount),
    order_currency: "INR",
    customer_details: {
      customer_id: customer.uid,
      customer_email: customer.email,
      customer_phone: customer.phone,
    },
    order_meta: {
      return_url: `${FRONTEND_URL_VALUE}/payment-success?order_id={order_id}`,
    },
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

    console.log("[Cashfree] Order created:", response.data.order_id);
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
  const appId = typeof CASHFREE_APP_ID.value === "function" ? await CASHFREE_APP_ID.value() : CASHFREE_APP_ID;
  const secretKey = typeof CASHFREE_SECRET_KEY.value === "function" ? await CASHFREE_SECRET_KEY.value() : CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) throw new Error("Payment gateway not configured.");

  try {
    const res = await axios.get(`${CASHFREE_BASE_URL}/orders/${orderId}`, {
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
      },
    });
    console.log("[Cashfree] Order fetched:", res.data);
    return res.data;
  } catch (err) {
    console.error("[Cashfree] Fetch error:", err.message);
    if (err.response) console.error("Status:", err.response.status, "Data:", err.response.data);
    throw new Error(err.response?.data?.message || "Failed to fetch payment status");
  }
};