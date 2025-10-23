import React from 'react';
import BaseModal from './BaseModal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <BaseModal title={title} isOpen={isOpen} onClose={onClose} size="sm">
      <div>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmationModal;