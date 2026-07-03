/**
 * Environment configuration module
 * Validates and exports all environment variables with type safety
 */

import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

/**
 * Schema for validating environment variables
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
  
  // Server
  PORT: z.string().transform(Number).default("3001"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // AI Services
  OPENAI_API_KEY: z.string().optional(),
  REPLICATE_API_TOKEN: z.string().optional(),
  
  // YouTube
  YOUTUBE_CLIENT_ID: z.string().optional(),
  YOUTUBE_CLIENT_SECRET: z.string().optional(),
  YOUTUBE_REDIRECT_URI: z.string().url().optional(),
  
  // TikTok
  TIKTOK_CLIENT_KEY: z.string().optional(),
  TIKTOK_CLIENT_SECRET: z.string().optional(),
  
  // Storage
  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_FILE_SIZE: z.string().transform(Number).default("104857600"),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default("900000"),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default("100"),
});

/**
 * Validated environment configuration type
 */
export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables
 * @returns Validated environment configuration
 * @throws Error if validation fails
 */
function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error("Environment validation errors:", result.error.format());
    throw new Error("Invalid environment configuration");
  }
  
  return result.data;
}

/** Validated environment configuration */
export const env = validateEnv();

/** Check if running in production mode */
export const isProduction = env.NODE_ENV === "production";

/** Check if running in development mode */
export const isDevelopment = env.NODE_ENV === "development";

/** Check if running in test mode */
export const isTest = env.NODE_ENV === "test";
