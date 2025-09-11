import { Routes, Route } from 'react-router-dom'
import OwnerDashboard from '@/pages/Dashboard/OwnerDashboard'
import TrainerDashboard from '@/pages/Dashboard/TrainerDashboard'
import MemberDashboard from '@/pages/Dashboard/MemberDashboard'
import { VerifyOtpPage } from '@/components/auth/verify-otp/VerifyOtpPage'
import OwnerLanding from '@/pages/landingPage/OwnerLanding'
import GuestRoute from './GuestRoute'
import PrivateRoute from '@/components/PrivateRoute'
import SignupForm from '@/components/auth/signup/SignupForm'
import LoginForm from '@/components/auth/login/LoginForm'
import GoogleSuccess from '@/components/auth/google/GoogleSuccess'
import ForgetPassword from '@/components/auth/forget-password/ForgetPAssword'
import { VerifyResetOtp } from '@/components/auth/verify-otp/VerifyResetOtp'
import ResetPassword from '@/components/auth/forget-password/ResetPassword'
const AppRoutes = () => {
  return (
    <Routes>
      {/* Common Landing Page */}
      <Route path="/owner" element={<OwnerLanding />} />

      <Route
        path="/owner/signup"
        element={
          <GuestRoute role='owner'>
            <SignupForm role="owner" />
          </GuestRoute>
        }
      />
      <Route
        path="/trainer/signup"
        element={
          <GuestRoute role='trainer'>
            <SignupForm role="trainer" />
          </GuestRoute>
        }
      />
      <Route
        path="/member/signup"
        element={
          <GuestRoute role='member'>
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
          <GuestRoute role='owner'>
            <LoginForm role="owner" />
          </GuestRoute>
        }
      />
      <Route
        path="/trainer/login"
        element={
          <GuestRoute role='trainer'>
            <LoginForm role="trainer" />
          </GuestRoute>
        }
      />
      <Route
        path="/member/login"
        element={
          <GuestRoute role='member'>
            <LoginForm role="member" />
          </GuestRoute>
        }
      />

     

      <Route
        path="/verify-otp"
        element={
          <GuestRoute>
            <VerifyOtpPage />
          </GuestRoute>
        }
      />

      <Route
        path="/forget-password"
        element={
          <GuestRoute>
            <ForgetPassword />
          </GuestRoute>
        }
      />

      <Route
        path="/verfy-reset-otp"
        element={
          <GuestRoute>
            <VerifyResetOtp />
          </GuestRoute>
        }
      />

      <Route
        path="/reset-password"
        element={
          <GuestRoute>
            <ResetPassword />
          </GuestRoute>
        }
      />


      <Route
        path="/auth/success"
        element={
          <GuestRoute>
            <GoogleSuccess />
          </GuestRoute>
        }
      />


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
  )
}

export default AppRoutes
