import express from "express";
import { signup, logout, getProfile ,verifyEmail } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/signup", requireAuth, signup);
router.post("/logout", requireAuth, logout);
router.get("/profile", requireAuth, getProfile);
router.post("/verifyEmail", authLimiter, verifyEmail)


export default router;