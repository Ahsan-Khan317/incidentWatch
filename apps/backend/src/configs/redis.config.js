import Redis from "ioredis";
import { ENV } from "../configs/env.config.js";

/** @type {import("ioredis").Redis | null} */
let redisClient = null;

/**
 * Initialize the Redis singleton. Call once at server startup.
 * Subsequent calls return the existing client.
 * @returns {Promise<import("ioredis").Redis>}
 */
export const connectRedis = async () => {
  if (redisClient) return redisClient;

  try {
    const redisUrl = new URL(ENV.REDIS_URL);
    const password = redisUrl.password;
    const host = redisUrl.hostname;
    const port = redisUrl.port || 6379;

    redisClient = new Redis({
      host,
      port,
      password: password || undefined,
      tls: redisUrl.protocol === "rediss:" ? {} : undefined,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 200, 1000);
      },
    });

    redisClient.on("connect", () => {
      console.log(`✅ Redis Connected: ${host}:${port}`);
    });

    redisClient.on("error", (err) => {
      console.error(`Redis Error: ${err.message}`);
    });

    // Verify the connection
    await redisClient.ping();
    return redisClient;
  } catch (error) {
    console.error(`Redis Connection Failed: ${error.message}`);
    redisClient = null;
    throw error; // Let server.js handle startup failure
  }
};

/**
 * Get the existing Redis client singleton.
 * Must call connectRedis() first at startup.
 * @returns {import("ioredis").Redis}
 */
export const getRedis = () => {
  if (!redisClient) {
    throw new Error("Redis not initialized. Call connectRedis() first.");
  }
  return redisClient;
};
