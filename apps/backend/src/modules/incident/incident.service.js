import { ApiError } from "../../utils/Error/ApiError.js";
import { authDao } from "../auth/auth.dao.js";

import { incidentDao } from "./incident.dao.js";

export const incidentService = {
  createIncident: async ({ title, description, severity, createdBy, organizationId }) => {
    return await incidentDao.createIncident({
      title,
      description,
      severity,

      createdBy,
      organizationId,

      status: "open",

      timeline: [
        {
          action: "Incident created",
        },
      ],
    });
  },

  assignIncident: async ({ incidentId, assignedTo }) => {
    const incident = await incidentDao.findIncidentById(incidentId);

    if (!incident) {
      throw new ApiError(404, "Incident not found");
    }

    incident.assignedTo = assignedTo;

    incident.timeline.push({
      action: `Assigned to ${assignedTo}`,
    });

    await incident.save();

    return incident;
  },

  updateStatus: async ({ incidentId, status, userId }) => {
    const incident = await incidentDao.findIncidentById(incidentId);

    if (!incident) {
      throw new ApiError(404, "Incident not found");
    }

    const user = userId ? await authDao.findUserById(userId) : null;
    const userName = user?.name || "System";

    incident.status = status;

    // If acknowledging, add user to assigned members if not already there
    if (status === "acknowledged" && userId) {
      const assignedIds = (incident.assignedMembers || []).map((id) => id.toString());
      if (!assignedIds.includes(userId.toString())) {
        incident.assignedMembers.push(userId);
      }
    }

    incident.timeline.push({
      action: `Status changed to ${status} by ${userName}`,
    });

    await incident.save();

    return incident;
  },

  resolveIncident: async ({ incidentId, userId }) => {
    const incident = await incidentDao.findIncidentById(incidentId);

    if (!incident) {
      throw new ApiError(404, "Incident not found");
    }

    const user = userId ? await authDao.findUserById(userId) : null;
    const userName = user?.name || "System";

    incident.status = "resolved";
    incident.resolvedAt = new Date();

    incident.timeline.push({
      action: `Incident resolved by ${userName}`,
    });

    await incident.save();

    return incident;
  },

  addLog: async ({ incidentId, log }) => {
    const incident = await incidentDao.findIncidentById(incidentId);

    if (!incident) {
      throw new ApiError(404, "Incident not found");
    }

    incident.logs.push(log);

    incident.timeline.push({
      action: "Log added",
    });

    await incident.save();

    return incident;
  },

  getIncident: async ({ incidentId }) => {
    const incident = await incidentDao.findIncidentById(incidentId);

    if (!incident) {
      throw new ApiError(404, "Incident not found");
    }

    return incident;
  },

  getAllIncidents: async ({ organizationId }) => {
    return await incidentDao.findAllByOrganization(organizationId);
  },
};
