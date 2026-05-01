import api from "@/src/lib/api";
import { TeamMember } from "../types";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const memberApi = {
  getMembers: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get("/members");
    return response.data;
  },

  updateMemberRole: async (
    id: string,
    role: string,
  ): Promise<ApiResponse<any>> => {
    const response = await api.put(`/members/${id}`, { role });
    return response.data;
  },

  deleteMember: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },

  // Note: Toggle status (on-duty) logic can be added here if backend supports it
  toggleOnCall: async (
    id: string,
    oncall: boolean,
  ): Promise<ApiResponse<any>> => {
    // Current backend doesn't have a specific /status toggle,
    // but we can use the generic update endpoint if needed.
    const response = await api.put(`/members/${id}`, { oncall });
    return response.data;
  },
};
