import { ENV } from "@/configs/env.config.js";

/**
 * Log Stream Architecture Constants
 */
export const STREAM_CONFIG = {
  KEY: ENV.LOG_STREAM_KEY || "iw:logs:stream",
  MAXLEN: ENV.LOG_STREAM_MAXLEN || 10000,
  READ_COUNT: ENV.LOG_STREAM_READ_COUNT || 100,
  BLOCK_MS: ENV.LOG_STREAM_BLOCK_MS || 1000,

  // Sharding & Discovery
  ACTIVE_STREAMS_SET: "iw:logs:active_streams",
  SHARD_COUNT: 16,
};

export const CONSUMER_GROUPS = {
  LIVE_BROADCAST: "live-broadcast",
  INCIDENT_DETECTOR: "incident-detector",
};

export const WORKER_CONFIG = {
  BATCH_INTERVAL_MS: 100, // Batch emission frequency
  BATCH_SIZE_THRESHOLD: 200, // Force flush if buffer hits this
  DISCOVERY_INTERVAL_MS: 10000, // How often to check for new org streams
};
