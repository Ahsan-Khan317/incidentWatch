import { getRedis } from "@/configs/redis.config.js";
import { ENV } from "@/configs/env.config.js";
import { logger } from "@/utils/logger.js";
import { STREAM_CONFIG } from "./constants.js";

const streamBusMetrics = {
  published: 0,
  publishFailures: 0,
  consumed: 0,
  consumeFailures: 0,
  lastPublishedAt: null,
  lastConsumedAt: null,
};

export const getLogStreamBusMetrics = () => ({
  ...streamBusMetrics,
  ...STREAM_CONFIG,
});

/**
 * Get dynamic stream key based on orgId
 */
export const getOrgStreamKey = (orgId) => {
  if (!orgId) return STREAM_CONFIG.KEY;
  return `${STREAM_CONFIG.KEY}:org:${orgId}`;
};

/**
 * Publish to Redis Stream
 */
export const publishLogEvent = async (event) => {
  const redis = getRedis();
  const orgId = event?.orgId;
  const streamKey = getOrgStreamKey(orgId);
  const payload = JSON.stringify(event);

  try {
    const pipeline = redis.pipeline();
    pipeline.xadd(streamKey, "MAXLEN", "~", STREAM_CONFIG.MAXLEN, "*", "event", payload);
    if (orgId) {
      pipeline.sadd(STREAM_CONFIG.ACTIVE_STREAMS_SET, streamKey);
    }

    const results = await pipeline.exec();
    const id = results[0][1];

    streamBusMetrics.published += 1;
    streamBusMetrics.lastPublishedAt = new Date().toISOString();

    return id;
  } catch (error) {
    streamBusMetrics.publishFailures += 1;
    logger.error("[StreamBus] Failed to publish", error);
    throw error;
  }
};

/**
 * Create a consumer group for a stream
 */
export const ensureConsumerGroup = async (streamKey, groupName) => {
  const redis = getRedis();
  try {
    await redis.xgroup("CREATE", streamKey, groupName, "$", "MKSTREAM");
  } catch (error) {
    if (!String(error?.message || "").includes("BUSYGROUP")) throw error;
  }
};

/**
 * High-Performance Dynamic Consumer
 */
export const createStreamConsumer = async ({ groupName, consumerName, onEvent }) => {
  const redis = getRedis().duplicate();
  let running = true;
  let activeStreams = new Set([STREAM_CONFIG.KEY]);

  const updateStreams = async () => {
    try {
      const streams = await redis.smembers(STREAM_CONFIG.ACTIVE_STREAMS_SET);
      for (const s of streams) {
        if (!activeStreams.has(s)) {
          await ensureConsumerGroup(s, groupName);
          activeStreams.add(s);
        }
      }
    } catch (e) {
      logger.error(`[Stream:${groupName}] discovery error`, e);
    }
  };

  await ensureConsumerGroup(STREAM_CONFIG.KEY, groupName);
  await updateStreams();

  const readLoop = async () => {
    while (running) {
      try {
        const streamList = Array.from(activeStreams);
        const response = await redis.xreadgroup(
          "GROUP",
          groupName,
          consumerName,
          "COUNT",
          STREAM_CONFIG.READ_COUNT,
          "BLOCK",
          STREAM_CONFIG.BLOCK_MS,
          "STREAMS",
          ...streamList,
          ...streamList.map(() => ">"),
        );

        if (!response) continue;

        for (const [streamKey, entries] of response) {
          if (!entries?.length) continue;

          await Promise.all(
            entries.map(async ([entryId, fields]) => {
              const rawEvent = decodeStreamField(fields, "event");
              if (!rawEvent) return await redis.xack(streamKey, groupName, entryId);

              try {
                const event = JSON.parse(rawEvent);
                await onEvent(event);
                streamBusMetrics.consumed += 1;
                streamBusMetrics.lastConsumedAt = new Date().toISOString();
              } catch (e) {
                streamBusMetrics.consumeFailures += 1;
              } finally {
                await redis.xack(streamKey, groupName, entryId);
              }
            }),
          );
        }
      } catch (error) {
        await new Promise((r) => setTimeout(r, 1000));
        await updateStreams();
      }
    }
  };

  readLoop();

  return async () => {
    running = false;
    await redis.quit();
  };
};

/**
 * Fetch recent logs from a specific organization's stream.
 */
export const getRecentLogs = async (count = 500, orgId = null) => {
  const redis = getRedis();
  const streamKey = getOrgStreamKey(orgId);
  try {
    const rawEntries = await redis.xrevrange(streamKey, "+", "-", "COUNT", count);
    if (!rawEntries || rawEntries.length === 0) return [];

    return rawEntries
      .map(([id, fields]) => {
        const rawEvent = decodeStreamField(fields, "event");
        if (!rawEvent) return null;
        try {
          const event = JSON.parse(rawEvent);
          return { ...event, streamId: id };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);
  } catch (error) {
    logger.error(`[StreamBus] Failed to fetch recent logs from ${streamKey}`, error);
    return [];
  }
};

const decodeStreamField = (fields, key) => {
  if (!fields) return null;
  if (Array.isArray(fields)) {
    for (let i = 0; i < fields.length; i += 2) {
      if (fields[i] === key) return fields[i + 1];
    }
  }
  return fields[key] || null;
};
