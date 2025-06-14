import express from 'express';
import { imageAnalysis } from '../controllers/imageController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/scan-invoice', upload.single('image'), imageAnalysis('invoice'));
router.post('/read-barcode', upload.single('image'), imageAnalysis('barcode'));
router.post('/quality-check', upload.single('image'), imageAnalysis('quality'));

export default router;