import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Attempt to load from server/.env regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const env = {
  PORT: parseInt(process.env.PORT, 10) || 3001,
  REDIS_URL: process.env.REDIS_URL,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 50 * 1024 * 1024, // 50MB
  MAX_FILES_PER_TRANSFER: parseInt(process.env.MAX_FILES_PER_TRANSFER, 10) || 5,
  TRANSFER_EXPIRY_MINUTES: parseInt(process.env.TRANSFER_EXPIRY_MINUTES, 10) || 15,
  MAX_TOTAL_STORAGE: parseInt(process.env.MAX_TOTAL_STORAGE, 10) || 8 * 1024 * 1024 * 1024, // 8GB
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
};

const required = [
  'REDIS_URL',
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
];

for (const key of required) {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export default env;
