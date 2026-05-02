import Incident from "./incident.model.js";

export const incidentDao = {
  createIncident: async (data) => {
    return await Incident.create(data);
  },

  findIncidentById: async (id) => {
    return await Incident.findById(id);
  },

  findAllByOrganization: async (organizationId) => {
    return await Incident.find({ organizationId }).sort({ createdAt: -1 });
  },

  updateIncident: async (id, data) => {
    return await Incident.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },
};
