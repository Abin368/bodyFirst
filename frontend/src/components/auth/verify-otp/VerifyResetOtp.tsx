import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { forgetVerifyOtp, forgetRequestOtp } from '@/services/authService'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import type{ ResetOtpState } from '@/types/auth'


export const VerifyResetOtp: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ResetOtpState | undefined

  const email = state?.email || ''
  const role = state?.role || 'member'

  const [otp, setOtp] = useState('')
  const [counter, setCounter] = useState(0)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const searchParams = new URLSearchParams(location.search)
  const resetToken = searchParams.get('token') || ''




  useEffect(() => {
    const expiry = localStorage.getItem('forgetOtpExpiry')
    const now = Date.now()

    if (expiry && +expiry > now) {
      setCounter(Math.ceil((+expiry - now) / 1000))
    } else {
      setCounter(30)
      localStorage.setItem('forgetOtpExpiry', (now + 30 * 1000).toString())
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
      const res = await forgetVerifyOtp(email, role, otp,resetToken)
      showMessage(res.message, 'success')

      setTimeout(() => {
        navigate(`/reset-password?token=${resetToken}`, { state: { email, role } }) 
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
      await forgetRequestOtp(email, role )

      const newExpiry = Date.now() + 30 * 1000
      localStorage.setItem('forgetOtpExpiry', newExpiry.toString())
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-100 px-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
            Verify OTP
          </h2>
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
      <Footer />
    </>
  )
}
