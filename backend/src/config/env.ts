import dotenv from 'dotenv';
dotenv.config();

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  PORT: parseInt(getEnv('PORT', '5000'), 10),
  MONGO_URI: getEnv('MONGO_URI'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  CLIENT_URL: getEnv('CLIENT_URL', 'http://localhost:3000'),
  GEMINI_API_KEY: getEnv('GEMINI_API_KEY', ''),
} as const;
