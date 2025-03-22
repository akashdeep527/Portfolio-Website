import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Settings, Award, Briefcase, GraduationCap, Languages, LogOut, Menu, X, Home } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    // Force a page refresh to ensure all auth state is cleared
    window.location.href = '/';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <button onClick={toggleSidebar} className="text-white">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64 bg-gray-800 text-white fixed inset-y-0 left-0 z-20 md:relative transition-transform duration-300 ease-in-out`}
      >
        {/* Desktop sidebar header - hidden on mobile */}
        <div className="hidden md:block p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
        </div>

        {/* Close button for mobile */}
        <div className="md:hidden p-4 flex justify-between items-center border-b border-gray-700">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-blue-400"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button onClick={toggleSidebar}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100%-8rem)]">
          <ul className="space-y-2">
            <li>
              <NavLink 
                to="/admin/dashboard" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Settings className="w-5 h-5" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/profile" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/experience" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Briefcase className="w-5 h-5" />
                <span>Experience</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/education" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <GraduationCap className="w-5 h-5" />
                <span>Education</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/skills" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Award className="w-5 h-5" />
                <span>Skills</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/languages" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Languages className="w-5 h-5" />
                <span>Languages</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-left rounded hover:bg-gray-700 text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-0 mt-14 md:mt-0">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;