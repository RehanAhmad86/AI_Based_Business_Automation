import express from 'express';
import { generateEmail } from '../controllers/emailGenerator.controller.js';

const router = express.Router();

router.post('/generate-email', generateEmail);

export default router;