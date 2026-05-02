import Team from "./team.model.js";

class TeamDao {
  async create(data) {
    return await Team.create(data);
  }

  async findByOrg(orgId) {
    return await Team.find({ organizationId: orgId }).populate("members", "name email");
  }

  async findById(id) {
    return await Team.findById(id).populate("members", "name email");
  }

  async updateById(id, update) {
    return await Team.findByIdAndUpdate(id, update, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  async deleteById(id) {
    return await Team.findByIdAndDelete(id);
  }
}

export default new TeamDao();
