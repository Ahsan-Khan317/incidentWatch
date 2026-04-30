import "./configs/env.config.js";
import { createServer } from "http";
import app from "./app.js";
import { initSocket } from "./socket/socket.js";
import { connectDB } from "./configs/db.config.js";
import { connectRedis } from "./configs/redis.config.js";

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

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`✅ Backend running on ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
