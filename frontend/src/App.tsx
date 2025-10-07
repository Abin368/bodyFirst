import AppRoutes from './routes/AppRoutes'
import { authStore } from './store/authStore'
import { useEffect } from 'react'
import MemberRoutes from './routes/MemberRoutes'

const App: React.FC = () => {
  useEffect(() => {
    console.log('Initial AuthStore state:', authStore)
  }, [])

  return (
    <>
      <AppRoutes />
      <MemberRoutes />
    </>
  )
}

export default App
