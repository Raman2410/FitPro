import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  subscriptionType: 'free' | 'premium';
  profile: {
    height: number;
    weight: number;
    fitnessGoal: string;
    dietaryRestrictions: string[];
    equipment: string[];
    bodyType?: 'Ectomorph' | 'Mesomorph' | 'Endomorph';
  };
  goals: {
    fitnessGoals?: string[];
    dailyStepGoal?: number;
    weeklyWorkouts?: number;
    preferredWorkoutTime?: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  };
  aiPreferences: {
    difficulty?: 'easy' | 'moderate' | 'hard';
    workoutLength?: number;
    equipment?: string[];
    voiceCoach?: boolean;
    voiceType?: 'male' | 'female' | 'robotic';
  };
  diet: {
    dietType?: 'Veg' | 'Non-Veg' | 'Vegan' | 'Keto' | 'High-Protein';
    calorieGoal?: number;
    allergies?: string[];
    aiMealDetection?: boolean;
  };
  notifications: {
    workout?: boolean;
    water?: boolean;
    meal?: boolean;
    progress?: boolean;
    motivation?: boolean;
    workoutTime?: string;
    waterTime?: string;
  };
  theme: {
    darkMode?: boolean;
  };
  units: {
    weight?: 'kg' | 'lbs';
    height?: 'cm' | 'ft';
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 13,
    max: 120
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  subscriptionType: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  profile: {
    height: {
      type: Number,
      min: 100,
      max: 250
    },
    weight: {
      type: Number,
      min: 30,
      max: 300
    },
    fitnessGoal: {
      type: String,
      enum: ['lose_weight', 'build_muscle', 'maintain', 'improve_endurance']
    },
    dietaryRestrictions: [String],
    equipment: [String],
    bodyType: {
      type: String,
      enum: ['Ectomorph', 'Mesomorph', 'Endomorph']
    }
  },
  goals: {
    fitnessGoals: [String],
    dailyStepGoal: {
      type: Number,
      min: 1000,
      max: 50000
    },
    weeklyWorkouts: {
      type: Number,
      min: 1,
      max: 7
    },
    preferredWorkoutTime: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Evening', 'Night']
    }
  },
  aiPreferences: {
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'hard']
    },
    workoutLength: {
      type: Number,
      min: 10,
      max: 120
    },
    equipment: [String],
    voiceCoach: {
      type: Boolean,
      default: true
    },
    voiceType: {
      type: String,
      enum: ['male', 'female', 'robotic']
    }
  },
  diet: {
    dietType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Vegan', 'Keto', 'High-Protein']
    },
    calorieGoal: {
      type: Number,
      min: 1000,
      max: 5000
    },
    allergies: [String],
    aiMealDetection: {
      type: Boolean,
      default: false
    }
  },
  notifications: {
    workout: {
      type: Boolean,
      default: true
    },
    water: {
      type: Boolean,
      default: true
    },
    meal: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Boolean,
      default: true
    },
    motivation: {
      type: Boolean,
      default: true
    },
    workoutTime: {
      type: String,
      default: '07:00'
    },
    waterTime: {
      type: String,
      default: '10:00'
    }
  },
  theme: {
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  units: {
    weight: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    },
    height: {
      type: String,
      enum: ['cm', 'ft'],
      default: 'cm'
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);