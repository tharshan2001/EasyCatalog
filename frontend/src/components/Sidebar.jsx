import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  // Active route tracking using react-router
  const [activeItem, setActiveItem] = useState('Dashboard');

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Products', icon: Package, path: '/products' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // redirect to login page after logout
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-6 bg-slate-50 border-r border-slate-200">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
          <Package className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-800">StoreAdmin</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;

          return (
            <button
              key={item.name}
              onClick={() => {
                setActiveItem(item.name);
                navigate(item.path); // navigate to route
              }}
              className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 font-medium ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section (Profile & Logout) */}
      <div className="pt-4 mt-6 border-t border-slate-200 space-y-1">
        <div className="flex items-center gap-3 px-3 py-3 mt-4 rounded-lg bg-slate-100">
          <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-600">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">Jane Doe</p>
            <p className="text-xs text-slate-500 truncate">admin@store.com</p>
          </div>
          <button
            onClick={handleLogout} // logout action
            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;