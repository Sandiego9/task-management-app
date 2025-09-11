import axios from "axios";
import { useAuthStore } from "@/store/auth";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();

    if (error.response?.status === 401 && authStore.isAuthenticated) {
      const refreshed = await authStore.refreshToken();
      if (refreshed.success) {
        // Retry the original request with the new token
        error.config.headers.Authorization = `Bearer ${authStore.token}`;
        return axios(error.config);
      } else {
        authStore.logout();
      }
    }

    return Promise.reject(error);
  }
);
