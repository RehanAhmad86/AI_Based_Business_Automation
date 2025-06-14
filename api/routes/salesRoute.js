import express from 'express';
import predictSales from '../controllers/salesController.js';

const router = express.Router();
router.post('/predict-sales', predictSales);
export default router;