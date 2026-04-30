import Redis from "ioredis";
import { ENV } from "../../../configs/env.config.js";

let redisClient = null;

/**
 * Get or create Redis singleton connection
 * @returns {Promise<Redis|null>}
 */
export const getRedisClient = async () => {
  if (redisClient && redisClient.status === "ready") {
    return redisClient;
  }

  try {
    const redisUrl = new URL(ENV.REDIS_URL);
    const password = redisUrl.password;
    const host = redisUrl.hostname;
    const port = redisUrl.port || 6379;

    redisClient = new Redis({
      host,
      port,
      password: password || undefined,
      tls: redisUrl.protocol === "rediss" ? {} : undefined,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 200, 1000);
      },
    });

    redisClient.on("connect", () => {
      console.log(`Redis Connected: ${host}:${port}`);
    });

    redisClient.on("error", (err) => {
      console.error(`Redis Error: ${err.message}`);
    });

    await redisClient.ping();
    return redisClient;
  } catch (error) {
    console.error(`Redis Connection Error: ${error.message}`);
    return null;
  }
};

/**
 * Close Redis connection
 */
export const closeRedisConnection = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};

export default getRedisClient;
