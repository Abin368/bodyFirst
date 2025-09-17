import type React from "react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { authStore } from "@/store/authStore"
import { logoutUser } from "@/services/authService"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Header: React.FC = observer(() => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const validRoles = ["owner", "trainer", "member"] as const
  type Role = (typeof validRoles)[number]

  const pathnameRole = location.pathname.split("/")[1]
  const storedRole = sessionStorage.getItem("signupRole") as Role | null

  const role: Role | null = validRoles.includes(pathnameRole as Role)
    ? (pathnameRole as Role)
    : storedRole

  const isLoggedIn = authStore.isAuthenticated

  const handleLogout = async () => {
    try {
      await logoutUser()
      authStore.clearAuth()
      setMobileOpen(false)

      if (role) {
        navigate(`/${role}/login`, { replace: true })
      } else {
        navigate("/", { replace: true })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const navLinks = isLoggedIn ? (
    <>
      <Link to={`/${role}/dashboard`} onClick={() => setMobileOpen(false)}>
        <Button className="w-full md:w-auto">Home</Button>
      </Link>
      <Button onClick={handleLogout} className="w-full md:w-auto">
        Logout
      </Button>
    </>
  ) : (
    <>
      <Link to={`/${role}/landing`} onClick={() => setMobileOpen(false)}>
        <Button className="w-full md:w-auto">Home</Button>
      </Link>
      <Link to={role ? `/${role}/signup` : "/owner/signup"} onClick={() => setMobileOpen(false)}>
        <Button className="w-full md:w-auto">Signup</Button>
      </Link>
      <Link to={role ? `/${role}/login` : "/owner/login"} onClick={() => setMobileOpen(false)}>
        <Button className="w-full md:w-auto">Login</Button>
      </Link>
      <Button className="w-full md:w-auto" onClick={() => setMobileOpen(false)}>
        About
      </Button>
    </>
  )

  return (
    <header className="w-full bg-white p-4 flex justify-between items-center border-b border-gray-100 shadow-sm relative">
      {/* Logo */}
      <h1 className="text-2xl font-extrabold text-gray-800 tracking-wide">BodyFirst</h1>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-4">{navLinks}</nav>

      {/* Mobile Hamburger */}
      <button className="md:hidden text-gray-800" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Sliding Drawer */}
            <motion.div
              className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col p-6 space-y-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <button className="self-end mb-6" onClick={() => setMobileOpen(false)}>
                <X size={28} />
              </button>
              {navLinks}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
})

export default Header
