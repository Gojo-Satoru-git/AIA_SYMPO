// functions/src/server.js
import { onRequest } from "firebase-functions/v2/https"; // use v2 for params support
import { initializeApp, getApps } from "firebase-admin/app";

// Initialize Firebase Admin SDK safely
if (!getApps().length) {
  initializeApp();
}

// Import Express app
import app from "./app.js";

// Export HTTPS function
export const api = onRequest(app);
