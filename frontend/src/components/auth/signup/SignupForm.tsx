import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupRequestOtp } from "@/services/authService";
import { motion, AnimatePresence } from "framer-motion";

interface SignupFormProps {
  role: "owner" | "trainer" | "member";
}

const SignupForm: React.FC<SignupFormProps> = ({ role }) => {
  const navigate = useNavigate();

  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRepassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Frontend validations
    if (!fullName.trim()) {
      setError("Full name is required");
      setLoading(false);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    if (password !== rePassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {

      const response = await signupRequestOtp({ email, role });

      if (response.success) {
        navigate("/verify-otp", { state: { email, fullName, password, role } });
      } else {
        setError(response.message);
      }

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "OTP request failed. Try again.");
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
            Signup as {role.charAt(0).toUpperCase() + role.slice(1)}
          </h2>

          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.5 }}
                className="text-red-500 mb-4 text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Re-enter Password"
              value={rePassword}
              onChange={(e) => setRepassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full bg-[#6187F0] text-white py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
