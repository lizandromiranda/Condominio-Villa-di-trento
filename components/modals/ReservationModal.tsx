import React, { useState } from 'react';
import { Space, Reservation } from '../../types';
import BaseModal from './BaseModal';
import Calendar from '../Calendar';
import { ClipboardCopyIcon } from '../icons';
import { useToast } from '../../hooks/useToast';


interface ReservationModalProps {
  space: Space;
  onClose: () => void;
  onAddReservation: (reservation: Omit<Reservation, 'id' | 'status' | 'price' | 'proofOfPaymentUrl'>) => void;
  reservations: Reservation[];
  initialDate?: string | null;
}

const PIX_KEY_FORMATTED = '42.181.669/0001-77';
const PIX_KEY_RAW = '42181669000177';

const ReservationModal: React.FC<ReservationModalProps> = ({ space, onClose, onAddReservation, reservations, initialDate }) => {
  const { addToast } = useToast();
  const bookedDates = reservations.filter(r => r.spaceId === space.id).map(r => r.date);
  const isInitialDateBooked = initialDate ? bookedDates.includes(initialDate) : false;
  
  const [step, setStep] = useState(initialDate && !isInitialDateBooked ? 2 : 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate && !isInitialDateBooked ? initialDate : null);
  const [apartment, setApartment] = useState('');
  const [error, setError] = useState('');

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedDate) {
        setError('Por favor, selecione uma data.');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (!apartment.trim()) {
        setError('Por favor, informe o número do apartamento.');
        return;
      }
      setError('');
      setStep(3);
    }
  };

  const handleConfirmAndPay = () => {
    if (selectedDate && apartment) {
      onAddReservation({
        spaceId: space.id,
        spaceName: space.name,
        apartment,
        date: selectedDate,
      });
      // Don't close modal, show payment instructions
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(PIX_KEY_RAW);
    addToast('Chave PIX copiada com sucesso!', 'success');
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <p className="text-center text-slate-600 mb-4">Selecione uma data disponível no calendário.</p>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              bookedDates={bookedDates}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <p className="text-slate-600 mb-2">
              <strong>Data Selecionada:</strong> {selectedDate && new Date(selectedDate + 'T00:00:00-03:00').toLocaleDateString('pt-BR')}
            </p>
            <label htmlFor="apartment" className="font-semibold text-slate-700">Número do Apartamento</label>
            <input
              type="text"
              id="apartment"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              placeholder="Ex: 101"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400"
              autoFocus
            />
          </div>
        );
       case 3:
        return (
            <div className="text-center">
                 <h3 className="font-bold text-lg text-slate-800">Pagamento via PIX</h3>
                 <p className="text-slate-600 mt-2 mb-4">Para confirmar sua reserva, realize o pagamento no valor de <strong>R$ {space.price.toFixed(2).replace('.', ',')}</strong> usando a chave PIX abaixo.</p>
                
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-100 to-yellow-100 border-2 border-green-300 my-4">
                    <p className="text-sm font-semibold text-green-800 mb-2">CNPJ (copie apenas os números)</p>
                     <div
                        className="w-full bg-white p-3 border-2 border-dashed border-green-400 rounded-md text-slate-800 font-mono text-lg tracking-wider cursor-pointer mb-2"
                        onClick={handleCopyToClipboard}
                    >
                        {PIX_KEY_FORMATTED}
                    </div>
                </div>

                <button
                    onClick={handleCopyToClipboard}
                    className='w-full flex items-center justify-center gap-2 p-3 text-white font-bold rounded-lg transition-all duration-300 bg-green-500 hover:bg-green-600'
                >
                    <ClipboardCopyIcon className="h-5 w-5" />
                    Copiar Chave PIX
                </button>
                <div className="mt-6 p-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 text-sm text-left">
                    <p><strong>Próximo passo:</strong> Após efetuar o pagamento, anexe o comprovante na sua reserva. Ela aparecerá como "Pendente" na lista da tela principal, com um botão para enviar o arquivo.</p>
                </div>
                 <button onClick={() => { handleConfirmAndPay(); onClose(); }} className="mt-6 w-full py-2 px-4 rounded-lg bg-slate-600 text-white font-semibold hover:bg-slate-700 transition">
                    Entendido, Solicitar Reserva
                </button>
            </div>
        );
    }
  };

  return (
    <BaseModal title={`Reservar ${space.name}`} isOpen={true} onClose={onClose} size="md">
      <div>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {renderStepContent()}
        {step < 3 && (
          <div className="mt-6 flex justify-end gap-3">
             {step > 1 && <button onClick={() => setStep(step - 1)} className="py-2 px-4 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold">Voltar</button>}
            <button
              onClick={handleNextStep}
              className={`py-2 px-6 rounded-lg text-white font-bold transition-all ${space.gradient} bg-gradient-to-r`}
            >
              {step === 2 ? "Finalizar e Pagar" : "Próximo"}
            </button>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default ReservationModal;
