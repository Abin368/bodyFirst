import axiosInstance from "./axiosInstance";

interface SignupRequestData {
  email: string;
  role: string;
}

interface SignupVerifyData {
  email: string;
  otp: string;
  fullName: string,
  password: string,
  role: string;
}

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

// Request OTP
export const signupRequestOtp = async (data: SignupRequestData) => {
  try {
    const res = await axiosInstance.post('/auth/signup/request-otp', data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};



export const signupVerifyOtp = async (data: SignupVerifyData) => {
  const response = await axiosInstance.post("/auth/signup/verify-otp", data);
  return response.data;
};
