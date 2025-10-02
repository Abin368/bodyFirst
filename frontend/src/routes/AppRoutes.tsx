import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import GuestRoute from './GuestRoute'
import PrivateRoute from '@/components/PrivateRoute'
import LoadingOverlay from '@/components/common/LoadingOverlay'

// Lazy-loaded heavy pages
const OwnerDashboard = lazy(() => import('@/pages/Dashboard/OwnerDashboard'))
const TrainerDashboard = lazy(() => import('@/pages/Dashboard/TrainerDashboard'))
const MemberDashboard = lazy(() => import('@/pages/Dashboard/MemberDashboard'))
const OwnerLanding = lazy(() => import('@/pages/landingPage/OwnerLanding'))
const MemberLanding = lazy(() => import('@/pages/landingPage/MemberLanding'))
const TrainerLanding = lazy(() => import('@/pages/landingPage/TrainerLanding'))
const SuccessPayment = lazy(() => import('@/pages/owner/SuccessPayment'))

// Direct imports for small pages
import { VerifyOtpPage } from '@/components/auth/verify-otp/VerifyOtpPage'
import SignupForm from '@/components/auth/signup/SignupForm'
import LoginForm from '@/components/auth/login/LoginForm'
import GoogleSuccess from '@/components/auth/google/GoogleSuccess'
import ForgetPassword from '@/components/auth/forget-password/ForgetPassword'
import { VerifyResetOtp } from '@/components/auth/verify-otp/VerifyResetOtp'
import ResetPassword from '@/components/auth/forget-password/ResetPassword'
import NotFoundPage from '@/components/common/NotFoundPage'

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <Routes>
        {/* Landing Pages */}
        <Route
          path="/owner/landing"
          element={
            <GuestRoute role="owner">
              <OwnerLanding role="owner" />
            </GuestRoute>
          }
        />
        <Route
          path="/member/landing"
          element={
            <GuestRoute role="member">
              <MemberLanding role="member" />
            </GuestRoute>
          }
        />
        <Route
          path="/trainer/landing"
          element={
            <GuestRoute role="trainer">
              <TrainerLanding role="trainer" />
            </GuestRoute>
          }
        />

        {/* Signup */}
        <Route
          path="/owner/signup"
          element={
            <GuestRoute role="owner">
              <SignupForm role="owner" />
            </GuestRoute>
          }
        />
        <Route
          path="/trainer/signup"
          element={
            <GuestRoute role="trainer">
              <SignupForm role="trainer" />
            </GuestRoute>
          }
        />
        <Route
          path="/member/signup"
          element={
            <GuestRoute role="member">
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

        {/* Login routes */}
        <Route
          path="/owner/login"
          element={
            <GuestRoute role="owner">
              <LoginForm role="owner" />
            </GuestRoute>
          }
        />
        <Route
          path="/trainer/login"
          element={
            <GuestRoute role="trainer">
              <LoginForm role="trainer" />
            </GuestRoute>
          }
        />
        <Route
          path="/member/login"
          element={
            <GuestRoute role="member">
              <LoginForm role="member" />
            </GuestRoute>
          }
        />

        {/* Password */}
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

        {/* Google auth success */}
        <Route
          path="/auth/success"
          element={
            <GuestRoute>
              <GoogleSuccess />
            </GuestRoute>
          }
        />

        {/* Private Dashboards */}
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
        <Route
          path="/payment/success"
          element={
            <PrivateRoute>
              <SuccessPayment />
            </PrivateRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
