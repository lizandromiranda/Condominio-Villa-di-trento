
import React, { ReactNode } from 'react';
import { XIcon } from '../icons';

interface BaseModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const BaseModal: React.FC<BaseModalProps> = ({ title, isOpen, onClose, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`bg-gray-50 rounded-xl shadow-2xl w-full ${sizeClasses[size]} flex flex-col transform transition-transform duration-300 scale-95 animate-slide-up-fast`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full p-1 transition-colors"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Add fade-in and slide-up-fast animations to your global CSS or in a style tag if needed.
// For Tailwind JIT, you might need to define them in tailwind.config.js
const ModalStyles = () => (
    <style>{`
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fade-in {
        animation: fade-in 0.3s ease-out;
      }
      @keyframes slide-up-fast {
        from { transform: translateY(20px) scale(0.95); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
      }
      .animate-slide-up-fast {
        animation: slide-up-fast 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
    `}</style>
);

// You can include <ModalStyles /> once in your App.tsx or root layout
// This is just a way to ensure the keyframes are defined without a separate CSS file.
// For this project, we can assume the main index.html style tag will handle this if needed.

export default BaseModal;
