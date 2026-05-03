export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  organizationName?: string;
  organizationId?: string;
  oncall?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  organizationName: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  user?: AuthUser; // For registration response which has { user, organization, accessToken }
  organization?: any;
}
