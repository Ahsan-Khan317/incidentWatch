import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { getRedis } from "@/configs/redis.config.js";

/**
 * Socket.IO Constants
 */
export const SOCKET_EVENTS = {
  LOGS: {
    SUBSCRIBE: "subscribe:logs",
    UNSUBSCRIBE: "unsubscribe:logs",
    STREAM: "logs:stream",
    BATCH: "logs:batch",
  },
  SYSTEM: {
    CONNECT: "connection",
    DISCONNECT: "disconnect",
  },
};

export const logRooms = {
  all: "logs:all",
  org: (orgId) => `logs:org:${orgId}`,
  service: (service, orgId) =>
    orgId ? `logs:org:${orgId}:service:${service}` : `logs:service:${service}`,
};

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
    // Production tuning
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Enable Redis Adapter for multi-node scalability
  try {
    const pubClient = getRedis();
    const subClient = pubClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
    console.log("🚀 Socket.IO Redis adapter enabled");
  } catch (error) {
    console.error("❌ Socket.IO Redis adapter failed:", error.message);
  }

  io.on(SOCKET_EVENTS.SYSTEM.CONNECT, (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    /**
     * LOG SUBSCRIPTION HANDLING
     */
    socket.on(SOCKET_EVENTS.LOGS.SUBSCRIBE, (payload = {}) => {
      const { orgId, service } = payload;

      if (!orgId && !service) {
        socket.join(logRooms.all);
      } else if (orgId) {
        if (service) {
          socket.join(logRooms.service(service, orgId));
        } else {
          socket.join(logRooms.org(orgId));
        }
      } else if (service) {
        socket.join(logRooms.service(service));
      }
    });

    socket.on(SOCKET_EVENTS.LOGS.UNSUBSCRIBE, (payload = {}) => {
      const { orgId, service } = payload;

      if (!orgId && !service) {
        socket.leave(logRooms.all);
      } else {
        if (service) socket.leave(logRooms.service(service));
        if (orgId) {
          socket.leave(logRooms.org(orgId));
          if (service) socket.leave(logRooms.service(service, orgId));
        }
      }
    });

    socket.on(SOCKET_EVENTS.SYSTEM.DISCONNECT, () => {
      console.log(`👋 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) console.warn("⚠️ Socket.io not initialized!");
  return io;
};
