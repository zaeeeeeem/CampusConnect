import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  imageBasePath: path.resolve(process.cwd(), process.env.IMAGE_BASE_PATH ?? 'images'),
  certificateBasePath: path.resolve(process.cwd(), process.env.CERTIFICATES_PATH ?? 'certificates'),
};

export const isDevelopment = env.nodeEnv !== 'production';
