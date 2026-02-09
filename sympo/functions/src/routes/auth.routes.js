import express from "express";
import { signup, logout, getProfile ,verifyEmail } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", requireAuth, signup);
router.post("/logout", logout);
router.get("/profile", requireAuth, getProfile);
router.post("/verifyEmail" , verifyEmail)


export default router;