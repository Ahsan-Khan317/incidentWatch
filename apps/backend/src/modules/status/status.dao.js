import Status from "./models/status.model.js";

class StatusDAO {
  async create(data) {
    return await Status.create(data);
  }

  async findAll(filter = {}) {
    return await Status.find(filter).populate("createdBy", "name email");
  }

  async findById(id) {
    return await Status.findById(id).populate("createdBy", "name email");
  }

  async updateById(id, data) {
    return await Status.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return await Status.findByIdAndDelete(id);
  }
}

export default new StatusDAO();
