import Organization from "../organisation/organisation.model.js";
import User from "../user/user.model.js";

export const authDao = {
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
  findUserByEmailAndOrgId: async (email, orgid) => {
    return await User.findOne({ email, orgid });
  },
  createUser: async (userData) => {
    return await User.create(userData);
  },
  findUserById: async (id) => {
    return await User.findById(id);
  },
  findUserByIdWithOrg: async (id) => {
    return await User.findById(id).populate("orgid");
  },
  findUserByInviteTokenAndEmail: async (email, token) => {
    return await User.findOne({ email, inviteToken: token });
  },
  updateUser: async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { returnDocument: "after" });
  },
};
