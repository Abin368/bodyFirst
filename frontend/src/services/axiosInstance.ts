import axios from "axios";
import { authStore } from "@/store/authStore";
import { refreshAccessToken } from "./authService";


declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const axiosInstance = axios.create({
baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",

  withCredentials: true,
});

// Add access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    if (authStore.accessToken) {
      config.headers!["Authorization"] = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const data = await refreshAccessToken();
        authStore.setAuth(data.accessToken, data.role, data.userId);

        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        authStore.clearAuth();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
