import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async () => {
  if (!env.mongoUri) {
    throw new Error('Missing MongoDB connection string. Set MONGODB_URI in your environment.');
  }

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  mongoose.connection.on('error', (error) => {
    console.error('[MongoDB] connection error:', error.message);
  });

  mongoose.connection.once('open', () => {
    console.log('[MongoDB] connection established');
  });
};
