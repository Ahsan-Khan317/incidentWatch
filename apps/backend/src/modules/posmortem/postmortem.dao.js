import Postmortem from "./postmortem.model.js";

export const postmortemDao = {
  createPostmortem: async (data) => {
    return await Postmortem.create(data);
  },

  findPostmortemByIncidentId: async (incidentId) => {
    return await Postmortem.findOne({ incidentId });
  },

  findPostmortemById: async (id) => {
    return await Postmortem.findById(id);
  },

  updatePostmortem: async (id, data) => {
    return await Postmortem.findByIdAndUpdate(id, data, { new: true });
  },

  deletePostmortem: async (id) => {
    return await Postmortem.findByIdAndDelete(id);
  },
};
