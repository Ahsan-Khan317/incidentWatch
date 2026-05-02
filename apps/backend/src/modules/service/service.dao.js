import Service from "./service.model.js";

class ServiceDao {
  async findOne(filter) {
    return await Service.findOne(filter)
      .populate("teams")
      .populate("members", "name email profileImage");
  }

  async find(filter) {
    return await Service.find(filter)
      .populate("teams")
      .populate("members", "name email profileImage")
      .sort({ lastHeartbeat: -1 });
  }

  async updateOne(filter, update, options = {}) {
    return await Service.findOneAndUpdate(filter, update, {
      upsert: true,
      returnDocument: "after",
      runValidators: true,
      ...options,
    })
      .populate("teams")
      .populate("members", "name email profileImage");
  }

  async create(data) {
    return await Service.create(data);
  }

  async findById(id) {
    return await Service.findById(id)
      .populate("teams")
      .populate("members", "name email profileImage");
  }

  async updateById(id, update) {
    return await Service.findByIdAndUpdate(id, update, {
      returnDocument: "after",
      runValidators: true,
    })
      .populate("teams")
      .populate("members", "name email profileImage");
  }

  async deleteById(id) {
    return await Service.findByIdAndDelete(id);
  }

  async findByOrg(orgId) {
    return await Service.find({ organizationId: orgId })
      .populate("teams")
      .populate("members", "name email profileImage")
      .sort({ lastHeartbeat: -1 });
  }
}

export default new ServiceDao();
