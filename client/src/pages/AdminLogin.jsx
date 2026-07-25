import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [shake, setShake] = useState(false);
  
  const { login, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    if (error) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    }
  };

  const inputClass = (field) =>
    `block w-full pl-11 pr-4 py-3.5 border ${
      activeField === field ? 'border-primary/50' : 'border-surface-light/50'
    } rounded-xl bg-surface-dark/50 text-text placeholder:text-text-dim focus:border-primary/50 transition-all duration-300 outline-none input-glow`;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden noise">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[35rem] h-[35rem] bg-primary/10 rounded-full blur-[120px] animate-[pulse-glow_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[35rem] h-[35rem] bg-accent/10 rounded-full blur-[120px] animate-[pulse-glow_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        {/* Logo */}
        <div className="animate-scaleIn flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow-primary">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="animate-slideUp text-center text-3xl font-bold text-text">Admin Portal</h2>
        <p className="animate-slideUp stagger-1 mt-2 text-center text-sm text-text-muted">Sign in to manage your leads</p>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 animate-slideUp stagger-2`}
        style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}>
        <div className="glass-card py-10 px-6 sm:px-10 rounded-3xl border-gradient">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-start gap-3 animate-slideDown">
                <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                <p className="text-sm text-danger-light">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-text-muted mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className={`h-4 w-4 transition-colors duration-300 ${activeField === 'email' ? 'text-primary' : 'text-text-dim'}`} />
                </div>
                <input id="login-email" type="email" autoComplete="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setActiveField('email')} onBlur={() => setActiveField(null)}
                  className={inputClass('email')} placeholder="admin@leaddesk.com" />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-text-muted mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={`h-4 w-4 transition-colors duration-300 ${activeField === 'password' ? 'text-primary' : 'text-text-dim'}`} />
                </div>
                <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setActiveField('password')} onBlur={() => setActiveField(null)}
                  className={`${inputClass('password')} pr-12`} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-dim hover:text-text transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl text-base font-semibold text-white btn-gradient flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
              {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>) : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
