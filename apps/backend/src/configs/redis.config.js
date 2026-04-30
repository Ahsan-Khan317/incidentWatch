import Redis from "ioredis";
import { ENV } from "../configs/env.config.js";

export const connectRedis = async () => {
  try {
    // Parse Redis URL to extract credentials and host
    const redisUrl = new URL(ENV.REDIS_URL);
    const password = redisUrl.password;
    const host = redisUrl.hostname;
    const port = redisUrl.port || 6379;

    const redisClient = new Redis({
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

    // Only attach error handler after connection is established
    redisClient.on("connect", () => {
      console.log(`Redis Connected: ${host}:${port}`);
    });

    await redisClient.ping();
    return redisClient;
  } catch (error) {
    console.error(`Redis Error: ${error.message}`);
    return null;
  }
};
