import teamDao from "./team.dao.js";
import { ApiError } from "@/utils/Error/ApiError.js";

class TeamService {
  async createTeam(orgId, data) {
    return await teamDao.create({ ...data, organizationId: orgId });
  }

  async getTeamsByOrg(orgId) {
    return await teamDao.findByOrg(orgId);
  }

  async updateTeam(id, orgId, update) {
    const team = await teamDao.findById(id);
    if (!team || team.organizationId.toString() !== orgId.toString()) {
      throw new ApiError(404, "Team not found or unauthorized");
    }
    return await teamDao.updateById(id, update);
  }

  async deleteTeam(id, orgId) {
    const team = await teamDao.findById(id);
    if (!team || team.organizationId.toString() !== orgId.toString()) {
      throw new ApiError(404, "Team not found or unauthorized");
    }
    return await teamDao.deleteById(id);
  }
}

export default new TeamService();
