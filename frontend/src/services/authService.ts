import axiosInstance from "./axiosInstance";

// Login
export const loginUser = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
};

// Refresh
export const refreshAccessToken = async () => {
  const response = await axiosInstance.post("/auth/refresh");
  return response.data;
};
