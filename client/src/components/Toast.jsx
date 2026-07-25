import { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsClosing(true), 4600);
    return () => clearTimeout(timer);
  }, []);

  const config = {
    success: { icon: <CheckCircle className="h-5 w-5 text-success" />, border: 'border-success/20', glow: 'shadow-success/10' },
    error: { icon: <XCircle className="h-5 w-5 text-danger" />, border: 'border-danger/20', glow: 'shadow-danger/10' },
    info: { icon: <Info className="h-5 w-5 text-primary" />, border: 'border-primary/20', glow: 'shadow-primary/10' },
  };

  const { icon, border, glow } = config[type] || config.info;

  return (
    <div
      className={`max-w-sm w-full glass-card border ${border} rounded-2xl shadow-lg ${glow} pointer-events-auto flex items-center gap-3 px-4 py-3.5 transition-all duration-300 ${
        isClosing ? 'opacity-0 translate-x-4' : 'animate-slideInRight'
      }`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <p className="text-sm font-medium text-text flex-1">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-lg text-text-dim hover:text-text hover:bg-surface-light/30 transition-all"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
