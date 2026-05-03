import { createStreamConsumer, getLogStreamBusMetrics } from "../bus.js";
import { CONSUMER_GROUPS } from "../constants.js";
import { broadcastWorker } from "./broadcast.worker.js";
import { incidentWorker } from "./incident.worker.js";
import { logger } from "@/utils/logger.js";

/**
 * Worker state for metrics
 */
const workerMetrics = {
  lastInitAt: new Date().toISOString(),
};

/**
 * Aggregate metrics from bus and workers
 */
export const getLogStreamMetrics = () => ({
  workers: { ...workerMetrics },
  bus: getLogStreamBusMetrics(),
  groups: CONSUMER_GROUPS,
});

/**
 * Initialize all stream workers
 */
export const startLogStreamWorkers = async () => {
  const workerId = `worker-${process.pid}`;

  // 1. WebSocket Broadcaster
  const stopBroadcast = await createStreamConsumer({
    groupName: CONSUMER_GROUPS.LIVE_BROADCAST,
    consumerName: `${workerId}-broadcast`,
    onEvent: broadcastWorker,
  });

  // 2. Incident Detector
  const stopIncident = await createStreamConsumer({
    groupName: CONSUMER_GROUPS.INCIDENT_DETECTOR,
    consumerName: `${workerId}-incident`,
    onEvent: incidentWorker,
  });

  logger.success("Stream workers initialized", {
    id: workerId,
    groups: Object.values(CONSUMER_GROUPS),
  });

  return async () => {
    await Promise.all([stopBroadcast(), stopIncident()]);
  };
};
