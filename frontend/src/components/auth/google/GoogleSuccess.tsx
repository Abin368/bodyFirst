import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authStore } from '@/store/authStore'

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const role = searchParams.get('role')
    const userId = searchParams.get('userId')

    if (accessToken && role && userId) {
      authStore.setAuth(accessToken, role, userId)
      navigate(`/${role}/dashboard`, { replace: true })
    } else {
      navigate('/login')
    }
  }, [searchParams, navigate])

  return <div>Logging in...</div>
}

export default GoogleSuccess
