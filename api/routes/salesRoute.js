import express from 'express';
import predictSales from '../controllers/salesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
 router.post('/predict-sales', protect , predictSales);
export default router;