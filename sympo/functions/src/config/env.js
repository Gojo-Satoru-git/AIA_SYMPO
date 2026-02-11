// env.js - Firebase environment
import { defineString, defineSecret } from "firebase-functions/params";

const _NODE_ENV = defineString("NODE_ENV", { default: "production" });
const _CASHFREE_APP_ID = defineSecret("CASHFREE_APP_ID");
const _CASHFREE_SECRET_KEY = defineSecret("CASHFREE_SECRET_KEY");
const _CASHFREE_WEBHOOK_SECRET = defineSecret("CASHFREE_WEBHOOK_SECRET");
const _RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const _OTP_EXPIRY_MINUTES = defineString("OTP_EXPIRY_MINUTES", { default: "5" });
const _OTP_RESEND_COOLDOWN_SECONDS = defineString("OTP_RESEND_COOLDOWN_SECONDS", { default: "60" });
const _FRONTEND_URL = defineString("FRONTEND_URL", { default: "https://yourfrontend.com" });

const resolve = (param) => (typeof param.value === "function" ? param.value() : param);

// Server
export const NODE_ENV = () => resolve(_NODE_ENV);

// Cashfree
export const CASHFREE_APP_ID = () => resolve(_CASHFREE_APP_ID);
export const CASHFREE_SECRET_KEY = () => resolve(_CASHFREE_SECRET_KEY);
export const CASHFREE_WEBHOOK_SECRET = () => resolve(_CASHFREE_WEBHOOK_SECRET);

// Resend & OTP
export const RESEND_API_KEY = () => resolve(_RESEND_API_KEY);
export const OTP_EXPIRY_MINUTES = () => resolve(_OTP_EXPIRY_MINUTES);
export const OTP_RESEND_COOLDOWN_SECONDS = () => resolve(_OTP_RESEND_COOLDOWN_SECONDS);

// Frontend
export const FRONTEND_URL = () => resolve(_FRONTEND_URL);