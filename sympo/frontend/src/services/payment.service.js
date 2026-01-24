import axios from "axios";

const API = "http://localhost:5000/api";

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const createPaymentOrder = (amount, cart, token) =>
  axios.post(`${API}/payment/order`, { amount, cart }, getHeaders(token));

export const verifyPaymentOrder = (paymentData, token) =>
  axios.post(`${API}/payment/verify`, paymentData, getHeaders(token));