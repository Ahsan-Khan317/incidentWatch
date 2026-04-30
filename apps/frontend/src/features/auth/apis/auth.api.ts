import api from "@/src/lib/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/src/features/auth/types";

export async function loginOrganization(
  credentials: LoginPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/orglogin", credentials);
  return data;
}

export async function registerOrganization(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/orgregister", payload);
  return data;
}

export async function fetchCurrentUser(
  token: string,
): Promise<AuthResponse["user"]> {
  const { data } = await api.get<AuthResponse["user"]>("/auth/getme", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}
