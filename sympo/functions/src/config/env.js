// env.js - Firebase environment
import { defineString, defineSecret } from "firebase-functions/params";

// Server
export const NODE_ENV = defineString("NODE_ENV", { default: "production" });

// Razorpay
export const RAZORPAY_KEY_ID = defineSecret("RAZORPAY_KEY_ID");
export const RAZORPAY_KEY_SECRET = defineSecret("RAZORPAY_KEY_SECRET");

// Cashfree
export const CASHFREE_APP_ID = defineSecret("CASHFREE_APP_ID");
export const CASHFREE_SECRET_KEY = defineSecret("CASHFREE_SECRET_KEY");
export const CASHFREE_WEBHOOK_SECRET = defineSecret("CASHFREE_WEBHOOK_SECRET");

// Resend & OTP
export const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
export const OTP_EXPIRY_MINUTES = defineString("OTP_EXPIRY_MINUTES", { default: "5" });
export const OTP_RESEND_COOLDOWN_SECONDS = defineString("OTP_RESEND_COOLDOWN_SECONDS", { default: "60" });

// Frontend
export const FRONTEND_URL = defineString("FRONTEND_URL", { default: "https://yourfrontend.com" });
