import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";
import {
  createOrder,
  verifyOrder
} from "../controllers/payment.controller.js";
import {
  validateQR,
  confirmEntry
} from "../controllers/scan.controller.js";

import { paymentLimiter } from "../middlewares/rateLimit.middleware.js"
import { requireRegisteredUser } from "../middlewares/requireRegisteredUser.js";

const router = express.Router();

router.post("/order", requireAuth, requireRegisteredUser, paymentLimiter, createOrder);
router.post("/verify", requireAuth, paymentLimiter, verifyOrder);

router.post("/scan/validate", requireAuth, requireAdmin, validateQR);
router.post("/scan/confirm", requireAuth, requireAdmin, confirmEntry);

export default router;