import express from 'express';
import { searchCollege } from '../controllers/college.controller.js';

const router = express.Router();

router.get("/search", searchCollege);

export default router;