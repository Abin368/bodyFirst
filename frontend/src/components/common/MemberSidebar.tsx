import React, { useState } from 'react'
import {
  Home,
  Dumbbell,
  Beef,
  DollarSign,
  ChartNoAxesCombined,
  CalendarCheck,
  History,
  Settings,
  MessageCircle,
  X,
  Menu,
} from 'lucide-react'
import type { MenuItem } from '@/types/common'
import { NavLink } from 'react-router-dom'

const menuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/member/dashboard', icon: Home },
  { name: 'Workouts', path: '/member/workout', icon: Dumbbell },
  { name: 'Diet', path: '/member/diet', icon: Beef },
  { name: 'Progress', path: '/member/progress', icon: ChartNoAxesCombined },
  { name: 'Schedule', path: '/member/schedule', icon: CalendarCheck },
  { name: 'Message', path: '/memeber/messages', icon: MessageCircle },
  { name: 'Settings', path: '/member/settings', icon: Settings },
  { name: 'History', path: '/member/history', icon: History },
  { name: 'Billing', path: '/member/billing', icon: DollarSign },
]
const MemberSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true)

  const toggleSidebar = () => setIsOpen((prev) => !prev)

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    [
      'flex items-center gap-3 p-3 rounded-md transition-colors',
      'hover:bg-gray-200',
      isActive ? 'bg-gray-300 font-semibold' : '',
    ].join(' ')

  return (
    <>
      <div className="md:hidden flex justify-center items-center p-4 bg-white shadow-md">
        <button onClick={toggleSidebar} aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={`fixed md:relative z-20 left-0 top-0 h-full bg-white shadow-md transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64 md:flex md:flex-col`}
        role="navigation"
        aria-label="Member sidebar"
      >
        <nav className="flex-1 flex flex-col mt-4 px-2 space-y-1">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <NavLink to={path} key={name} className={linkClasses} onClick={() => setIsOpen(false)}>
              <Icon size={20} />
              <span className={`md:inline ${!isOpen ? 'hidden' : ''}`}>{name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default MemberSidebar
