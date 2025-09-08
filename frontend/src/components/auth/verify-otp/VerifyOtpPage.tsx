import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { signupVerifyOtp, signupRequestOtp } from '@/services/authService'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Header from '@/components/common/Header'

interface LocationState {
  email: string
  role: 'owner' | 'member' | 'trainer'
  fullName: string
  password: string
}

export const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | undefined

  const email = state?.email || ''
  const role = state?.role || 'owner'
  const fullName = state?.fullName || ''
  const password = state?.password || ''

  const [otp, setOtp] = useState('')
  const [counter, setCounter] = useState(0)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const expiry = localStorage.getItem('otpExpiry')
    const now = Date.now()

    if (expiry && +expiry > now) {
      setCounter(Math.ceil((+expiry - now) / 1000))
    } else {
      setCounter(30)
      localStorage.setItem('otpExpiry', (now + 30 * 1000).toString())
    }
  }, [])

  useEffect(() => {
    if (counter <= 0) return

    intervalRef.current = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current!)
  }, [counter])

  const showMessage = (msg: string, type: 'error' | 'success') => {
    if (type === 'error') setErrorMessage(msg)
    else setSuccessMessage(msg)

    setTimeout(() => {
      setErrorMessage('')
      setSuccessMessage('')
    }, 3000)
  }

  const handleVerify = async () => {
    if (!otp.trim()) return showMessage('Please enter OTP', 'error')

    setLoading(true)
    try {
      const res = await signupVerifyOtp({ email, role, fullName, password, otp })
      showMessage(res.message, 'success')

      setTimeout(() => {
        if (role === 'member') navigate('/member/dashboard')
        else navigate('/owner/dashboard')
      }, 1000)
    } catch (err: any) {
      showMessage(err.response?.data?.message || 'OTP verification failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await signupRequestOtp({ email, role })

      const newExpiry = Date.now() + 30 * 1000
      localStorage.setItem('otpExpiry', newExpiry.toString())
      setCounter(30)

      showMessage('New OTP sent to your email', 'success')
    } catch (err: any) {
      showMessage(err.response?.data?.message || 'Failed to resend OTP', 'error')
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br  px-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Verify OTP</h2>
          <p className="text-center text-gray-500 mb-4">
            Enter the OTP sent to <span className="font-medium">{email}</span>
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
              {successMessage}
            </div>
          )}

          <p className="text-center text-sm text-gray-400 mb-4">
            {counter > 0 ? `Resend available in ${counter}s` : 'You can resend OTP now'}
          </p>

          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 mb-4"
          />

          <Button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 mb-3"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <Button
            onClick={handleResend}
            disabled={counter > 0 || resending}
            className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            {resending ? 'Resending...' : 'Resend OTP'}
          </Button>
        </div>
      </div>
    </>
  )
}
