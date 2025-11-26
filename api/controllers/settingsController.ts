import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
      return;
    }

    const currentUser = (req as any).user;
    const { profile, goals, aiPreferences, diet, notifications, theme, units } = req.body;

    const updateData: any = {};
    if (profile) updateData.profile = { ...currentUser.profile, ...profile };
    if (goals) updateData.goals = { ...currentUser.goals, ...goals };
    if (aiPreferences) updateData.aiPreferences = { ...currentUser.aiPreferences, ...aiPreferences };
    if (diet) updateData.diet = { ...currentUser.diet, ...diet };
    if (notifications) updateData.notifications = { ...currentUser.notifications, ...notifications };
    if (theme) updateData.theme = { ...currentUser.theme, ...theme };
    if (units) updateData.units = { ...currentUser.units, ...units };

    const user = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        profile: user.profile,
        goals: user.goals,
        aiPreferences: user.aiPreferences,
        diet: user.diet,
        notifications: user.notifications,
        theme: user.theme,
        units: user.units
      }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
};

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = (req as any).user;
    
    res.json({
      success: true,
      settings: {
        profile: currentUser.profile,
        goals: currentUser.goals,
        aiPreferences: currentUser.aiPreferences,
        diet: currentUser.diet,
        notifications: currentUser.notifications,
        theme: currentUser.theme,
        units: currentUser.units
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get settings'
    });
  }
};

export const updateProfileSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = (req as any).user;
    const { profile } = req.body;

    const user = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: { profile: { ...currentUser.profile, ...profile } } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profile settings updated successfully',
      profile: user.profile
    });
  } catch (error) {
    console.error('Update profile settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile settings'
    });
  }
};

export const updateGoalsSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = (req as any).user;
    const { goals } = req.body;

    const user = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: { goals: { ...currentUser.goals, ...goals } } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Goals settings updated successfully',
      goals: user.goals
    });
  } catch (error) {
    console.error('Update goals settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update goals settings'
    });
  }
};

export const updateAIPreferencesSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = (req as any).user;
    const { aiPreferences } = req.body;

    const user = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: { aiPreferences: { ...currentUser.aiPreferences, ...aiPreferences } } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'AI preferences updated successfully',
      aiPreferences: user.aiPreferences
    });
  } catch (error) {
    console.error('Update AI preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update AI preferences'
    });
  }
};

export const updateDietSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = (req as any).user;
    const { diet } = req.body;

    const user = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: { diet: { ...currentUser.diet, ...diet } } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Diet settings updated successfully',
      diet: user.diet
    });
  } catch (error) {
    console.error('Update diet settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update diet settings'
    });
  }
};

export const updateNotificationsSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = (req as any).user;
    const { notifications } = req.body;

    const user = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: { notifications: { ...currentUser.notifications, ...notifications } } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      notifications: user.notifications
    });
  } catch (error) {
    console.error('Update notifications settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification settings'
    });
  }
};

export const updateThemeSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = (req as any).user;
    const { theme } = req.body;

    const user = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: { theme: { ...currentUser.theme, ...theme } } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Theme settings updated successfully',
      theme: user.theme
    });
  } catch (error) {
    console.error('Update theme settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update theme settings'
    });
  }
};

export const updateUnitsSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = (req as any).user;
    const { units } = req.body;

    const user = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: { units: { ...currentUser.units, ...units } } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Units settings updated successfully',
      units: user.units
    });
  } catch (error) {
    console.error('Update units settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update units settings'
    });
  }
};