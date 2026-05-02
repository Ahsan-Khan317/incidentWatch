import Service from "@/modules/service/service.model.js";
import { incidentDao } from "@/modules/incident/incident.dao.js";
import { logger } from "@/utils/logger.js";

class HealthMonitor {
  constructor() {
    this.interval = null;
    this.HEARTBEAT_THRESHOLD_MS = 60000; // 1 minute
  }

  start() {
    logger.info("[HealthMonitor] Service health monitoring started...");
    this.interval = setInterval(() => this.checkHealth(), 30000); // Run every 30 seconds
  }

  async checkHealth() {
    try {
      const now = new Date();
      const cutoff = new Date(now.getTime() - this.HEARTBEAT_THRESHOLD_MS);

      // 1. Find active services that haven't sent a heartbeat recently
      const deadServices = await Service.find({
        status: "active",
        lastHeartbeat: { $lt: cutoff },
      });

      for (const service of deadServices) {
        await this._handleServiceFailure(service);
      }
    } catch (err) {
      logger.error("[HealthMonitor] Error during health check:", err.message);
    }
  }

  async _handleServiceFailure(service) {
    logger.warn(`[HealthMonitor] Service ${service.name} is offline!`);

    // 1. Mark service as error
    service.status = "error";
    await service.save();

    // 2. Create a critical incident for the service
    await incidentDao.createIncident({
      title: `Service Offline: ${service.name}`,
      description: `Service ${service.name} (${service.environment}) missed its heartbeat threshold.`,
      severity: "SEV1",
      organizationId: service.organizationId,
      serviceId: service._id,
      status: "open",
      source: "api",
      tags: ["health-monitor", "service-down"],
      serverId: service.name,
      environment: service.environment,
      assignedMembers: service.members || [],
      assignedTeams: service.teams || [],
      timeline: [
        {
          action: "Incident automatically created by Health Monitor",
          time: new Date(),
        },
        {
          action: `Auto-assigned to ${service.members?.length || 0} members and ${service.teams?.length || 0} teams`,
          time: new Date(),
        },
      ],
    });
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }
}

export default new HealthMonitor();
