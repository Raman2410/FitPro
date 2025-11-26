import mongoose, { Schema, Document } from 'mongoose';

export interface IProgressData extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  weight: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  bmi?: number;
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    legs?: number;
  };
  workoutStats: {
    workoutsCompleted: number;
    totalCaloriesBurned: number;
    totalDuration: number;
    averageRating?: number;
  };
  nutritionStats: {
    mealsLogged: number;
    averageCalories: number;
    averageProtein: number;
    averageCarbs: number;
    averageFat: number;
    averageDietaryScore: number;
  };
  weeklyGoal: {
    targetWeight?: number;
    targetCalories?: number;
    targetWorkouts?: number;
  };
}

const progressDataSchema = new Schema<IProgressData>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  weight: {
    type: Number,
    required: true,
    min: 30,
    max: 300
  },
  bodyFatPercentage: {
    type: Number,
    min: 5,
    max: 50
  },
  muscleMass: {
    type: Number,
    min: 20,
    max: 100
  },
  bmi: {
    type: Number,
    min: 15,
    max: 40
  },
  measurements: {
    chest: { type: Number, min: 50, max: 150 },
    waist: { type: Number, min: 50, max: 150 },
    hips: { type: Number, min: 50, max: 150 },
    arms: { type: Number, min: 20, max: 60 },
    legs: { type: Number, min: 30, max: 80 }
  },
  workoutStats: {
    workoutsCompleted: { type: Number, default: 0, min: 0 },
    totalCaloriesBurned: { type: Number, default: 0, min: 0 },
    totalDuration: { type: Number, default: 0, min: 0 },
    averageRating: { type: Number, min: 1, max: 5 }
  },
  nutritionStats: {
    mealsLogged: { type: Number, default: 0, min: 0 },
    averageCalories: { type: Number, default: 0, min: 0 },
    averageProtein: { type: Number, default: 0, min: 0 },
    averageCarbs: { type: Number, default: 0, min: 0 },
    averageFat: { type: Number, default: 0, min: 0 },
    averageDietaryScore: { type: Number, default: 0, min: 0, max: 100 }
  },
  weeklyGoal: {
    targetWeight: { type: Number, min: 30, max: 300 },
    targetCalories: { type: Number, min: 1000, max: 5000 },
    targetWorkouts: { type: Number, min: 1, max: 14 }
  }
}, {
  timestamps: true
});

progressDataSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IProgressData>('ProgressData', progressDataSchema);