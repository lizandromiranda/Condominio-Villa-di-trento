import React from 'react';
import BaseModal from './BaseModal';

interface ViewProofModalProps {
  proofImage: string;
  onClose: () => void;
}

const ViewProofModal: React.FC<ViewProofModalProps> = ({ proofImage, onClose }) => {
  return (
    <BaseModal title="Comprovante de Pagamento" isOpen={true} onClose={onClose} size="lg">
      <div className="p-4 bg-gray-200 rounded-lg">
        <img src={proofImage} alt="Comprovante de Pagamento" className="w-full h-auto object-contain rounded-md max-h-[70vh]" />
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="py-2 px-6 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition"
        >
          Fechar
        </button>
      </div>
    </BaseModal>
  );
};

export default ViewProofModal;
