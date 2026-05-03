import { logRooms } from "@/socket/socket.js";
import { broadcaster } from "../broadcaster.js";

/**
 * Worker logic for broadcasting logs to WebSocket clients
 */
export const broadcastWorker = async (event) => {
  // 1. System-wide
  broadcaster.enqueue(logRooms.all, event);

  // 2. Organization-wide
  if (event?.orgId) {
    broadcaster.enqueue(logRooms.org(event.orgId), event);
  }

  // 3. Service-specific
  if (event?.service) {
    const room = event?.orgId
      ? logRooms.service(event.service, event.orgId)
      : logRooms.service(event.service);
    broadcaster.enqueue(room, event);
  }

  if (process.env.LOG_STREAM_DEBUG === "true") {
    console.log(`[BroadcastWorker] Enqueued to rooms for org: ${event?.orgId}`);
  }
};
