import AppRoutes from './routes/AppRoutes'
import { authStore } from './store/authStore'
import { useEffect } from 'react'

const App: React.FC = () => {
  useEffect(() => {
    console.log('Initial AuthStore state:', authStore)
  }, [])

  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
