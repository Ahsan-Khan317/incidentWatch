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
    const response = await api.get("/services");
    return response.data.data;
  },
};

export const overviewAPI = {
  getOverviewMetrics: async ({ serviceId }: { serviceId?: string }) => {
    const params =
      serviceId && serviceId !== "all" ? `?serviceId=${serviceId}` : "";
    const response = await api.get(`/overview/metrics${params}`);
    return response.data.data;
  },
};

export default {
  auth: authAPI,
  service: serviceAPI,
  overview: overviewAPI,
};
