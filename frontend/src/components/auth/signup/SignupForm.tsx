import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signupRequestOtp } from '@/services/authService'
import { authStore } from '@/store/authStore'
import { motion, AnimatePresence } from 'framer-motion'
import { googleLogin } from '@/services/authService'
import Footer from '@/components/common/Footer'
import type { AuthFormProps } from '@/types/auth'
import { isValidEmail } from '@/utils/validation'

const SignupForm: React.FC<AuthFormProps> = ({ role }) => {
  const navigate = useNavigate()

  const [fullName, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRepassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 2000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // --------------------------

  useEffect(() => {
    const g = (window as any).google
    if (g) {
      g.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      })
      g.accounts.id.renderButton(document.getElementById('googleBtn')!, {
        theme: 'outline',
        size: 'large',
        width: '100%',
      })
    }
  }, [])

  const handleGoogleResponse = async (response: any) => {
    const idToken = response.credential
    try {
      const data = await googleLogin(idToken, role)
      authStore.setAuth(data.accessToken, data.role, data.userId)

      switch (data.role) {
        case 'owner':
          navigate('/owner/dashboard', { replace: true })
          break
        case 'trainer':
          navigate('/trainer/dashboard', { replace: true })
          break
        case 'member':
          navigate('/member/dashboard', { replace: true })
          break
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Google signup failed.')
    }
  }

  // --------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!fullName.trim()) {
      setError('Full name is required')
      setLoading(false)
      return
    }
    if (!isValidEmail(email)) {
      setError('Invalid email format')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }
    if (password !== rePassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await signupRequestOtp({ email, role })
      if (response.success) {
        sessionStorage.setItem('signupRole', role)
        navigate('/verify-otp', { state: { email, fullName, password, role } })
      } else {
        setError(response.message)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'OTP request failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen  px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-gray-50">
        <div className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl border  bg-white/90 backdrop-blur-md from-gray-100 via-indigo-50 to-purple-100">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-b-full"></div>

          {/* Heading */}
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">
            Signup as {role.charAt(0).toUpperCase() + role.slice(1)}
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Create your account to get started
          </p>

          {/* Error */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullname(e.target.value)}
              className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <Input
              type="password"
              placeholder="Re-enter Password"
              value={rePassword}
              onChange={(e) => setRepassword(e.target.value)}
              className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />

            <Button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 text-white font-semibold shadow-md hover:scale-[1.02] hover:shadow-lg transition-transform duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Signup'}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <hr className="flex-grow border-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <hr className="flex-grow border-gray-200" />
          </div>

          <div id="googleBtn" className="mt-4 w-full"></div>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to={`/${role}/login`} className="text-indigo-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default SignupForm
