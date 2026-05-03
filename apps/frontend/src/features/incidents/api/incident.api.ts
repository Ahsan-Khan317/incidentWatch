import api from "@/src/lib/api";
import { Incident } from "../types";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const incidentApi = {
  getAllIncidents: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get("/incident/all");
    return response.data;
  },

  getIncidentById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/incident/get/${id}`);
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: string,
  ): Promise<ApiResponse<any>> => {
    const response = await api.patch(`/incident/status/${id}`, { status });
    return response.data;
  },

  resolveIncident: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.patch(`/incident/resolve/${id}`);
    return response.data;
  },

  createIncident: async (
    data: Partial<Incident>,
  ): Promise<ApiResponse<any>> => {
    const response = await api.post("/incident/create", data);
    return response.data;
  },

  deleteIncident: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/incident/${id}`);
    return response.data;
  },
};
