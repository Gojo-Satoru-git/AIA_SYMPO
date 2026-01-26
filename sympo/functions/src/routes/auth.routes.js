import express from "express";
import { signup, logout, getProfile } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", requireAuth, signup);
router.post("/logout", requireAuth, logout);
router.get("/profile", requireAuth, getProfile);

export default router;