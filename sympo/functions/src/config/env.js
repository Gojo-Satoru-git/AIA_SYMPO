import { defineString, defineInt, defineSecret } from "firebase-functions/params";

/**
 * 1. DEFINE PARAMETERS
 * These replace the manual .env check. 
 * If these are missing during deploy, the Firebase CLI will prompt you for them.
 */

// Basic Config
export const FRONTEND_URL = defineString('FRONTEND_URL');
export const NODE_ENV = defineString('NODE_ENV', { default: 'development' });

// Secrets (Sensitive data should use defineSecret)
// You will set these via: firebase functions:secrets:set RAZORPAY_KEY_SECRET
export const RAZORPAY_KEY_ID = defineString('RAZORPAY_KEY_ID');
export const RAZORPAY_KEY_SECRET = defineSecret('RAZORPAY_KEY_SECRET');

/**
 * 2. EXPORT OBJECT
 * In Firebase, we use .value() to get the actual value at runtime.
 */
export default {
  get RAZORPAY_KEY_ID() { return RAZORPAY_KEY_ID.value(); },
  get RAZORPAY_KEY_SECRET() { return RAZORPAY_KEY_SECRET.value(); },
  get FRONTEND_URL() { return FRONTEND_URL.value(); },
  get NODE_ENV() { return NODE_ENV.value(); },
};
