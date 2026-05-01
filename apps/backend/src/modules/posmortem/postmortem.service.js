import { ApiError } from "../../utils/Error/ApiError.js";

import { postmortemDao } from "./postmortem.dao.js";

import Incident from "../incident/incident.model.js";

export const postmortemService = {
  createPostmortem: async ({ incidentId, summary, rootCause, resolution, prevention }) => {
    // 1. check incident
    const incident = await Incident.findById(incidentId);

    if (!incident) {
      throw new ApiError(404, "Incident not found");
    }

    // 2. incident must be resolved
    if (incident.status !== "resolved") {
      throw new ApiError(400, "Postmortem can only be created for resolved incidents");
    }

    // 3. existing postmortem
    const existingPostmortem = await postmortemDao.findPostmortemByIncidentId(incidentId);

    if (existingPostmortem) {
      throw new ApiError(400, "Postmortem already exists for this incident");
    }

    // 4. create
    return await postmortemDao.createPostmortem({
      incidentId,
      summary,
      rootCause,
      resolution,
      prevention,
      aiGenerated: false,
    });
  },

  getPostmortem: async ({ incidentId }) => {
    const postmortem = await postmortemDao.findPostmortemByIncidentId(incidentId);

    if (!postmortem) {
      throw new ApiError(404, "Postmortem not found");
    }

    return postmortem;
  },

  updatePostmortem: async ({ id, data }) => {
    const updatedPostmortem = await postmortemDao.updatePostmortem(id, data);

    if (!updatedPostmortem) {
      throw new ApiError(404, "Postmortem not found");
    }

    return updatedPostmortem;
  },

  deletePostmortem: async ({ id }) => {
    const deletedPostmortem = await postmortemDao.deletePostmortem(id);

    if (!deletedPostmortem) {
      throw new ApiError(404, "Postmortem not found");
    }

    return deletedPostmortem;
  },
};
