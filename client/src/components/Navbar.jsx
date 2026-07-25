import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, Shield } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'glass-strong shadow-lg shadow-black/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow duration-300">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold text-gradient tracking-tight">LeadDesk</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {!isAdminRoute && (
              <Link to="/admin/login" className="flex items-center gap-2 text-text-muted hover:text-text px-4 py-2 rounded-xl hover:bg-surface-light/30 text-sm font-medium transition-all duration-300">
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
            {isAuthenticated && (
              <>
                <Link to="/admin" className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/admin' ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text hover:bg-surface-light/30'
                }`}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button onClick={logout}
                  className="flex items-center gap-2 text-text-muted hover:text-danger px-4 py-2 rounded-xl hover:bg-danger/10 text-sm font-medium transition-all duration-300 ml-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-light/30 transition-all">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="glass-strong border-t border-surface-light/20 px-4 py-3 space-y-1">
          {!isAdminRoute && (
            <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-text hover:bg-surface-light/30 text-sm font-medium transition-all">
              <Shield className="w-4 h-4" /> Admin Login
            </Link>
          )}
          {isAuthenticated && (
            <>
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-text hover:bg-surface-light/30 text-sm font-medium transition-all">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 text-sm font-medium transition-all">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
