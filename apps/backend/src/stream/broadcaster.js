import { getIO } from "@/socket/socket.js";
import { WORKER_CONFIG } from "./constants.js";

/**
 * BatchBroadcaster - Handles high-throughput log distribution
 * Groups logs by Socket.io room and emits them in batches to reduce network overhead.
 */
class BatchBroadcaster {
  constructor() {
    this.buffers = new Map();
    this.timer = setInterval(() => this.flush(), WORKER_CONFIG.BATCH_INTERVAL_MS);
    this.metrics = {
      batchesSent: 0,
      logsBroadcasted: 0,
    };
  }

  /**
   * Add a log to a specific room's buffer
   */
  enqueue(room, log) {
    if (!this.buffers.has(room)) {
      this.buffers.set(room, []);
    }
    const buffer = this.buffers.get(room);
    buffer.push(log);
    this.metrics.logsBroadcasted += 1;

    if (buffer.length >= WORKER_CONFIG.BATCH_SIZE_THRESHOLD) {
      this.flushRoom(room);
    }
  }

  flush() {
    for (const room of this.buffers.keys()) {
      this.flushRoom(room);
    }
  }

  flushRoom(room) {
    const logs = this.buffers.get(room);
    if (!logs || logs.length === 0) return;

    const io = getIO();
    if (io) {
      io.to(room).emit("logs:batch", logs);
      this.metrics.batchesSent += 1;
    }
    this.buffers.set(room, []);
  }

  stop() {
    clearInterval(this.timer);
    this.flush();
  }
}

// Singleton instance
export const broadcaster = new BatchBroadcaster();
