import express from "express";
import { createOrder, verifyOrder } from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/order", verifyToken, createOrder);
router.post("/verify", verifyToken, verifyOrder);

export default router;