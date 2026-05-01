import api from "@/src/lib/api";
import { TeamMember } from "../types";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const memberApi = {
  getMembers: async (): Promise<ApiResponse<TeamMember[]>> => {
    const response = await api.get("/members/all");
    return response.data;
  },

  updateMemberRole: async (
    id: string,
    role: string,
  ): Promise<ApiResponse<TeamMember>> => {
    const response = await api.put(`/members/${id}`, { role });
    return response.data;
  },

  deleteMember: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },

  // Note: Toggle status (on-duty) is handled by the User model on backend
  toggleOnCall: async (
    id: string,
    oncall: boolean,
  ): Promise<ApiResponse<any>> => {
    // This is a placeholder since the current backend status module handles incidents
    // We would ideally have a /user/:id/toggle-oncall
    const response = await api.patch(`/members/${id}/status`, { oncall });
    return response.data;
  },
};
