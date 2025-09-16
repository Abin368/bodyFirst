import type React from 'react'
import { Button } from '../ui/button'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { authStore } from '@/store/authStore'
import { logoutUser } from '@/services/authService'

const Header: React.FC = observer(() => {
  const location = useLocation()

  const navigate = useNavigate()
  const validRoles = ['owner', 'trainer', 'member'] as const
  type Role = (typeof validRoles)[number]

  const pathnameRole = location.pathname.split('/')[1]
  const storedRole = sessionStorage.getItem('signupRole') as Role | null

  const role: Role | null = validRoles.includes(pathnameRole as Role)
    ? (pathnameRole as Role)
    : storedRole



  const isLoggedIn = authStore.isAuthenticated

  const handleLogout = async () => {
    try {
      await logoutUser()
      authStore.clearAuth()

      if (role) {
        navigate(`/${role}/login`, { replace: true })
      } else {
        navigate('/', { replace: true }) 
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <header className="w-full bg-white p-4 flex justify-between items-center border-b border-gray-100 shadow-sm">
      {/* Logo */}
      <h1 className="text-2xl font-extrabold text-gray-800 tracking-wide">BodyFirst</h1>

      {/* Navigation */}
      <nav className="flex items-center space-x-3 md:space-x-4">
        {isLoggedIn ? (
          <>
            <Link to="/">
              <Button className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform">
                Home
              </Button>
            </Link>

            <Button
              className="px-4 py-2 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-800 hover:text-white transition"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/owner">
              <Button className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform">
                Home
              </Button>
            </Link>

            <Link to={role ? `/${role}/signup` : '/owner/signup'}>
              <Button className="px-4 py-2 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-800 hover:text-white transition">
                Signup
              </Button>
            </Link>

            <Link to={role ? `/${role}/login` : '/owner/login'}>
              <Button className="px-4 py-2 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-800 hover:text-white transition">
                Login
              </Button>
            </Link>

            <Button className="px-4 py-2 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-800 hover:text-white transition">
              About
            </Button>
          </>
        )}
      </nav>
    </header>

  )
})

export default Header
