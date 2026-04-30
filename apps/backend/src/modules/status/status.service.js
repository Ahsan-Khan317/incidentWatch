import statusDao from "./status.dao.js";
import { ApiError } from "@/utils/Error/ApiError.js";

class StatusService {
  async createStatus(statusData) {
    return await statusDao.create(statusData);
  }

  async getAllStatus(filter) {
    return await statusDao.findAll(filter);
  }

  async getStatusById(id) {
    const status = await statusDao.findById(id);
    if (!status) {
      throw new ApiError(404, "Status not found");
    }
    return status;
  }

  async updateStatus(id, updateData) {
    const status = await statusDao.updateById(id, updateData);
    if (!status) {
      throw new ApiError(404, "Status not found or update failed");
    }
    return status;
  }

  async deleteStatus(id) {
    const status = await statusDao.deleteById(id);
    if (!status) {
      throw new ApiError(404, "Status not found");
    }
    return status;
  }
}

export default new StatusService();
