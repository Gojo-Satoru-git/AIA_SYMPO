import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getPurchases} from "../controllers/user.controller.js";


const router = express.Router();

// User Routes
router.get("/purchases", requireAuth, getPurchases);

export default router;