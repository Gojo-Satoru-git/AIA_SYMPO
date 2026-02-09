import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";
import { requireRegisteredUser } from "../middlewares/requireRegisteredUser.js";
import { paymentLimiter } from "../middlewares/rateLimit.middleware.js";

import { createOrder, verifyOrder } from "../controllers/payment.controller.js";
import { validateQR, confirmEntry } from "../controllers/scan.controller.js";
import { cashfreeWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

// User Routes
router.post("/order", requireAuth, requireRegisteredUser, paymentLimiter, createOrder);
router.post("/verify", requireAuth, paymentLimiter, verifyOrder);

// Razorpay Webhook (NO auth middleware)
router.post("/webhook", cashfreeWebhook);

// Admin/Volunteer Routes
router.post("/scan/validate", requireAuth, requireAdmin, validateQR);
router.post("/scan/confirm", requireAuth, requireAdmin, confirmEntry);

export default router;
