import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import User from '../models/User';
import { generateToken } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
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

    const { email, password, name, age, gender } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
      return;
    }

    const user = new User({
      email,
      password,
      name,
      age,
      gender
    });

    await user.save();

    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        subscriptionType: user.subscriptionType
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
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

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    const token = generateToken((user._id as any).toString());

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        subscriptionType: user.subscriptionType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = (req as any).user;
    console.log('Get profile - Current user:', currentUser);

    const user = await User.findById(currentUser._id).select('-password');

    if (!user) {
      console.log('Update profile - User not found for ID:', currentUser._id);
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    console.log('Update profile - Successfully updated user:', user);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Update profile - Full req.user:', (req as any).user);

    // The auth middleware already sets req.user to the full user object
    const currentUser = (req as any).user;
    const updates = req.body;

    console.log('Update profile - Current user:', currentUser);
    console.log('Update profile - Request body:', updates);
    console.log('Update profile - User ID from user object:', currentUser._id);

    const user = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};