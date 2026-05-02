import api from "@/src/lib/api";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const teamApi = {
  // Members
  getMembers: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get("/members");
    return response.data;
  },

  updateMember: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.patch(`/members/${id}`, data);
    return response.data;
  },

  deleteMember: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },

  toggleOnCall: async (
    id: string,
    oncall: boolean,
  ): Promise<ApiResponse<any>> => {
    const response = await api.put(`/members/${id}`, { oncall });
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get("/members/stats");
    return response.data;
  },

  // Teams (Groups)
  getTeams: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get("/teams");
    return response.data;
  },

  createTeam: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post("/teams", data);
    return response.data;
  },

  updateTeam: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.patch(`/teams/${id}`, data);
    return response.data;
  },

  deleteTeam: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },
};
