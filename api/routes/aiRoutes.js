// import express from 'express';
// import { chat, generateInsights } from '../controllers/aiController.js';

// const router = express.Router();

// router.post('/chat', chat);
// router.post('/insights', generateInsights);

// export default router;
import express from 'express';
import { chat, generateInsights } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chat);
router.post('/insights', generateInsights);

export default router;