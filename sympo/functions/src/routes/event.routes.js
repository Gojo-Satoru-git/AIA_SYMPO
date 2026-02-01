import { Router } from "express";
import { getAvailability } from "../controllers/event.controller.js";

const router = Router();

router.get("/availability", getAvailability);
export default router;