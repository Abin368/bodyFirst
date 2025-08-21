
import Header from "../common/Header"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useState } from "react"
import {useNavigate} from 'react-router-dom'
import { loginUser } from "@/services/auth"

const Login:React.FC = () => {
    const navigate = useNavigate()

    const [email,setEmail] =useState('')
    const [password ,setPassword] =useState('')
    
    const [error,setError]=useState<string | null>(null)

    const handleSubmit = async(e:React.FormEvent) =>{
        e.preventDefault()
      
        try{
            const data = await loginUser(email,password)
            localStorage.setItem('accessToken',data.accessToken)
            navigate('/dashboard')
        }catch(err:any){
            setError(err.response?.data?.message || 'Login Failed')
        }
    }
  return (
    <>
    
    <Header/>
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login to your Account</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <Input type="email" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                    className="w-full"/>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Password</label>
                    <Input type="password" 
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Enter Password"
                    required
                    className="w-full"/>
                </div>

                <Button type="submit" className="w-full bg-[#6187F0] text-white py-2 rounded-xl hover:bg-blue-700" >
                   Login
                </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
                 Forgot your password?{' '}
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Reset here
          </a>
            </p>
        </div>
    </div>
    
    </>
  )
}

export default Login