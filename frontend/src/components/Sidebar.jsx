import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package,
  Tag,
  LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [activeItem, setActiveItem] = useState('Dashboard');

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Products', icon: Package, path: '/admin/products' },
    { name: 'Categories', icon: Tag, path: '/admin/categories' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-6 bg-white border-r border-[#E0E4EB]">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 bg-[#4A90E2] rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-[#2C3E50]">EasyCatalog</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;

          return (
            <button
              key={item.name}
              onClick={() => {
                setActiveItem(item.name);
                navigate(item.path);
              }}
              className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 font-medium ${
                isActive
                  ? 'bg-[#4A90E2] text-white'
                  : 'text-[#2C3E50] hover:bg-[#F4F6FA]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#7F8C9D]'}`} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {user && (
        <div className="pt-4 mt-6 border-t border-[#E0E4EB] space-y-1">
          <div className="flex items-center gap-3 px-3 py-3 mt-4 rounded-lg bg-[#F4F6FA]">
            <div className="w-9 h-9 rounded-full bg-[#4A90E2] flex items-center justify-center font-bold text-white">
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#2C3E50] truncate">{user.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 text-[#7F8C9D] hover:text-[#2C3E50] transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;