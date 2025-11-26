import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/ai-fitness';

console.log('Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });
