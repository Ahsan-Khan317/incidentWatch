export interface ApiKey {
  _id: string;
  key: string;
  name: string;
  organizationId: string;
  isActive: boolean;
  expiresAt?: string;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApiKeyRequest {
  name: string;
  expiresAt?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}
