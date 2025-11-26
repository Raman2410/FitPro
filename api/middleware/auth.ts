import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
};

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
      return;
    }

    console.log('Auth middleware - Received token:', token.substring(0, 20) + '...');
    const decoded = verifyToken(token);
    console.log('Auth middleware - Decoded token:', decoded);
    console.log('Auth middleware - Looking for userId:', decoded.userId);

    const user = await User.findById(decoded.userId).select('-password');
    console.log('Auth middleware - Found user:', user);
    console.log('Auth middleware - User ID from DB:', user?._id);

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid token.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

export const requirePremium = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  if (req.user.subscriptionType !== 'premium') {
    res.status(403).json({
      success: false,
      message: 'Premium subscription required for this feature.'
    });
    return;
  }

  next();
};