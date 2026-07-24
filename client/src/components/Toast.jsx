import { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
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
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, 4700); // Start fade out a bit before actual removal
    return () => clearTimeout(timer);
  }, []);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-success" />,
    error: <XCircle className="h-5 w-5 text-danger" />,
    info: <Info className="h-5 w-5 text-primary" />,
  };

  const bgColors = {
    success: 'bg-surface border-success/30',
    error: 'bg-surface border-danger/30',
    info: 'bg-surface border-primary/30',
  };

  return (
    <div
      className={`max-w-sm w-full glass border ${bgColors[type]} rounded-lg shadow-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 ${
        isClosing ? 'opacity-0 transition-opacity duration-300' : 'animate-[slideUp_0.3s_ease-out]'
      }`}
    >
      <div className="w-0 flex-1 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">{icons[type]}</div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-text">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-surface-light">
        <button
          onClick={onClose}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-text-muted hover:text-text focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
