import logsDao from "./logs.dao.js";
import { ApiError } from "@/utils/Error/ApiError.js";

class LogsService {
  async createLog(data) {
    return await logsDao.create(data);
  }

  async getAllLogs(filter) {
    return await logsDao.findAll(filter);
  }

  async getLogById(id, orgId) {
    const log = await logsDao.findById(id);
    if (!log) {
      throw new ApiError(404, "Log not found");
    }
    if (log.orgId.toString() !== orgId.toString()) {
      throw new ApiError(403, "Unauthorized access to this log");
    }
    return log;
  }
}

export default new LogsService();
