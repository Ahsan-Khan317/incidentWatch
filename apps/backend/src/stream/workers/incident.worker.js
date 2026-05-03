import { incidentDao } from "@/modules/incident/incident.dao.js";
import { getRedis } from "@/configs/redis.config.js";
import { logger } from "@/utils/logger.js";

/**
 * Worker logic for automatic incident detection
 */
export const incidentWorker = async (event) => {
  if (!event?.orgId || !event?.message || !shouldDetectIncident(event)) {
    return;
  }

  const redis = getRedis();
  const fingerprint = `${event.orgId}:${event.service || "unknown"}:${event.level}:${event.message}`;
  const dedupKey = `iw:incident:dedup:${fingerprint}`;

  // Prevent incident storms (1 min cooldown)
  const lock = await redis.set(dedupKey, "1", "EX", 60, "NX");
  if (!lock) return;

  try {
    await incidentDao.createIncident({
      title: `[${String(event.service || "service").slice(0, 40)}] ${String(event.message).slice(0, 100)}`,
      description: String(event.message),
      severity: mapSeverity(event),
      status: "open",
      source: "api",
      organizationId: event.orgId,
      serverId: event.service,
      environment: event?.metadata?.context?.environment,
      context: {
        streamEventId: event.id,
        ...(event.metadata?.context || {}),
      },
    });

    logger.debug("[IncidentWorker] Auto-incident created", { orgId: event.orgId });
  } catch (error) {
    logger.error("[IncidentWorker] Failed to create incident", error);
  }
};

const shouldDetectIncident = (event) => {
  const level = String(event?.level || "").toLowerCase();
  const severity = String(event?.severity || "").toUpperCase();
  return level === "error" || severity === "SEV1" || severity === "SEV2";
};

const mapSeverity = (event) => {
  const severity = String(event?.severity || "").toUpperCase();
  if (["SEV1", "SEV2", "SEV3"].includes(severity)) return severity;
  const level = String(event?.level || "").toLowerCase();
  if (level === "error") return "SEV2";
  if (level === "warn") return "SEV3";
  return "SEV3";
};
