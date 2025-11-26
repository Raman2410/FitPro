import mongoose, { Schema, Document } from 'mongoose';

export interface IMealAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  foodItems: {
    name: string;
    confidence: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  analysisDate: Date;
  aiConfidenceScore: number;
  dietaryScore: number;
  recommendations: string[];
}

const mealAnalysisSchema = new Schema<IMealAnalysis>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  foodItems: [{
    name: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    calories: {
      type: Number,
      required: true,
      min: 0
    },
    protein: {
      type: Number,
      required: true,
      min: 0
    },
    carbs: {
      type: Number,
      required: true,
      min: 0
    },
    fat: {
      type: Number,
      required: true,
      min: 0
    },
    fiber: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalNutrition: {
    calories: {
      type: Number,
      required: true,
      min: 0
    },
    protein: {
      type: Number,
      required: true,
      min: 0
    },
    carbs: {
      type: Number,
      required: true,
      min: 0
    },
    fat: {
      type: Number,
      required: true,
      min: 0
    },
    fiber: {
      type: Number,
      required: true,
      min: 0
    }
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  analysisDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  aiConfidenceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  dietaryScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  recommendations: [String]
}, {
  timestamps: true
});

mealAnalysisSchema.index({ userId: 1, analysisDate: -1 });

export default mongoose.model<IMealAnalysis>('MealAnalysis', mealAnalysisSchema);