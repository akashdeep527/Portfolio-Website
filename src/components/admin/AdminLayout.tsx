import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Settings, FileText, Award, Briefcase, GraduationCap, Languages, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    // Force a page refresh to ensure all auth state is cleared
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink 
                to="/admin/dashboard" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
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
              >
                <Languages className="w-5 h-5" />
                <span>Languages</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
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
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;