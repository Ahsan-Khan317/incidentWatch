import { incidentDao } from "@/modules/incident/incident.dao.js";
import { resolveIncidentAssignment } from "@/modules/incident/incident-assignment.service.js";
import Service from "@/modules/service/service.model.js";
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
    const serviceName = event.service || "unknown";
    const title = `[${String(serviceName || "service").slice(0, 40)}] ${String(event.message).slice(0, 100)}`;
    const description = String(event.message);
    const tags = extractTags(event);
    const context = {
      streamEventId: event.id,
      ...(event.metadata?.context || {}),
    };
    const service = await Service.findOne({
      organizationId: event.orgId,
      name: serviceName,
    });
    const assignment = await resolveIncidentAssignment({
      orgId: event.orgId,
      service,
      title,
      description,
      tags,
      context,
    });

    await incidentDao.createIncident({
      title,
      description,
      severity: mapSeverity(event),
      status: "open",
      source: "api",
      organizationId: event.orgId,
      serviceId: service?._id,
      tags,
      serverId: serviceName,
      environment: event?.metadata?.context?.environment,
      context,
      assignedMembers: assignment.assignedMembers,
      assignedTeams: assignment.assignedTeams,
      timeline: [
        {
          action: "Incident automatically created by log stream worker",
          time: new Date(),
        },
        ...assignment.timeline,
      ],
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

const extractTags = (event) => {
  const metadataTags = event?.metadata?.tags;
  const contextTags = event?.metadata?.context?.tags;

  return [metadataTags, contextTags]
    .flatMap((tags) => (Array.isArray(tags) ? tags : []))
    .map((tag) => String(tag).trim())
    .filter(Boolean);
};

const mapSeverity = (event) => {
  const severity = String(event?.severity || "").toUpperCase();
  if (["SEV1", "SEV2", "SEV3"].includes(severity)) return severity;
  const level = String(event?.level || "").toLowerCase();
  if (level === "error") return "SEV2";
  if (level === "warn") return "SEV3";
  return "SEV3";
};
