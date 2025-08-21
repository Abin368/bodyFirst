
import { Routes,Route } from 'react-router-dom'
import LandingOwnerPage from '@/pages/LandingOwnerPage'
import Login from '@/components/auth/Login'
import Dashboard from '@/pages/Dashboard'
import PrivateRoute from '@/components/PrivateRoute'
const AppRoutes = () => {
  return (
   <Routes>

    <Route path='/' element={<LandingOwnerPage/>}/>
    <Route path='/login' element={<Login/>}/>

    <Route path='/dashboard' element={
        <PrivateRoute>
            <Dashboard/>
        </PrivateRoute>
    }/>

    <Route path='*' element={<Login/>}/>

   </Routes>
  )
}

export default AppRoutes