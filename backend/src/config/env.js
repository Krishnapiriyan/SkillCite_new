import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(8),
  JWT_REFRESH_SECRET: z.string().min(8),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  R2_ACCOUNT_ID: z.string().optional().or(z.literal('')),
  R2_ACCESS_KEY_ID: z.string().optional().or(z.literal('')),
  R2_SECRET_ACCESS_KEY: z.string().optional().or(z.literal('')),
  R2_BUCKET_NAME: z.string().optional().or(z.literal('')),
  R2_PUBLIC_URL: z.string().optional().or(z.literal('')),
  
  BREVO_API_KEY: z.string().optional().or(z.literal('')),
  BREVO_SENDER_EMAIL: z.string().email().default('no-reply@skillcite.com'),
  BREVO_SENDER_NAME: z.string().default('SkillCite'),
  ADMIN_ALERT_EMAIL: z.string().email().default('admin@skillcite.com'),
  
  GROQ_API_KEY: z.string().optional().or(z.literal('')),
  
  PORT: z.string().or(z.number()).transform((val) => typeof val === 'string' ? parseInt(val, 10) : val).default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGINS: z.string().default('http://localhost:5173,http://localhost:5174')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export default parsed.data;
