import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FilterProvider } from '../components/catalog/context/FilterContext';
import Filter from '../components/catalog/filter/Filter';

const navLinks = [
  { to: '/catalog', label: 'Catalog' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
];

export default function PublicLayout() {
  const location = useLocation();
  const showFilters = location.pathname === '/catalog';

  return (
    <FilterProvider>
      <div className="min-h-screen bg-stone-100">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12 md:h-16">
              <h1 className="text-lg md:text-xl font-bold text-stone-800">EasyCatalog</h1>
              
              <nav className="hidden md:flex items-center gap-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive ? 'text-yellow-600' : 'text-stone-600 hover:text-stone-800'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <nav className="flex md:hidden gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `text-xs px-2 py-1 rounded ${
                        isActive ? 'bg-yellow-100 text-yellow-700' : 'text-stone-600'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </header>

        <div className={`fixed top-12 md:top-16 left-0 right-0 z-40 bg-stone-100/95 backdrop-blur-sm border-b border-stone-200/50 ${showFilters ? 'block' : 'hidden'}`}>
          <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8 py-2 md:py-3">
            <Filter />
          </div>
        </div>

        <main className={`max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8 pt-20 md:pt-10 ${showFilters ? 'md:pt-40' : 'pt-20'}`}>
          <Outlet />
        </main>
      </div>
    </FilterProvider>
  );
}