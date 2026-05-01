import User from "../user/user.model.js";

export const memberDao = {
  findAllByOrganizationId: async (organizationId) => {
    return await User.find({ organizationId });
  },

  findByIdAndOrganizationId: async (id, organizationId) => {
    return await User.findOne({ _id: id, organizationId });
  },

  updateMember: async (id, organizationId, updateData) => {
    return await User.findOneAndUpdate(
      { _id: id, organizationId },
      { $set: updateData },
      { new: true, runValidators: true },
    );
  },

  deleteMember: async (id, organizationId) => {
    return await User.findOneAndDelete({ _id: id, organizationId });
  },
};
