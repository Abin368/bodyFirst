import { Routes, Route } from 'react-router-dom';
import OwnerDashboard from '@/pages/Dashboard/ownerDashboard';
import Login from '@/components/auth/Login';
import OwnerLanding from '@/pages/landingPage/ownerLanding';
import PrivateRoute from '@/components/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<OwnerLanding />} />
      <Route path='/login' element={<Login />} />

      <Route path='/dashboard' element={
        <PrivateRoute>
          <OwnerDashboard />
        </PrivateRoute>
      }/>

      <Route path='*' element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;
