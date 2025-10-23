
import React, { useState } from 'react';
import { SpacePrices } from '../../types';
import BaseModal from './BaseModal';

interface UpdatePricesModalProps {
  currentPrices: SpacePrices;
  onClose: () => void;
  onSave: (newPrices: SpacePrices) => void;
}

const UpdatePricesModal: React.FC<UpdatePricesModalProps> = ({ currentPrices, onClose, onSave }) => {
  const [salaoPrice, setSalaoPrice] = useState(currentPrices['salao-festas']?.toString() || '0');
  const [churrasqueiraPrice, setChurrasqueiraPrice] = useState(currentPrices['churrasqueira']?.toString() || '0');
  const [error, setError] = useState('');

  const formatValue = (value: string) => {
    return value.replace(',', '.');
  };

  const handleSave = () => {
    const newSalaoPrice = parseFloat(formatValue(salaoPrice));
    const newChurrasqueiraPrice = parseFloat(formatValue(churrasqueiraPrice));

    if (isNaN(newSalaoPrice) || newSalaoPrice < 0 || isNaN(newChurrasqueiraPrice) || newChurrasqueiraPrice < 0) {
      setError('Por favor, insira valores numéricos válidos e positivos.');
      return;
    }

    onSave({
      'salao-festas': newSalaoPrice,
      'churrasqueira': newChurrasqueiraPrice,
    });
  };

  return (
    <BaseModal title="Alterar Valores das Reservas" isOpen={true} onClose={onClose} size="md">
      <div>
        <p className="text-slate-600 mb-4 text-sm">Altere os valores para as futuras reservas. As reservas já existentes não serão afetadas.</p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="salao-price" className="font-semibold text-slate-700">🎉 Salão de Festas</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                type="text"
                id="salao-price"
                value={salaoPrice}
                onChange={(e) => setSalaoPrice(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400"
                placeholder="227.00"
              />
            </div>
          </div>
          <div>
            <label htmlFor="churrasqueira-price" className="font-semibold text-slate-700">🔥 Churrasqueira</label>
             <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                type="text"
                id="churrasqueira-price"
                value={churrasqueiraPrice}
                onChange={(e) => setChurrasqueiraPrice(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400"
                placeholder="75.00"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold">Cancelar</button>
          <button
            onClick={handleSave}
            className="py-2 px-6 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default UpdatePricesModal;
