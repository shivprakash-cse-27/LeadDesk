import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-gradient tracking-tight">LeadDesk</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!isAdminRoute && (
              <Link to="/admin/login" className="text-text-muted hover:text-text px-3 py-2 rounded-md text-sm font-medium transition-all duration-300">
                Admin Login
              </Link>
            )}
            {isAuthenticated && (
              <>
                <Link to="/admin" className="text-text-muted hover:text-text px-3 py-2 rounded-md text-sm font-medium transition-all duration-300">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-surface-light hover:bg-surface text-text px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-muted hover:text-text hover:bg-surface-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-b border-surface-light">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!isAdminRoute && (
              <Link
                to="/admin/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-text-muted hover:text-text hover:bg-surface-light"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Login
              </Link>
            )}
            {isAuthenticated && (
              <>
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-text-muted hover:text-text hover:bg-surface-light"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-muted hover:text-text hover:bg-surface-light"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
