// env1.js - Localhost environment
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

// Server
export const NODE_ENV = () => process.env.NODE_ENV || "development";

// Cashfree
export const CASHFREE_APP_ID = () => process.env.CASHFREE_APP_ID;
export const CASHFREE_SECRET_KEY = () => process.env.CASHFREE_SECRET_KEY;
export const CASHFREE_WEBHOOK_SECRET = () =>
  process.env.CASHFREE_WEBHOOK_SECRET;

// Resend & OTP
export const RESEND_API_KEY = () => process.env.RESEND_API_KEY;
export const OTP_EXPIRY_MINUTES = () => process.env.OTP_EXPIRY_MINUTES || "5";
export const OTP_RESEND_COOLDOWN_SECONDS = () =>
  process.env.OTP_RESEND_COOLDOWN_SECONDS || "60";

export const PORT = () => process.env.PORT || 5000;

// Frontend
export const FRONTEND_URL = () =>
  process.env.FRONTEND_URL || "http://localhost:5173";
