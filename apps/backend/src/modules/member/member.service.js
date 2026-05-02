import mongoose from "mongoose";
import { memberDao } from "./member.dao.js";
import { ApiError } from "../../utils/Error/ApiError.js";

export const memberService = {
  getAllMembers: async (organizationId) => {
    const members = await memberDao.findAllByOrganizationId(organizationId);
    return members.map((m) => {
      const memberObj = m.toObject();
      return {
        _id: memberObj._id,
        userId: memberObj.userId?._id,
        name: memberObj.userId?.name,
        email: memberObj.userId?.email,
        role: memberObj.role,
        oncall: memberObj.oncall,
        isActive: memberObj.isActive,
        expertise: memberObj.expertise,
        tier: memberObj.tier,
        avatarColor: memberObj.avatarColor,
        createdAt: memberObj.createdAt,
      };
    });
  },

  getMemberById: async (id, organizationId) => {
    const member = await memberDao.findByIdAndOrganizationId(id, organizationId);
    if (!member) {
      throw new ApiError(404, "Member not found");
    }
    const memberObj = member.toObject();
    return {
      _id: memberObj._id,
      userId: memberObj.userId?._id,
      name: memberObj.userId?.name,
      email: memberObj.userId?.email,
      role: memberObj.role,
      oncall: memberObj.oncall,
      isActive: memberObj.isActive,
      expertise: memberObj.expertise,
      tier: memberObj.tier,
      avatarColor: memberObj.avatarColor,
      createdAt: memberObj.createdAt,
    };
  },

  updateMemberFields: async (id, organizationId, updateData) => {
    // Filter out undefined values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined),
    );

    const member = await memberDao.updateMember(id, organizationId, cleanUpdateData);
    if (!member) {
      throw new ApiError(404, "Member not found");
    }
    return member;
  },

  deleteMember: async (id, organizationId, currentUserId) => {
    // Admin protection: Cannot delete self
    if (id.toString() === currentUserId.toString()) {
      throw new ApiError(400, "You cannot delete yourself from the organization");
    }

    const member = await memberDao.deleteMember(id, organizationId);
    if (!member) {
      throw new ApiError(404, "Member not found");
    }
    return member;
  },

  getTeamStats: async (organizationId) => {
    const totalMembers = await memberDao.countByOrganizationId(organizationId);
    const onCallMembers = await memberDao.countOnCallByOrganizationId(organizationId);
    const pendingInvites = await mongoose
      .model("Invite")
      .countDocuments({ organizationId, isAccepted: false });
    const activeIncidents = await mongoose.model("Incident").countDocuments({
      organizationId,
      status: { $in: ["open", "acknowledged"] },
    });

    // Get members to calculate performance
    const members = await memberDao.findMembersByOrg(organizationId);

    const recentActivity = await Promise.all(
      members.map(async (member) => {
        const resolvedCount = await mongoose.model("Incident").countDocuments({
          organizationId,
          status: "resolved",
          assignedMembers: member.userId?._id,
        });

        return {
          name: member.userId?.name,
          email: member.userId?.email,
          resolved: resolvedCount,
          status: member.oncall ? "Active" : "Closed",
          dutyCycle: "Recent Shift",
        };
      }),
    );

    return {
      totalEngineers: totalMembers,
      onCallNow: onCallMembers,
      activeIncidents,
      pendingInvites,
      recentActivity: recentActivity.sort((a, b) => b.resolved - a.resolved).slice(0, 5),
    };
  },
};
