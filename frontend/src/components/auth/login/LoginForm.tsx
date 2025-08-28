import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/authService";
import { authStore } from "@/store/authStore";
import { Navigate } from "react-router-dom";

export interface LoginFormProps {
  role: "owner" | "trainer" | "member";
}

const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (authStore.isLoading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  if (authStore.isAuthenticated) {
    return <Navigate to={`/${authStore.role}/dashboard`} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      
      const { accessToken, role: userRole, userId } = await loginUser(email, password);

    
      authStore.setAuth(accessToken, userRole, userId);
      console.log('after login',authStore)

      
      switch (userRole) {
        case "owner":
          navigate("/owner/dashboard",{replace:true});
          break;
        case "trainer":
          navigate("/trainer/dashboard",{replace:true});
          break;
        case "member":
          navigate("/member/dashboard",{replace:true});
          break;
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {role.charAt(0).toUpperCase() + role.slice(1)} Login
          </h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />

            <Button
              type="submit"
              className="w-full bg-[#6187F0] text-white py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Forgot your password?{" "}
            <a href="/forgot-password" className="text-blue-500 hover:underline">
              Reset here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
