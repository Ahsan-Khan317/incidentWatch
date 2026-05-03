import api from "@/src/lib/api";

export interface Log {
  _id?: string;
  id?: string;
  streamId?: string;
  message: string;
  level: string;
  service?: string;
  timestamp: string;
  orgId: string;
  metadata?: any;
}

export const logsApi = {
  getLogs: async (serviceId?: string) => {
    try {
      const params =
        serviceId && serviceId !== "all" ? { service: serviceId } : {};
      const response = await api.get("/logs", { params });
      console.log("📡 API Response [/logs]:", response.data);
      return response.data.data as Log[];
    } catch (error) {
      console.error("❌ API Error [/logs]:", error);
      throw error;
    }
  },
};
