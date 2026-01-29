import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getAvailability } from "../controllers/event.controller.js";

const router = Router();

router.get("/availability", requireAuth, getAvailability);
export default router;