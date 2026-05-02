import api from "@/src/lib/api";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const inviteApi = {
  getInvites: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get("/invite");
    return response.data;
  },

  sendInvite: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post("/invite", data);
    return response.data;
  },

  revokeInvite: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/invite/${id}`);
    return response.data;
  },
};
