import api from "@/src/lib/api";

export interface InviteResponse {
  success: boolean;
  data: {
    inviteId: string;
    email: string;
    role: string;
    expiresAt: string;
  };
  message: string;
}

export const inviteApi = {
  sendInvite: async (email: string, role: string): Promise<InviteResponse> => {
    const response = await api.post("/invite", { email, role });
    return response.data;
  },

  acceptInvite: async (token: string): Promise<any> => {
    const response = await api.post("/accept-invite", { token });
    return response.data;
  },
};
