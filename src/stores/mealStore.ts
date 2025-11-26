import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface FoodItem {
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface MealAnalysis {
  id: string;
  foodItems: FoodItem[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  dietaryScore: number;
  aiConfidenceScore: number;
  recommendations: string[];
  mealType: string;
  imageUrl?: string;
  analysisDate: string;
}

interface MealStore {
  analyses: MealAnalysis[];
  isLoading: boolean;
  error: string | null;
  analyzeMeal: (imageFile: File, mealType: string) => Promise<void>;
  getMealHistory: () => Promise<void>;
  clearError: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useMealStore = create<MealStore>((set, get) => ({
  analyses: [],
  isLoading: false,
  error: null,

  analyzeMeal: async (imageFile: File, mealType: string) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      if (!token) throw new Error('No authentication token');

      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('mealType', mealType);

      const response = await fetch(`${API_BASE_URL}/meals/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Meal analysis failed');
      }

      set(state => ({
        analyses: [data.analysis, ...state.analyses],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Meal analysis failed',
        isLoading: false,
      });
      throw error;
    }
  },

  getMealHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${API_BASE_URL}/meals/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch meal history');
      }

      set({
        analyses: data.analyses,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch meal history',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));