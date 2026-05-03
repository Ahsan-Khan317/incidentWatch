import { ApiError } from "../../utils/Error/ApiError.js";

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

  updateStatus: async ({ incidentId, status }) => {
    const incident = await incidentDao.findIncidentById(incidentId);

    if (!incident) {
      throw new ApiError(404, "Incident not found");
    }

    incident.status = status;

    incident.timeline.push({
      action: `Status changed to ${status}`,
    });

    await incident.save();

    return incident;
  },

  resolveIncident: async ({ incidentId }) => {
    const incident = await incidentDao.findIncidentById(incidentId);

    if (!incident) {
      throw new ApiError(404, "Incident not found");
    }

    incident.status = "resolved";

    incident.resolvedAt = new Date();

    incident.timeline.push({
      action: "Incident resolved",
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
