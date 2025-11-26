import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkoutPlan extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: {
    name: string;
    sets: number;
    reps: number;
    restSeconds: number;
    instructions: string;
    videoUrl?: string;
    muscleGroups: string[];
    equipment: string[];
  }[];
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

const workoutPlanSchema = new Schema<IWorkoutPlan>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 10,
    max: 120
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  exercises: [{
    name: {
      type: String,
      required: true
    },
    sets: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    reps: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },
    restSeconds: {
      type: Number,
      required: true,
      min: 0,
      max: 300
    },
    instructions: {
      type: String,
      required: true
    },
    videoUrl: String,
    muscleGroups: [String],
    equipment: [String]
  }],
  caloriesBurned: {
    type: Number,
    required: true,
    min: 50,
    max: 1000
  },
  fitnessGoal: {
    type: String,
    enum: ['lose_weight', 'build_muscle', 'maintain', 'improve_endurance'],
    required: true
  },
  equipment: [String],
  createdDate: {
    type: Date,
    default: Date.now
  },
  scheduledDate: Date,
  completedDate: Date,
  isCompleted: {
    type: Boolean,
    default: false
  },
  userRating: {
    type: Number,
    min: 1,
    max: 5
  },
  aiGenerated: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

workoutPlanSchema.index({ userId: 1, createdDate: -1 });
workoutPlanSchema.index({ userId: 1, isCompleted: 1 });

export default mongoose.model<IWorkoutPlan>('WorkoutPlan', workoutPlanSchema);