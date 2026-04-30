export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  org_name?: string;
  oncall?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  org_name: string;
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
