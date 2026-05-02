import Organization from "../organisation/organisation.model.js";
import User from "../user/user.model.js";
import Member from "../member/member.model.js";

export const authDao = {
  // ... existing functions
  findUserMemberships: async (userId) => {
    return await Member.find({ userId }).populate("organizationId", "organizationName email");
  },
  findOrganizationByEmail: async (email) => {
    return await Organization.findOne({ email });
  },
  createOrganization: async (orgData) => {
    return await Organization.create(orgData);
  },
  findOrganizationById: async (id) => {
    return await Organization.findById(id);
  },
  updateOrganization: async (id, updateData) => {
    return await Organization.findByIdAndUpdate(id, updateData, { returnDocument: "after" });
  },

  findUserByEmail: async (email) => {
    return await User.findOne({ email }).select("+password");
  },
  findUserByEmailAndOrganizationId: async (email, organizationId) => {
    const user = await User.findOne({ email });
    if (!user) return null;
    const membership = await Member.findOne({ userId: user._id, organizationId });
    return membership ? user : null;
  },
  createUser: async (userData) => {
    return await User.create(userData);
  },
  findUserById: async (id) => {
    return await User.findById(id);
  },
  findUserByInviteTokenAndEmail: async (email, token) => {
    return await User.findOne({ email, inviteToken: token });
  },
  updateUser: async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { returnDocument: "after" });
  },
};
