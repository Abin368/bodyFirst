import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { AuthFormProps } from "@/types/auth"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { forgetRequestOtp } from "@/services/authService"

const ForgetPassword: React.FC = () => {


    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const location = useLocation()
    const state = location.state as AuthFormProps | null;
    const role = state?.role || 'member'

    const navigate = useNavigate()

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Invalid email format')
            setLoading(false)
            return
        }

        try{
            const response = await forgetRequestOtp(email, role)
            if(response.success){
                
                const resetToken = response.resetToken.resetToken
              
                navigate(`/verfy-reset-otp?token=${resetToken}`,{state:{email,role}})


            }else{
                setError(response.message)
            }
        }catch(err:any){
            setError(err.response?.data?.message || err.message || 'OTP request failed. Try again.')
        }finally{
            setLoading(false)
        }

    }

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-100 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-xl transform transition-all duration-500 hover:shadow-xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        Forgot Password
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50 text-gray-900 placeholder-gray-400"
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending link...' : 'Send OTP'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Remember your password?{" "}
                        <Link
                            to={`/${role}/login`}
                            className="text-indigo-600 font-medium hover:underline"
                        >
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default ForgetPassword
