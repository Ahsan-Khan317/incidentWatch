import "./configs/env.config.js";
import { createServer } from "http";
import app from "./app.js";
import { initSocket } from "./socket/socket.js";
import { connectDB } from "./configs/db.config.js";
import { connectRedis } from "./configs/redis.config.js";
import { logger } from "./utils/logger.js";
import healthMonitor from "./services/HealthMonitor.service.js";
import { startLogStreamWorkers } from "./stream/workers/index.js";

const startServer = async () => {
  try {
    // Connect to Database first
    await connectDB();

    // Then connect to Redis
    await connectRedis();

    // Create HTTP server
    const server = createServer(app);

    // Initialize Socket.io
    initSocket(server);

    // Start stream consumers for realtime broadcast + incident inspection
    const stopWorkers = await startLogStreamWorkers();

    // Start background health monitoring
    healthMonitor.start();

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      logger.success(`Backend running on ${PORT}`);
    });

    let shuttingDown = false;

    const shutdown = async (signal) => {
      if (shuttingDown) return;
      shuttingDown = true;

      logger.info(`Shutdown signal received: ${signal}`);

      try {
        await stopWorkers();
      } catch (error) {
        logger.error("Failed to stop stream workers cleanly", error);
      }

      server.close((error) => {
        if (error) {
          logger.error("Failed to close HTTP server cleanly", error);
          process.exit(1);
        }
        logger.success("HTTP server closed cleanly");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error(`Failed to start server`, error);
    process.exit(1);
  }
};

startServer();
