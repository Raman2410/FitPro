import { Response } from 'express';
import ProgressData from '../models/ProgressData.js';
import { AuthRequest } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

export const validateProgressData = [
  body('weight').isFloat({ min: 30, max: 300 }),
  body('bodyFat').optional().isFloat({ min: 3, max: 50 }),
];

export const addProgressData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const progressData = new ProgressData({
      userId: req.user!._id,
      date: new Date(),
      ...req.body
    });

    await progressData.save();
    res.status(201).json({ success: true, data: progressData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding progress data' });
  }
};

export const getProgressData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { timeframe = '30' } = req.query;
    const days = parseInt(timeframe as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const progressData = await ProgressData.find({
      userId: req.user!._id,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    res.json({ success: true, data: progressData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching progress data' });
  }
};

export const getProgressPredictions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const progressData = await ProgressData.find({
      userId: req.user!._id
    }).sort({ date: 1 }).limit(30);

    if (progressData.length < 7) {
      res.status(400).json({
        success: false,
        message: 'Insufficient data for predictions'
      });
      return;
    }

    const weights = progressData.map(d => d.weight);
    const dates = progressData.map((d, i) => i);
    
    const weightTrend = calculateLinearRegression(dates, weights);
    const predictedWeight = weightTrend.slope * dates.length + weightTrend.intercept;
    const currentWeight = weights[weights.length - 1];
    const weightChange = predictedWeight - currentWeight;

    res.json({
      success: true,
      predictions: {
        predictedWeight: Math.round(predictedWeight * 10) / 10,
        confidence: Math.round(weightTrend.r2 * 100),
        weeklyChange: Math.round(weightChange * 10) / 10
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating predictions' });
  }
};

function calculateLinearRegression(x: number[], y: number[]) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const yMean = sumY / n;
  const tss = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
  const rss = y.reduce((sum, yi, i) => {
    const predicted = slope * x[i] + intercept;
    return sum + Math.pow(yi - predicted, 2);
  }, 0);
  const r2 = 1 - (rss / tss);

  return { slope, intercept, r2: Math.max(0, r2) };
}