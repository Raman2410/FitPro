import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import {
  updateSettings,
  getSettings,
  updateProfileSettings,
  updateGoalsSettings,
  updateAIPreferencesSettings,
  updateDietSettings,
  updateNotificationsSettings,
  updateThemeSettings,
  updateUnitsSettings
} from '../controllers/settingsController.js';

const router = express.Router();

// All settings routes require authentication
router.use(authenticate);

// Get all settings
router.get('/', getSettings);

// Update all settings
router.put('/', updateSettings);

// Update individual sections
router.put('/profile', updateProfileSettings);
router.put('/goals', updateGoalsSettings);
router.put('/ai-preferences', updateAIPreferencesSettings);
router.put('/diet', updateDietSettings);
router.put('/notifications', updateNotificationsSettings);
router.put('/theme', updateThemeSettings);
router.put('/units', updateUnitsSettings);

export default router;