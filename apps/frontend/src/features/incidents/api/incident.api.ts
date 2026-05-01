import api from "@/src/lib/api";
import { Incident } from "../types";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const incidentApi = {
  getAllIncidents: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get("/status/all");
    return response.data;
  },

  getIncidentById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/status/${id}`);
    return response.data;
  },

  createIncident: async (
    data: Partial<Incident>,
  ): Promise<ApiResponse<any>> => {
    const response = await api.post("/status/create", data);
    return response.data;
  },

  updateIncident: async (
    id: string,
    data: Partial<Incident>,
  ): Promise<ApiResponse<any>> => {
    const response = await api.put(`/status/${id}`, data);
    return response.data;
  },

  deleteIncident: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/status/${id}`);
    return response.data;
  },
};
