import api from "@/src/lib/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  AuthUser,
} from "@/src/features/auth/types";

// Standard Backend Response Wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function loginOrganization(
  credentials: LoginPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<ApiResponse<AuthResponse>>(
    "/auth/orglogin",
    credentials,
  );
  return data.data;
}

export async function registerOrganization(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<ApiResponse<AuthResponse>>(
    "/auth/orgregister",
    payload,
  );
  return data.data;
}

export async function fetchCurrentUser(token?: string): Promise<AuthUser> {
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const { data } = await api.get<ApiResponse<AuthUser>>("/auth/getme", {
    headers,
  });
  return data.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
