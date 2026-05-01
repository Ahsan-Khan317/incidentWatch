import Log from "./models/log.model.js";

class LogsDAO {
  async create(data) {
    return await Log.create(data);
  }

  async findAll(filter = {}, sort = { timestamp: -1 }) {
    return await Log.find(filter).sort(sort);
  }

  async findById(id) {
    return await Log.findById(id);
  }
}

export default new LogsDAO();
