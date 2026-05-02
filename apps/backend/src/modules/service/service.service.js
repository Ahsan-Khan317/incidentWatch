import serviceDao from "./service.dao.js";
import { ApiError } from "@/utils/Error/ApiError.js";

class ServiceService {
  async getServicesByOrg(orgId) {
    return await serviceDao.findByOrg(orgId);
  }

  async getServiceByName(orgId, name) {
    const service = await serviceDao.findOne({ organizationId: orgId, name });
    if (!service) {
      throw new ApiError(404, "Service not found");
    }
    return service;
  }

  async createService(orgId, data) {
    return await serviceDao.create({ ...data, organizationId: orgId });
  }

  async updateService(id, orgId, update) {
    const service = await serviceDao.findById(id);
    if (!service || service.organizationId.toString() !== orgId.toString()) {
      throw new ApiError(404, "Service not found or unauthorized");
    }
    return await serviceDao.updateById(id, update);
  }

  async deleteService(id, orgId) {
    const service = await serviceDao.findById(id);
    if (!service || service.organizationId.toString() !== orgId.toString()) {
      throw new ApiError(404, "Service not found or unauthorized");
    }
    return await serviceDao.deleteById(id);
  }

  async updateServiceStatus(orgId, name, status) {
    return await serviceDao.updateOne(
      { organizationId: orgId, name },
      { $set: { status, lastHeartbeat: new Date() } },
    );
  }
}

export default new ServiceService();
