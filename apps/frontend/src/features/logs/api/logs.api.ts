import api from "@/src/lib/api";

export interface Log {
  _id: string;
  message: string;
  level: string;
  service?: string;
  timestamp: string;
  orgId: string;
  metadata?: any;
}

export const logsApi = {
  getLogs: async () => {
    try {
      const response = await api.get("/logs");
      console.log("📡 API Response [/logs]:", response.data);
      return response.data.data as Log[];
    } catch (error) {
      console.error("❌ API Error [/logs]:", error);
      throw error;
    }
  },
};
