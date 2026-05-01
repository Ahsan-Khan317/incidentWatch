import ApiKey from "./models/apiKey.model.js";

class ApiKeyDAO {
  async create(data) {
    return await ApiKey.create(data);
  }

  async findAll(filter = {}) {
    return await ApiKey.find(filter);
  }

  async findById(id) {
    return await ApiKey.findById(id);
  }

  async findOne(filter = {}) {
    return await ApiKey.findOne(filter);
  }

  async updateById(id, data) {
    return await ApiKey.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id) {
    return await ApiKey.findByIdAndDelete(id);
  }
}

export default new ApiKeyDAO();
