import logsService from "@/modules/logs/logs.service.js";
import { incidentDao } from "@/modules/incident/incident.dao.js";
import { resolveIncidentAssignment } from "@/modules/incident/incident-assignment.service.js";
import Service from "@/modules/service/service.model.js";
import { ENV } from "@/configs/env.config.js";
import { logger } from "@/utils/logger.js";

class SdkService {
  /**
   * Ensure service is registered and unique within organization
   */
  async _ensureServiceRegistered(serverId, orgId, environment, metadata = {}) {
    if (!serverId) return null;

    try {
      return await Service.findOneAndUpdate(
        { name: serverId, organizationId: orgId },
        {
          $set: {
            environment,
            status: "active",
            lastHeartbeat: new Date(),
          },
          $mergeObjects: ["$metadata", metadata],
        },
        { upsert: true, returnDocument: "after", runValidators: true },
      );
    } catch (err) {
      // If it's a duplicate error (though findOneAndUpdate should handle it), log it
      console.error(`[SDK] Failed to ensure service registration for ${serverId}:`, err.message);
      return null;
    }
  }

  async processIncident(data, orgId) {
    const {
      title,
      description,
      severity,
      source = "sdk",
      tags = [],
      context = {},
      breadcrumbs = [],
      serverId,
      environment,
      stack,
      timestamp,
    } = data;

    // Ensure service is registered and get it
    const service = await this._ensureServiceRegistered(serverId, orgId, environment, {
      lastIncidentAt: new Date(),
    });

    const timeline = [
      {
        action: `Incident captured from SDK (${serverId})`,
        time: timestamp ? new Date(timestamp) : new Date(),
      },
    ];

    const assignment = await resolveIncidentAssignment({
      orgId,
      service,
      title,
      description: description || title,
      tags,
      context,
    });
    timeline.push(...assignment.timeline);

    // Create incident using existing service logic but enriched with SDK data
    const incident = await incidentDao.createIncident({
      title,
      description: description || title,
      severity: severity || "low",
      organizationId: orgId,
      serviceId: service?._id,
      status: "open",
      source,
      tags,
      context,
      breadcrumbs,
      serverId,
      environment,
      stack,
      assignedMembers: assignment.assignedMembers,
      assignedTeams: assignment.assignedTeams,
      timeline,
    });

    return incident;
  }

  async processHeartbeat(data, orgId, apiKey) {
    const { serverId, environment, metrics, logs = [] } = data;

    // Ensure service is registered
    await this._ensureServiceRegistered(serverId, orgId, environment, metrics);

    // NEW: Always emit a log event for heartbeats to show live telemetry activity
    await logsService.createLog(
      {
        message: `Heartbeat: ${serverId} is active`,
        level: "info",
        service: serverId,
        context: { environment, metrics },
        tags: ["heartbeat", "sdk-internal"],
      },
      { user: { organizationId: orgId } }, // Pass orgId via mock user object
    );

    // 1. If there are logs, process them via logsService
    if (logs.length > 0) {
      for (const logItem of logs) {
        // logsService.createLog handles normalizing and saving
        await logsService.createLog(
          {
            message: typeof logItem === "string" ? logItem : logItem.message,
            level: logItem.level || "info",
            service: serverId,
            context: { environment, ...metrics },
            tags: ["heartbeat"],
          },
          { apiKeyHeader: apiKey },
        );
      }
    }

    // 2. Update server status
    return { status: "ok", receivedAt: new Date() };
  }

  async processLogs(payload, orgId, apiKey, serverId, environment) {
    const events = Array.isArray(payload?.events)
      ? payload.events
      : payload?.message
        ? [payload]
        : [];

    if (events.length === 0) {
      if (ENV.LOG_STREAM_DEBUG) {
        logger.debug("[SDK] Live logs payload empty", { serverId, orgId: String(orgId) });
      }
      return { accepted: 0 };
    }

    if (ENV.LOG_STREAM_DEBUG) {
      logger.debug("[SDK] Live logs batch received", {
        count: events.length,
        serverId,
        orgId: String(orgId),
      });
    }

    await Promise.all(
      events.map((event) =>
        logsService.createLog(
          {
            message: event.message,
            title: event.title,
            level: event.level,
            severity: event.severity,
            service: event.service || serverId || "unknown",
            tags: event.tags || [],
            breadcrumbs: event.breadcrumbs || [],
            context: {
              ...(event.context || {}),
              environment,
              sdkTimestamp: event.timestamp,
              deliveryMode: event.deliveryMode,
            },
            meta: event.meta,
            deliveryMode: event.deliveryMode,
          },
          { apiKeyHeader: apiKey },
        ),
      ),
    );

    return { accepted: events.length };
  }

  async verifyKey(orgId, serverId, environment) {
    // Register service on initial connection
    await this._ensureServiceRegistered(serverId, orgId, environment, { verifiedAt: new Date() });
    return { valid: true, orgId };
  }
}

export default new SdkService();
