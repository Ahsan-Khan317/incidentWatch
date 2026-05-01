import apiKeyDao from "./apiKey.dao.js";
import { ApiError } from "@/utils/Error/ApiError.js";
import { generateApiKey } from "@/utils/generateToken.js";
import { authDao } from "../auth/auth.dao.js";

class ApiKeyService {
  async createApiKey(organizationId, name, expiresAt = null) {
    const key = generateApiKey();
    const apiKey = await apiKeyDao.create({ key, organizationId, name, expiresAt });

    // Sync with Organization
    await authDao.updateOrganization(organizationId, {
      $push: { apiKeys: apiKey._id },
    });

    return apiKey;
  }

  async getAllApiKeys(organizationId) {
    return await apiKeyDao.findAll({ organizationId });
  }

  async getApiKeyById(id, organizationId) {
    const apiKey = await apiKeyDao.findById(id);
    if (!apiKey) {
      throw new ApiError(404, "API Key not found");
    }
    if (apiKey.organizationId.toString() !== organizationId.toString()) {
      throw new ApiError(403, "Unauthorized access to this API Key");
    }
    return apiKey;
  }

  async regenerateApiKey(id, organizationId) {
    const apiKey = await this.getApiKeyById(id, organizationId);
    const newKey = generateApiKey();
    return await apiKeyDao.updateById(id, { key: newKey });
  }

  async deleteApiKey(id, organizationId) {
    const apiKey = await this.getApiKeyById(id, organizationId);
    await apiKeyDao.deleteById(id);

    // Sync with Organization
    await authDao.updateOrganization(organizationId, {
      $pull: { apiKeys: id },
    });

    return true;
  }

  async toggleApiKeyStatus(id, organizationId) {
    const apiKey = await this.getApiKeyById(id, organizationId);
    return await apiKeyDao.updateById(id, { isActive: !apiKey.isActive });
  }
}

export default new ApiKeyService();
