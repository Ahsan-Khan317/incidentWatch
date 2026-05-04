import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  ACCESS_TOKEN_SECRET: z.string().min(8),
  ACCESS_TOKEN_EXPIRY: z.string().default("1d"),

  FRONTEND_URL: z.string().default("http://localhost:3000").optional(),
  BACKEND_URL: z.string().default("http://localhost:8000").optional(),

  REFRESH_TOKEN_SECRET: z.string().min(8),
  REFRESH_TOKEN_EXPIRY: z.string().default("10d"),

  INVITE_TOKEN_SECRET: z.string().min(8).optional(),
  INVITE_TOKEN_EXPIRY: z.string().default("7d").optional(),

  VERIFICATION_TOKEN_SECRET: z.string().min(8).optional(),
  VERIFICATION_TOKEN_EXPIRY: z.string().default("120d").optional(),

  CORS_ORIGIN: z
    .string()
    .default("*")
    .transform((val) => val.split(",").map((s) => s.trim())),
  BACKEND_URL: z.string().default("http://localhost:8000"),

  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  REDIS_URL: z.string().default("redis://localhost:6379"),
  LOG_STREAM_KEY: z.string().default("iw:logs:stream"),
  LOG_STREAM_MAXLEN: z.coerce.number().default(10000),
  LOG_STREAM_READ_COUNT: z.coerce.number().default(50),
  LOG_STREAM_BLOCK_MS: z.coerce.number().default(1000),
  LOG_STREAM_DEBUG: z.coerce.boolean().default(false),
  SESSION_TTL: z.coerce.number().default(604800), // 7 days in seconds

  // ADMIN
  ADMIN_EMAIL: z.string().email().default("admin@gmail.com"),
  ADMIN_PASSWORD: z.string().min(8).default("admin123"),

  // EMAIL
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().default("no-reply@edulaunch.shop"),

  // GOOGLE
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REFRESH_TOKEN: z.string().optional(),
  GOOGLE_USER: z.string().email().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid ENV:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const ENV = parsed.data;
