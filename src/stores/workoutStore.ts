import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
  instructions: string;
  videoUrl?: string;
  muscleGroups: string[];
  equipment: string[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  caloriesBurned: number;
  fitnessGoal: string;
  equipment: string[];
  createdDate: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  isCompleted: boolean;
  userRating?: number;
  aiGenerated: boolean;
}

interface WorkoutStore {
  workoutPlans: WorkoutPlan[];
  currentWorkout: WorkoutPlan | null;
  isLoading: boolean;
  error: string | null;
  generateWorkout: (params: WorkoutParams) => Promise<void>;
  getWorkoutPlans: (filters?: WorkoutFilters) => Promise<void>;
  completeWorkout: (workoutId: string, rating?: number) => Promise<void>;
  setCurrentWorkout: (workout: WorkoutPlan | null) => void;
  clearError: () => void;
}

interface WorkoutParams {
  fitnessGoal: string;
  duration: number;
  equipment: string[];
  experience: string;
}

interface WorkoutFilters {
  completed?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workoutPlans: [],
  currentWorkout: null,
  isLoading: false,
  error: null,

  generateWorkout: async (params: WorkoutParams) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${API_BASE_URL}/workouts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Workout generation failed');
      }

      set(state => ({
        workoutPlans: [data.workoutPlan, ...state.workoutPlans],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Workout generation failed',
        isLoading: false,
      });
      throw error;
    }
  },

  getWorkoutPlans: async (filters?: WorkoutFilters) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      if (!token) throw new Error('No authentication token');

      const params = new URLSearchParams();
      if (filters?.completed !== undefined) {
        params.append('completed', filters.completed.toString());
      }

      const response = await fetch(`${API_BASE_URL}/workouts?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch workout plans');
      }

      set({
        workoutPlans: data.workoutPlans,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch workout plans',
        isLoading: false,
      });
    }
  },

  completeWorkout: async (workoutId: string, rating?: number) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      if (!token) throw new Error('No authentication token');

      const body: any = {};
      if (rating) body.userRating = rating;

      const response = await fetch(`${API_BASE_URL}/workouts/${workoutId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete workout');
      }

      set(state => ({
        workoutPlans: state.workoutPlans.map(plan =>
          plan.id === workoutId
            ? { ...plan, isCompleted: true, completedDate: new Date(), userRating: rating }
            : plan
        ),
        currentWorkout: null,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to complete workout',
        isLoading: false,
      });
      throw error;
    }
  },

  setCurrentWorkout: (workout: WorkoutPlan | null) => {
    set({ currentWorkout: workout });
  },

  clearError: () => {
    set({ error: null });
  },
}));