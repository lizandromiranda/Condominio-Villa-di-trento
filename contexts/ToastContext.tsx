import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { ToastMessage, ToastType } from '../types';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XIcon } from '../components/icons';

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastIcons = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
  error: <XCircleIcon className="h-6 w-6 text-red-500" />,
  info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
};

const toastStyles = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
};

const Toast: React.FC<{ message: ToastMessage, onClose: () => void }> = ({ message, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            const exitTimer = setTimeout(onClose, 500); // Wait for animation to finish
            return () => clearTimeout(exitTimer);
        }, 4000); // 4 seconds visible

        return () => clearTimeout(timer);
    }, [onClose]);
    
    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 500);
    };

    return (
        <div className={`flex items-start p-4 w-full max-w-sm rounded-lg shadow-lg border ${toastStyles[message.type]} ${isExiting ? 'animate-toast-out' : 'animate-toast-in-right'}`}>
            <div className="flex-shrink-0">
                {toastIcons[message.type]}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">{message.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
                <button onClick={handleClose} className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Close</span>
                    <XIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};


export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = new Date().toISOString() + Math.random();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-20 right-4 z-50 w-full max-w-sm space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};