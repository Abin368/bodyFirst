import React, { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginUser } from '@/services/authService'
import { authStore } from '@/store/authStore'
import { observer } from 'mobx-react-lite'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '@/components/common/Footer'


export interface LoginFormProps {
  role: 'owner' | 'trainer' | 'member'
}

const LoginForm: React.FC<LoginFormProps> = observer(({ role }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (authStore.isLoading) return <div>Loading...</div>
  if (authStore.isAuthenticated) {
    return <Navigate to={`/${authStore.role}/dashboard`} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { accessToken, role: userRole, userId } = await loginUser(email, password, role)
      authStore.setAuth(accessToken, userRole, userId)
      navigate(`/${userRole}/dashboard`, { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleResponse = async (response: any) => {
    try {
      const { credential } = response
      if (!credential) throw new Error('Google credential missing')

      await authStore.loginWithGoogle(credential, role)

      switch (authStore.role) {
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
      setError(err.response?.data?.message || err.message || 'Google login failed.')
    }
  }

  useEffect(() => {

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      })
      window.google.accounts.id.renderButton(
        document.getElementById('googleBtn')!,
        { theme: 'outline', size: 'large', width: '100%' }
      )
    }
  }, [])

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-100 bg-white/90 backdrop-blur-md">
        
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-b-full"></div>

        
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">
            {role.charAt(0).toUpperCase() + role.slice(1)} Login
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Access your account securely
          </p>

       
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
            />

            <Button
             
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 text-white font-semibold shadow-md hover:scale-[1.02] hover:shadow-lg transition-transform duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Forgot password */}
          <p className="mt-5 text-center text-sm text-gray-500">
            Forgot password?{" "}
            <a
              href="/forgot-password"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Reset here
            </a>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <hr className="flex-grow border-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <hr className="flex-grow border-gray-200" />
          </div>

          {/* Google Login */}
         
         <div id="googleBtn" className="mt-4 w-full"></div>
        </div>
      </div>
      <Footer/>
    </>

  )
})

export default LoginForm
