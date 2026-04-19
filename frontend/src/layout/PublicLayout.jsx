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
      <div style={{ minHeight: '100vh', background: '#fffefb' }}>
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: '#fffefb',
          borderBottom: '1px solid #c5c0b1'
        }}>
          <div className="container" style={{ padding: '0 16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '56px'
            }}>
              <h1 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#201515',
                letterSpacing: '-0.5px'
              }}>
                EasyCatalog
              </h1>
              
              <nav style={{ display: 'flex', gap: '24px' }}>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    style={({ isActive }) => ({
                      fontSize: '14px',
                      fontWeight: 500,
                      color: isActive ? '#ff4f00' : '#201515',
                      textDecoration: 'none',
                      padding: '8px 0',
                      borderBottom: isActive ? '3px solid #ff4f00' : '3px solid transparent',
                      transition: 'all 0.15s ease'
                    })}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </header>

        {showFilters && (
          <div style={{
            position: 'fixed',
            top: '57px',
            left: 0,
            right: 0,
            zIndex: 40,
            background: '#fffefb',
            borderBottom: '1px solid #eceae3',
            padding: '12px 0'
          }}>
            <div className="container">
              <Filter />
            </div>
          </div>
        )}

        <main style={{
          paddingTop: showFilters ? '120px' : '80px',
          paddingBottom: '48px'
        }}>
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </FilterProvider>
  );
}