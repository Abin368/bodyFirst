'use client'

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react'
import zxcvbn from 'zxcvbn'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { resetPassword } from '@/services/authService'

interface LocationState {
  role: 'owner' | 'member' | 'trainer'
}

export default function ResetPassword() {
  const location = useLocation()
  const state = location.state as LocationState | null
  const role = state?.role || 'member'

  const searchParams = new URLSearchParams(location.search)
  const resetToken = searchParams.get('token') || ''

  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [strength, setStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const requirements = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One number', valid: /\d/.test(password) },
    { label: 'One special character', valid: /[@$!%*?&#]/.test(password) },
  ]

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setStrength(zxcvbn(value).score)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(e.getModifierState('CapsLock'))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (strength < 3) {
      setError('Please choose a stronger password')
      return
    }

    try {
      const response = await resetPassword(password, confirmPassword, resetToken)
      if (response.success) {
        setSuccess(true)

        navigate(`/${role}/login`)
      } else {
        setError(response.message)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'OTP request failed. Try again.')
    }
  }

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/${role}/login`)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [success, navigate, role])

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-6">
        <div className="w-full max-w-md backdrop-blur-md bg-white/80 shadow-xl rounded-2xl border border-gray-200 p-8 relative">
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, x: 50, y: -50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50, y: -50 }}
                className="absolute top-4 right-4 flex items-center bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg shadow-lg z-50"
              >
                <CheckCircle2 className="w-6 h-6 mr-2" />
                <span>Password Reset Successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reset Password</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {capsLock && <p className="text-sm text-red-500">⚠️ Caps Lock is ON</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  strength === 0
                    ? 'w-1/5 bg-red-500'
                    : strength === 1
                      ? 'w-2/5 bg-orange-500'
                      : strength === 2
                        ? 'w-3/5 bg-yellow-500'
                        : strength === 3
                          ? 'w-4/5 bg-blue-500'
                          : 'w-full bg-green-500'
                }`}
              />
            </div>
            <p className="text-xs text-gray-500">
              {['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength]}
            </p>

            <div className="space-y-1">
              {requirements.map((req, idx) => (
                <p
                  key={idx}
                  className={`flex items-center text-sm ${req.valid ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {req.valid ? (
                    <CheckCircle2 size={16} className="mr-1" />
                  ) : (
                    <XCircle size={16} className="mr-1" />
                  )}
                  {req.label}
                </p>
              ))}
            </div>

            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
