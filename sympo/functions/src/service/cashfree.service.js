import axios from "axios";
import { CASHFREE_APP_ID, CASHFREE_SECRET_KEY, FRONTEND_URL, NODE_ENV } from "../config/env1.js";

const CASHFREE_BASE_URL =
  NODE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

console.log("[Cashfree] Initializing with:", {
  endpoint: CASHFREE_BASE_URL,
  appId: CASHFREE_APP_ID ? `${CASHFREE_APP_ID.substring(0, 10)}...` : "MISSING",
  secretKey: CASHFREE_SECRET_KEY ? "SET" : "MISSING",
  nodeEnv: NODE_ENV
});

export const createCashfreeOrder = async ({ orderId, amount, customer }) => {
  try {
    // Validate inputs
    if (!orderId || !amount || !customer.email || !customer.phone) {
      throw new Error("Missing required payment details");
    }

    if (amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    // Check if credentials are present
    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      console.error("CRITICAL: Cashfree credentials missing");
      console.error("CASHFREE_APP_ID:", CASHFREE_APP_ID ? "SET" : "MISSING");
      console.error("CASHFREE_SECRET_KEY:", CASHFREE_SECRET_KEY ? "SET" : "MISSING");
      throw new Error("Payment gateway not configured. Contact administrator.");
    }

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
        return_url: `${FRONTEND_URL}/payment-success?order_id={order_id}`,
      },
    };

    console.log("[Cashfree] Creating order with:", {
      orderId,
      amount,
      email: customer.email,
      phone: customer.phone,
      baseUrl: CASHFREE_BASE_URL,
    });

    const response = await axios.post(
      `${CASHFREE_BASE_URL}/orders`,
      requestBody,
      {
        headers: {
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[Cashfree] Order created successfully:", response.data.order_id);
    return response.data;
  } catch (err) {
    // Detailed error logging
    console.error("[Cashfree] API Error Details:");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
    console.error("Message:", err.message);
    
    // Provide specific error messages
    if (err.response?.status === 400) {
      const apiError = err.response?.data?.message || "Invalid request";
      throw new Error(`Payment request invalid: ${apiError}`);
    } else if (err.response?.status === 401 || err.response?.status === 403) {
      throw new Error("Payment gateway authentication failed. Invalid credentials.");
    } else if (err.message?.includes("ECONNREFUSED") || err.message?.includes("ENOTFOUND")) {
      throw new Error("Payment gateway unreachable. Check internet connection.");
    } else {
      throw new Error(err.response?.data?.message || err.message || "Payment gateway error");
    }
  }
};

export const fetchCashfreeOrder = async (orderId) => {
  try {
    // Check if credentials are present
    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      throw new Error("Payment gateway not configured.");
    }

    console.log("[Cashfree] Fetching order:", orderId);

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

    console.log("[Cashfree] Order fetched:", res.data);
    return res.data;
  } catch (err) {
    console.error("[Cashfree] Fetch Error:");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
    console.error("Message:", err.message);
    throw new Error(err.response?.data?.message || "Failed to fetch payment status");
  }
};