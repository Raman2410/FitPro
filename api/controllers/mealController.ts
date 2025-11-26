import { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { AuthRequest } from '../middleware/auth.js';
import MealAnalysis from '../models/MealAnalysis.js';
import User from '../models/User.js';

// Multer setup for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

export const uploadMealImage = upload.single('image');

interface FoodItem {
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

// Simplified food database (demo mode)
const FOOD_DATABASE: { [key: string]: Omit<FoodItem, 'name' | 'confidence'> } = {
  apple: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4 },
  banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3 },
  orange: { calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3 },
  grapes: { calories: 104, protein: 1.1, carbs: 27, fat: 0.2, fiber: 1.4 },
  chicken: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  salmon: { calories: 206, protein: 22, carbs: 0, fat: 13, fiber: 0 },
  rice: { calories: 205, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6 },
  pasta: { calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5 },
  yogurt: { calories: 100, protein: 10, carbs: 12, fat: 0, fiber: 0 },
  almond: { calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5 }
};

const calculateDietaryScore = (total: any, profile: any): number => {
  let score = 50;
  if (total.calories <= 600) score += 10;
  if (total.protein >= 20) score += 15;
  if (total.fiber >= 5) score += 10;
  if (total.fat <= 20) score += 10;
  if (total.carbs <= 60) score += 5;
  return Math.min(100, Math.max(0, score));
};

/** Demo food detection – picks a realistic combo based on meal type and image seed */
const analyzeFoodImage = async (buffer: Buffer, mealType?: string): Promise<FoodItem[]> => {
  const seed = buffer.slice(0, 10).reduce((a, b) => a + b, 0);
  const groups: { [key: string]: string[][] } = {
    breakfast: [
      ['yogurt', 'banana', 'almond'],
      ['apple', 'almond'],
      ['orange', 'almond']
    ],
    lunch: [
      ['chicken', 'rice', 'broccoli'],
      ['salmon', 'rice', 'spinach'],
      ['pasta', 'tomato', 'cheese']
    ],
    dinner: [
      ['salmon', 'rice', 'broccoli'],
      ['chicken', 'pasta', 'spinach'],
      ['pasta', 'tomato', 'cheese']
    ],
    snack: [
      ['apple', 'almond'],
      ['banana', 'yogurt'],
      ['grapes', 'yogurt']
    ]
  };
  const selectedGroup = (groups[mealType || 'lunch'] || groups.lunch)[seed % groups[mealType || 'lunch'].length];
  const baseConf = 0.75 + (seed % 20) / 100;
  return selectedGroup.map((food, i) => ({
    name: food,
    confidence: Math.min(0.95, baseConf + i * 0.02),
    ...FOOD_DATABASE[food]
  }));
};

export const analyzeMeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file provided' });
      return;
    }
    const { mealType } = req.body;
    if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(mealType)) {
      res.status(400).json({ success: false, message: 'Invalid meal type' });
      return;
    }
    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    // Free tier limit
    if (user.subscriptionType === 'free') {
      const count = await MealAnalysis.countDocuments({
        userId: user._id,
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      });
      if (count >= 3) {
        res.status(403).json({ success: false, message: 'Free tier limit reached' });
        return;
      }
    }
    const processed = await sharp(req.file.buffer).resize(800, 600, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
    const foodItems = await analyzeFoodImage(processed, mealType);
    const totalNutrition = foodItems.reduce((acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
      fiber: acc.fiber + item.fiber
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    const dietaryScore = calculateDietaryScore(totalNutrition, user.profile);
    const aiConfidenceScore = foodItems.reduce((a, i) => a + i.confidence, 0) / foodItems.length;
    const recommendations: string[] = [];
    if (totalNutrition.protein < 20) recommendations.push('Add more protein');
    if (totalNutrition.fiber < 5) recommendations.push('Add fiber-rich foods');
    if (totalNutrition.calories > 600) recommendations.push('Consider portion control');
    const analysis = new MealAnalysis({
      userId: user._id,
      imageUrl: `data:image/jpeg;base64,${processed.toString('base64')}`,
      foodItems,
      totalNutrition,
      mealType,
      aiConfidenceScore,
      dietaryScore,
      recommendations
    });
    await analysis.save();
    res.json({ success: true, analysis: { id: analysis._id, foodItems, totalNutrition, dietaryScore, aiConfidenceScore, recommendations, mealType, analysisDate: analysis.analysisDate } });
  } catch (err) {
    console.error('Meal analysis error:', err);
    res.status(500).json({ success: false, message: 'Error analyzing meal' });
  }
};

export const getMealHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = 10, skip = 0 } = req.query as any;
    const analyses = await MealAnalysis.find({ userId: req.user!._id })
      .sort({ analysisDate: -1 })
      .limit(Number(limit))
      .skip(Number(skip));
    const total = await MealAnalysis.countDocuments({ userId: req.user!._id });
    res.json({ success: true, analyses, pagination: { total, limit: Number(limit), skip: Number(skip), hasMore: Number(skip) + Number(limit) < total } });
  } catch (err) {
    console.error('Get meal history error:', err);
    res.status(500).json({ success: false, message: 'Error fetching history' });
  }
};

export const getMealAnalysis = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const analysis = await MealAnalysis.findOne({ _id: req.params.id, userId: req.user!._id });
    if (!analysis) {
      res.status(404).json({ success: false, message: 'Analysis not found' });
      return;
    }
    res.json({ success: true, analysis });
  } catch (err) {
    console.error('Get meal analysis error:', err);
    res.status(500).json({ success: false, message: 'Error fetching analysis' });
  }
};