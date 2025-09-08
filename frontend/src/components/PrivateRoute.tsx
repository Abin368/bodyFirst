import { Navigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { authStore } from '@/store/authStore'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = observer(({ children }) => {
  const location = useLocation()

  if (authStore.isLoading) {
    return <div>Loading...</div>
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
})

export default PrivateRoute
