import { Navigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { authStore } from '@/store/authStore'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = observer(({ children }) => {
  const location = useLocation()

  const pathnameRole = location.pathname.split('/')[1]


  if (authStore.isLoading) {
    return <div>Loading...</div>
  }

  if (!authStore.isAuthenticated) {
    if(['owner','trainer','member'].includes(pathnameRole)){
       return <Navigate to={`/${pathnameRole}/login`} state={{ from: location }} replace />
    }
   
      return <Navigate to="/" replace/>
  }

  return <>{children}</>
})

export default PrivateRoute
