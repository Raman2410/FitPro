import express from 'express';
import { body } from 'express-validator';
import { authenticate, requirePremium } from '../middleware/auth';
import { uploadMealImage, analyzeMeal, getMealHistory, getMealAnalysis } from '../controllers/mealController';

const router = express.Router();

router.post('/analyze',
  authenticate,
  uploadMealImage,
  [
    body('mealType')
      .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
      .withMessage('Meal type must be breakfast, lunch, dinner, or snack')
  ],
  analyzeMeal
);

router.get('/history',
  authenticate,
  getMealHistory
);

router.get('/analysis/:id',
  authenticate,
  getMealAnalysis
);

export default router;