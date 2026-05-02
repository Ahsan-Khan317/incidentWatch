import Member from "./member.model.js";

export const memberDao = {
  createMember: async (memberData) => {
    return await Member.create(memberData);
  },

  findMemberByUserAndOrg: async (userId, organizationId) => {
    return await Member.findOne({ userId, organizationId });
  },

  findMembersByOrg: async (organizationId) => {
    return await Member.find({ organizationId }).populate("userId", "name email");
  },

  // Keep existing functions for compatibility, but update them to use Member model
  findAllByOrganizationId: async (organizationId) => {
    return await Member.find({ organizationId }).populate("userId", "name email");
  },

  findByIdAndOrganizationId: async (id, organizationId) => {
    return await Member.findOne({ _id: id, organizationId }).populate("userId", "name email");
  },

  updateMember: async (id, organizationId, updateData) => {
    return await Member.findOneAndUpdate(
      { _id: id, organizationId },
      { $set: updateData },
      { new: true, runValidators: true },
    );
  },

  deleteMember: async (id, organizationId) => {
    return await Member.findOneAndDelete({ _id: id, organizationId });
  },

  findMembersByUserId: async (userId) => {
    return await Member.find({ userId }).populate("organizationId", "organizationName email");
  },

  countByOrganizationId: async (organizationId) => {
    return await Member.countDocuments({ organizationId });
  },

  countOnCallByOrganizationId: async (organizationId) => {
    return await Member.countDocuments({ organizationId, oncall: true });
  },
};
