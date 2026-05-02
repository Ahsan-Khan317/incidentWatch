import api from "../api";
import * as authFunctions from "@/src/features/auth/apis/auth.api";

export const authAPI = {
  login: authFunctions.loginOrganization,
  register: authFunctions.registerOrganization,
  getMe: authFunctions.fetchCurrentUser,
  logout: authFunctions.logout,
};

export const serviceAPI = {
  getServices: async () => {
    // Stub for now, return empty or mocked data
    // In a real app, this would be: return api.get("/services").then(res => res.data);
    return {
      service: {
        services: [],
      },
    };
  },
};

export const overviewAPI = {
  getOverviewMetrics: async ({ serviceId }: { serviceId?: string }) => {
    // Stub for now
    return {
      metrics: {
        totalApis: { value: 124, newThisWeek: 3 },
        uptime: { value: 99.98, last24h: 99.99, last30d: 99.95 },
        avgResponseTime: { valueMs: 142, deltaMsVsLastWeek: -8 },
        incidents: { open: 0 },
        errorRate: { value: 0.02 },
        generatedAt: new Date().toISOString(),
      },
    };
  },
};

export default {
  auth: authAPI,
  service: serviceAPI,
  overview: overviewAPI,
};
