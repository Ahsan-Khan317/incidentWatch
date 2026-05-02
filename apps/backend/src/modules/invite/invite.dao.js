import Invite from "./invite.model.js";

export const inviteDao = {
  createInvite: async ({
    email,
    organizationId,
    role,
    inviteToken,
    expertise,
    tier,
    avatarColor,
  }) => {
    console.log("INVITE DAO ORG ID:", organizationId);
    return await Invite.create({
      email,
      organizationId,
      role,
      inviteToken,
      expertise,
      tier,
      avatarColor,
    });
  },

  findInviteByToken: async (token) => {
    return await Invite.findOne({ inviteToken: token });
  },

  findInviteByEmailAndOrganizationId: async (email, organizationId) => {
    return await Invite.findOne({ email, organizationId, isAccepted: false });
  },

  updateInviteStatus: async (id, isAccepted) => {
    return await Invite.findByIdAndUpdate(id, { isAccepted }, { new: true });
  },

  deleteInvite: async (id) => {
    return await Invite.findByIdAndDelete(id);
  },

  countPendingByOrganizationId: async (organizationId) => {
    return await Invite.countDocuments({ organizationId, isAccepted: false });
  },

  findAllPendingByOrganizationId: async (organizationId) => {
    return await Invite.find({ organizationId, isAccepted: false });
  },
};
