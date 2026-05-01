import api from "@/src/lib/api";
import {
  ApiKey,
  ApiResponse,
  CreateApiKeyRequest,
} from "../types/apiKey.types";

export const apiKeyApi = {
  getApiKeys: async (): Promise<ApiResponse<ApiKey[]>> => {
    const response = await api.get("/api-keys/all");
    return response.data;
  },

  createApiKey: async (
    data: CreateApiKeyRequest,
  ): Promise<ApiResponse<ApiKey>> => {
    const response = await api.post("/api-keys/create", data);
    return response.data;
  },

  regenerateApiKey: async (id: string): Promise<ApiResponse<ApiKey>> => {
    const response = await api.put(`/api-keys/${id}/regenerate`);
    return response.data;
  },

  toggleApiKeyStatus: async (id: string): Promise<ApiResponse<ApiKey>> => {
    const response = await api.patch(`/api-keys/${id}/toggle-status`);
    return response.data;
  },

  deleteApiKey: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/api-keys/${id}`);
    return response.data;
  },
};
