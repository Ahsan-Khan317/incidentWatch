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
    if (event?.orgId) {
      broadcaster.enqueue(logRooms.service(event.service, event.orgId), event);
    } else {
      broadcaster.enqueue(logRooms.service(event.service), event);
    }
  }
};
