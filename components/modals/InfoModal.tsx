import React from 'react';
import { Space } from '../../types';
import BaseModal from './BaseModal';
import { CheckIcon } from '../icons';

interface InfoModalProps {
  space: Space;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ space, onClose }) => {
  return (
    <BaseModal title={`Regras - ${space.name}`} isOpen={true} onClose={onClose} size="md">
      <div>
        <p className="text-slate-600 mb-6">Por favor, leia atentamente as regras de utilização do espaço para garantir uma boa convivência.</p>
        <ul className="space-y-3">
          {space.rules.map((rule, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-slate-700">{rule}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition"
          >
            Entendi
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default InfoModal;
