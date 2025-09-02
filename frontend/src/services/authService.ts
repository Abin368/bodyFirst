import axiosInstance from "./axiosInstance";
import axios from "axios";
interface SignupRequestData {
  email: string;
  role: string;
}

interface SignupVerifyData {
  email: string;
  otp: string;
  fullName: string;
  password: string;
  role: string;
}



// Login
export const loginUser = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data; 
};


export const refreshAccessToken = async () => {
  const response = await axios.post(
    "http://localhost:8000/api/auth/refresh",
    {},
    { withCredentials: true } 
  );
  return response.data;
};

// Request OTP
export const signupRequestOtp = async (data: SignupRequestData) => {
  const response = await axiosInstance.post("/auth/signup/request-otp", data);
  console.log(response)
  return response.data;
};

// Verify OTP
export const signupVerifyOtp = async (data: SignupVerifyData) => {
  const response = await axiosInstance.post("/auth/signup/verify-otp", data);
  return response.data; 
};


export const logoutUser = async()=>{
  await axiosInstance.post('/auth/logout');
}
