import api from "@/src/lib/api";
import { Service, CreateServiceInput, UpdateServiceInput } from "../types";

export const serviceApi = {
  getServices: async (): Promise<Service[]> => {
    const response = await api.get("/services");
    return response.data.data;
  },

  getServiceDetails: async (name: string): Promise<Service> => {
    const response = await api.get(`/services/${name}`);
    return response.data.data;
  },

  createService: async (data: CreateServiceInput): Promise<Service> => {
    const response = await api.post("/services", data);
    return response.data.data;
  },

  updateService: async (
    id: string,
    data: UpdateServiceInput,
  ): Promise<Service> => {
    const response = await api.patch(`/services/${id}`, data);
    return response.data.data;
  },

  deleteService: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};
