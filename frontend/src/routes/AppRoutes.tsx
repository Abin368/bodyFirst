import { Routes, Route } from "react-router-dom";
import OwnerDashboard from "@/pages/Dashboard/OwnerDashboard";
import TrainerDashboard from "@/pages/Dashboard/TrainerDashboard";
import MemberDashboard from "@/pages/Dashboard/MemberDashboard";
import { VerifyOtpPage } from "@/components/auth/verify-otp/VerifyOtpPage";
import OwnerLanding from "@/pages/landingPage/OwnerLanding";

import PrivateRoute from "@/components/PrivateRoute";
import SignupForm from "@/components/auth/signup/SignupForm";
import LoginForm from "@/components/auth/login/LoginForm";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Common Landing Page */}
      <Route path="/owner" element={<OwnerLanding />} />

      {/* Signup routes for all roles */}
      <Route path="/owner/signup" element={<SignupForm role="owner" />} />
      <Route path="/trainer/signup" element={<SignupForm role="trainer" />} />
      <Route path="/member/signup" element={<SignupForm role="member" />} />

      {/* Login routes for all roles */}
      <Route path="/owner/login" element={<LoginForm role="owner" />} />
      <Route path="/trainer/login" element={<LoginForm role="trainer" />} />
      <Route path="/member/login" element={<LoginForm role="member" />} />

      <Route path="/verify-otp" element={<VerifyOtpPage />} />

      {/* Dashboards (Protected by PrivateRoute) */}
      <Route
        path="/owner/dashboard"
        element={
          <PrivateRoute>
            <OwnerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/trainer/dashboard"
        element={
          <PrivateRoute>
            <TrainerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/member/dashboard"
        element={
          <PrivateRoute>
            <MemberDashboard />
          </PrivateRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<OwnerLanding />} />
    </Routes>
  );
};

export default AppRoutes;
