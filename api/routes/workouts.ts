import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { generateWorkout, getWorkoutPlans, getWorkoutPlan, completeWorkout } from '../controllers/workoutController';

const router = express.Router();

const workoutValidation = [
  body('fitnessGoal')
    .isIn(['lose_weight', 'build_muscle', 'maintain', 'improve_endurance'])
    .withMessage('Fitness goal must be lose_weight, build_muscle, maintain, or improve_endurance'),
  body('duration')
    .isInt({ min: 10, max: 120 })
    .withMessage('Duration must be between 10 and 120 minutes'),
  body('equipment')
    .isArray()
    .withMessage('Equipment must be an array'),
  body('experience')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Experience must be beginner, intermediate, or advanced')
];

const completeWorkoutValidation = [
  body('userRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('User rating must be between 1 and 5')
];

router.post('/generate',
  authenticate,
  workoutValidation,
  generateWorkout
);

router.get('/',
  authenticate,
  getWorkoutPlans
);

router.get('/:id',
  authenticate,
  getWorkoutPlan
);

router.patch('/:id/complete',
  authenticate,
  completeWorkoutValidation,
  completeWorkout
);

export default router;