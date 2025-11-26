import { api } from './api';

export interface UserSettings {
  profile?: {
    age?: number;
    gender?: 'male' | 'female' | 'other';
    height?: number;
    weight?: number;
    bodyType?: 'Ectomorph' | 'Mesomorph' | 'Endomorph';
  };
  goals?: {
    fitnessGoals?: string[];
    dailyStepGoal?: number;
    weeklyWorkouts?: number;
    preferredWorkoutTime?: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  };
  aiPreferences?: {
    difficulty?: 'easy' | 'moderate' | 'hard';
    workoutLength?: number;
    equipment?: string[];
    voiceCoach?: boolean;
    voiceType?: 'male' | 'female' | 'robotic';
  };
  diet?: {
    dietType?: 'Veg' | 'Non-Veg' | 'Vegan' | 'Keto' | 'High-Protein';
    calorieGoal?: number;
    allergies?: string[];
    aiMealDetection?: boolean;
  };
  notifications?: {
    workout?: boolean;
    water?: boolean;
    meal?: boolean;
    progress?: boolean;
    motivation?: boolean;
    workoutTime?: string;
    waterTime?: string;
  };
  theme?: {
    darkMode?: boolean;
  };
  units?: {
    weight?: 'kg' | 'lbs';
    height?: 'cm' | 'ft';
  };
}

export const settingsService = {
  async updateSettings(settings: UserSettings) {
    const response = await api.put('/settings', settings);
    return response.data;
  },

  async getSettings() {
    const response = await api.get('/settings');
    return response.data;
  },

  async updateProfile(profile: UserSettings['profile']) {
    const response = await api.put('/settings/profile', { profile });
    return response.data;
  },

  async updateGoals(goals: UserSettings['goals']) {
    const response = await api.put('/settings/goals', { goals });
    return response.data;
  },

  async updateAIPreferences(aiPreferences: UserSettings['aiPreferences']) {
    const response = await api.put('/settings/ai-preferences', { aiPreferences });
    return response.data;
  },

  async updateDiet(diet: UserSettings['diet']) {
    const response = await api.put('/settings/diet', { diet });
    return response.data;
  },

  async updateNotifications(notifications: UserSettings['notifications']) {
    const response = await api.put('/settings/notifications', { notifications });
    return response.data;
  },

  async updateTheme(theme: UserSettings['theme']) {
    const response = await api.put('/settings/theme', { theme });
    return response.data;
  },

  async updateUnits(units: UserSettings['units']) {
    const response = await api.put('/settings/units', { units });
    return response.data;
  },
};