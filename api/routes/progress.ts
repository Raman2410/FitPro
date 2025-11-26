import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { addProgressData, getProgressData, getProgressPredictions, validateProgressData } from '../controllers/progressController.js';

const router = express.Router();

router.post('/', authenticate, validateProgressData, addProgressData);
router.get('/', authenticate, getProgressData);
router.get('/predictions', authenticate, getProgressPredictions);

export default router;