import { Router } from "express";
import { getPromoPreview } from "../controllers/promo.controller.js";

const router = Router();

router.post("/preview", getPromoPreview);
export default router;