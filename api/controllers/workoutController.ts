import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import WorkoutPlan from '../models/WorkoutPlan';
import User from '../models/User';

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

const EXERCISE_DATABASE: { [key: string]: Omit<Exercise, 'sets' | 'reps' | 'restSeconds'> } = {
  'Push-ups': {
    name: 'Push-ups',
    instructions: 'Start in plank position, lower body until chest nearly touches floor, push back up',
    videoUrl: 'https://example.com/pushups',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: []
  },
  'Squats': {
    name: 'Squats',
    instructions: 'Stand with feet shoulder-width apart, lower hips back and down, return to standing',
    videoUrl: 'https://example.com/squats',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    equipment: []
  },
  'Lunges': {
    name: 'Lunges',
    instructions: 'Step forward with one leg, lower hips until both knees are bent at 90 degrees',
    videoUrl: 'https://example.com/lunges',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    equipment: []
  },
  'Plank': {
    name: 'Plank',
    instructions: 'Hold body in straight line from head to heels, engage core throughout',
    videoUrl: 'https://example.com/plank',
    muscleGroups: ['core', 'shoulders'],
    equipment: []
  },
  'Burpees': {
    name: 'Burpees',
    instructions: 'Squat down, jump feet back to plank, do push-up, jump feet forward, jump up',
    videoUrl: 'https://example.com/burpees',
    muscleGroups: ['full body'],
    equipment: []
  },
  'Mountain Climbers': {
    name: 'Mountain Climbers',
    instructions: 'Start in plank position, alternate bringing knees to chest rapidly',
    videoUrl: 'https://example.com/mountain-climbers',
    muscleGroups: ['core', 'cardio'],
    equipment: []
  },
  'Jumping Jacks': {
    name: 'Jumping Jacks',
    instructions: 'Jump while spreading legs and raising arms overhead, return to start position',
    videoUrl: 'https://example.com/jumping-jacks',
    muscleGroups: ['cardio', 'full body'],
    equipment: []
  },
  'High Knees': {
    name: 'High Knees',
    instructions: 'Run in place bringing knees up to waist level',
    videoUrl: 'https://example.com/high-knees',
    muscleGroups: ['cardio', 'legs'],
    equipment: []
  }
};

const generateWorkoutPlan = (
  fitnessGoal: string,
  duration: number,
  equipment: string[],
  experience: string
): Exercise[] => {
  const availableExercises = Object.values(EXERCISE_DATABASE).filter(exercise =>
    exercise.equipment.every(eq => equipment.includes(eq) || eq === '')
  );

  let exercises: Exercise[] = [];
  const exerciseCount = Math.floor(duration / 5);

  if (fitnessGoal === 'lose_weight') {
    const cardioExercises = availableExercises.filter(ex => ex.muscleGroups.includes('cardio'));
    for (let i = 0; i < Math.min(exerciseCount, cardioExercises.length); i++) {
      exercises.push({
        ...cardioExercises[i % cardioExercises.length],
        sets: experience === 'beginner' ? 2 : experience === 'intermediate' ? 3 : 4,
        reps: experience === 'beginner' ? 15 : experience === 'intermediate' ? 20 : 25,
        restSeconds: 30
      });
    }
  } else if (fitnessGoal === 'build_muscle') {
    const strengthExercises = availableExercises.filter(ex => !ex.muscleGroups.includes('cardio'));
    for (let i = 0; i < Math.min(exerciseCount, strengthExercises.length); i++) {
      exercises.push({
        ...strengthExercises[i % strengthExercises.length],
        sets: experience === 'beginner' ? 2 : experience === 'intermediate' ? 3 : 4,
        reps: experience === 'beginner' ? 8 : experience === 'intermediate' ? 10 : 12,
        restSeconds: 60
      });
    }
  } else {
    for (let i = 0; i < exerciseCount && i < availableExercises.length; i++) {
      exercises.push({
        ...availableExercises[i],
        sets: experience === 'beginner' ? 2 : experience === 'intermediate' ? 3 : 4,
        reps: experience === 'beginner' ? 12 : experience === 'intermediate' ? 15 : 18,
        restSeconds: 45
      });
    }
  }

  return exercises;
};

const calculateCaloriesBurned = (exercises: Exercise[], userWeight: number): number => {
  const baseCaloriesPerMinute = 5;
  const totalMinutes = exercises.reduce((acc, ex) => 
    acc + (ex.sets * ex.reps * 0.1) + (ex.restSeconds * ex.sets / 60), 0
  );
  return Math.round(totalMinutes * baseCaloriesPerMinute * (userWeight / 70));
};

export const generateWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { fitnessGoal, duration, equipment, experience } = req.body;
    const userId = req.user!._id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const exercises = generateWorkoutPlan(fitnessGoal, duration, equipment, experience);
    const caloriesBurned = calculateCaloriesBurned(exercises, user.profile.weight || 70);

    const workoutPlan = new WorkoutPlan({
      userId,
      name: `${experience.charAt(0).toUpperCase() + experience.slice(1)} ${fitnessGoal.replace('_', ' ')} Workout`,
      description: `A ${duration}-minute ${experience} level workout designed for ${fitnessGoal.replace('_', ' ')}`,
      duration,
      difficulty: experience,
      exercises,
      caloriesBurned,
      fitnessGoal,
      equipment,
      aiGenerated: true
    });

    await workoutPlan.save();

    res.json({
      success: true,
      workoutPlan: {
        id: workoutPlan._id,
        name: workoutPlan.name,
        description: workoutPlan.description,
        duration: workoutPlan.duration,
        difficulty: workoutPlan.difficulty,
        exercises: workoutPlan.exercises,
        caloriesBurned: workoutPlan.caloriesBurned,
        fitnessGoal: workoutPlan.fitnessGoal
      }
    });
  } catch (error) {
    console.error('Workout generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating workout plan'
    });
  }
};

export const getWorkoutPlans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { limit = 10, skip = 0, completed } = req.query;

    const query: any = { userId };
    if (completed !== undefined) {
      query.isCompleted = completed === 'true';
    }

    const workoutPlans = await WorkoutPlan.find(query)
      .sort({ createdDate: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await WorkoutPlan.countDocuments(query);

    res.json({
      success: true,
      workoutPlans,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
        hasMore: Number(skip) + Number(limit) < total
      }
    });
  } catch (error) {
    console.error('Get workout plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workout plans'
    });
  }
};

export const getWorkoutPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;

    const workoutPlan = await WorkoutPlan.findOne({ _id: id, userId });

    if (!workoutPlan) {
      res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
      return;
    }

    res.json({
      success: true,
      workoutPlan
    });
  } catch (error) {
    console.error('Get workout plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workout plan'
    });
  }
};

export const completeWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const { userRating } = req.body;

    const workoutPlan = await WorkoutPlan.findOne({ _id: id, userId });

    if (!workoutPlan) {
      res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
      return;
    }

    if (workoutPlan.isCompleted) {
      res.status(400).json({
        success: false,
        message: 'Workout plan already completed'
      });
      return;
    }

    workoutPlan.isCompleted = true;
    workoutPlan.completedDate = new Date();
    if (userRating) {
      workoutPlan.userRating = userRating;
    }

    await workoutPlan.save();

    res.json({
      success: true,
      message: 'Workout completed successfully',
      workoutPlan
    });
  } catch (error) {
    console.error('Complete workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing workout'
    });
  }
};