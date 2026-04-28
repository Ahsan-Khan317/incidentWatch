import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  ACCESS_TOKEN_SECRET: z.string().min(8),
  ACCESS_TOKEN_EXPIRY: z.string().default("1d"),

  REFRESH_TOKEN_SECRET: z.string().min(8),
  REFRESH_TOKEN_EXPIRY: z.string().default("10d"),

  CORS_ORIGIN: z
    .string()
    .default("*")
    .transform((val) => val.split(",").map((s) => s.trim())),

  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  REDIS_URL: z.string().default("redis://localhost:6379"),

  // ADMIN
  ADMIN_EMAIL: z.string().email().default("admin@gmail.com"),
  ADMIN_PASSWORD: z.string().min(8).default("admin123"),

  // EMAIL
  RESEND_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid ENV:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const ENV = parsed.data;
