import express from 'express';
import { authenticate } from '../middleware/auth';
import { addProgressData, getProgressData, getProgressPredictions, validateProgressData } from '../controllers/progressController';

const router = express.Router();

router.post('/', authenticate, validateProgressData, addProgressData);
router.get('/', authenticate, getProgressData);
router.get('/predictions', authenticate, getProgressPredictions);

export default router;