import { useState, useEffect, useCallback } from "react";
import { apiKeyApi } from "../api/apiKey.api";
import { ApiKey, CreateApiKeyRequest } from "../types/apiKey.types";

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKeys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiKeyApi.getApiKeys();
      setApiKeys(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch API keys");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createApiKey = async (data: CreateApiKeyRequest) => {
    try {
      const response = await apiKeyApi.createApiKey(data);
      setApiKeys((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to create API key");
    }
  };

  const regenerateApiKey = async (id: string) => {
    try {
      const response = await apiKeyApi.regenerateApiKey(id);
      setApiKeys((prev) =>
        prev.map((key) => (key._id === id ? response.data : key)),
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to regenerate API key");
    }
  };

  const toggleApiKeyStatus = async (id: string) => {
    try {
      const response = await apiKeyApi.toggleApiKeyStatus(id);
      setApiKeys((prev) =>
        prev.map((key) => (key._id === id ? response.data : key)),
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to toggle API key status");
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      await apiKeyApi.deleteApiKey(id);
      setApiKeys((prev) => prev.filter((key) => key._id !== id));
    } catch (err: any) {
      throw new Error(err.message || "Failed to delete API key");
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  return {
    apiKeys,
    isLoading,
    error,
    refresh: fetchApiKeys,
    createApiKey,
    regenerateApiKey,
    toggleApiKeyStatus,
    deleteApiKey,
  };
};
