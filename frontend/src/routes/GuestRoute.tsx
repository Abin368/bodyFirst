import { Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { authStore } from '@/store/authStore'

interface Props {
  children: React.ReactNode
  role?: 'owner'| 'trainer'| 'member'
}

const GuestRoute: React.FC<Props> = observer(({ children,role}) => {


  if (authStore.isLoading) {
    return <div>Loading...</div>
  }

  if (authStore.isAuthenticated) {

      if(role && authStore.role !==role){
        return <Navigate to={`/${authStore.role}/dashboard`} replace />
      }

    switch (authStore.role) {
      case 'owner':
        return <Navigate to="/owner/dashboard" replace />
      case 'trainer':
        return <Navigate to="/trainer/dashboard" replace />
      case 'member':
        return <Navigate to="/member/dashboard" replace />
      default:
        return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
})

export default GuestRoute
