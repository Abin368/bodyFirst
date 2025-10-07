import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PrivateRoute from '@/components/PrivateRoute'
import LoadingOverlay from '@/components/common/LoadingOverlay'

const GymList = lazy(() => import('@/pages/member/GymList'))

const MemberRoutes = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <Routes>
        <Route
          path="/member/gym"
          element={
            <PrivateRoute>
              <GymList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  )
}

export default MemberRoutes
