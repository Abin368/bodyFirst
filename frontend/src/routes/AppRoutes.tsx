import { Routes, Route } from "react-router-dom";
import OwnerDashboard from "@/pages/Dashboard/OwnerDashboard";
import TrainerDashboard from "@/pages/Dashboard/TrainerDashboard";
import MemberDashboard from "@/pages/Dashboard/MemberDashboard";
import { VerifyOtpPage } from "@/components/auth/verify-otp/VerifyOtpPage";
import OwnerLanding from "@/pages/landingPage/OwnerLanding";
import GuestRoute from "./GuestRoute";
import PrivateRoute from "@/components/PrivateRoute";
import SignupForm from "@/components/auth/signup/SignupForm";
import LoginForm from "@/components/auth/login/LoginForm";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Common Landing Page */}
      <Route path="/owner" element={<OwnerLanding />} />

    
<Route
  path="/owner/signup"
  element={
    <GuestRoute>
      <SignupForm role="owner" />
    </GuestRoute>
  }
/>
<Route
  path="/trainer/signup"
  element={
    <GuestRoute>
      <SignupForm role="trainer" />
    </GuestRoute>
  }
/>
<Route
  path="/member/signup"
  element={
    <GuestRoute>
      <SignupForm role="member" />
    </GuestRoute>
  }
/>

{/* Verify OTP */}
<Route
  path="/verify-otp"
  element={
    <GuestRoute>
      <VerifyOtpPage />
    </GuestRoute>
  }
/>


      {/* Login routes for all roles */}
      <Route
        path="/owner/login"
        element={
          <GuestRoute>
            <LoginForm role="owner" />
          </GuestRoute>
        }
      />
      <Route
        path="/trainer/login"
        element={
          <GuestRoute>
            <LoginForm role="trainer" />
          </GuestRoute>
        }
      />
      <Route
        path="/member/login"
        element={
          <GuestRoute>
            <LoginForm role="member" />
          </GuestRoute>
        }
      />

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
