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
      createdAt: memberObj.createdAt,
    };
  },

  updateMemberRole: async (id, organizationId, role) => {
    const member = await memberDao.updateMember(id, organizationId, { role });
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
};
