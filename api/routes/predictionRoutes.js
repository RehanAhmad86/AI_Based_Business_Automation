import express from "express";
import { getUserPredictions } from "../controllers/predictionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/" ,protect, getUserPredictions);

export default router;