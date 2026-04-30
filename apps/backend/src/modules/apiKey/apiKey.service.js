import apiKeyDao from "./apiKey.dao.js";
import { ApiError } from "@/utils/Error/ApiError.js";
import { generateApiKey } from "@/utils/generateToken.js";

class ApiKeyService {
  async createApiKey(orgId, name) {
    const key = generateApiKey();
    return await apiKeyDao.create({ key, orgId, name });
  }

  async getAllApiKeys(orgId) {
    return await apiKeyDao.findAll({ orgId });
  }

  async getApiKeyById(id, orgId) {
    const apiKey = await apiKeyDao.findById(id);
    if (!apiKey) {
      throw new ApiError(404, "API Key not found");
    }
    if (apiKey.orgId.toString() !== orgId.toString()) {
      throw new ApiError(403, "Unauthorized access to this API Key");
    }
    return apiKey;
  }

  async regenerateApiKey(id, orgId) {
    const apiKey = await this.getApiKeyById(id, orgId);
    const newKey = generateApiKey();
    return await apiKeyDao.updateById(id, { key: newKey });
  }

  async deleteApiKey(id, orgId) {
    await this.getApiKeyById(id, orgId);
    return await apiKeyDao.deleteById(id);
  }
}

export default new ApiKeyService();
