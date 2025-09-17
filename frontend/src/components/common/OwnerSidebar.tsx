import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  DollarSign,
  BarChart2,
  Settings,
  Bell,
  Gift,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";


interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
}


const menuItems: MenuItem[] = [
  { name: "Dashboard", path: "/owner/dashboard", icon: Home },
  { name: "Members", path: "/owner/members", icon: Users },
  { name: "Trainers", path: "/owner/trainers", icon: Users },
  { name: "Billing", path: "/owner/billing", icon: DollarSign },
  { name: "Analytics", path: "/owner/analytics", icon: BarChart2 },
  { name: "Settings", path: "/owner/settings", icon: Settings },
  { name: "Announcements", path: "/owner/announcements", icon: Bell },
  { name: "Gamification", path: "/owner/gamification", icon: Gift },
];

const OwnerSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    [
      "flex items-center gap-3 p-3 rounded-md transition-colors",
      "hover:bg-gray-200",
      isActive ? "bg-gray-300 font-semibold" : "",
    ].join(" ");

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-md">
        <button
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-20 left-0 top-0 h-full bg-white shadow-md transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 md:flex md:flex-col`}
        role="navigation"
        aria-label="Owner sidebar"
      >
        <nav className="flex-1 flex flex-col mt-4 px-2 space-y-1">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              to={path}
              key={name}
              className={linkClasses}
              onClick={() => setIsOpen(false)} 
            >
              <Icon size={20} />
              <span className={`md:inline ${!isOpen ? "hidden" : ""}`}>
                {name}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default OwnerSidebar;
