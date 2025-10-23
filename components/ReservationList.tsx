import React, { useState, useMemo } from 'react';
import { Reservation, ReservationStatus } from '../types';
import { HomeIcon, CheckIcon, TrashIcon, UploadIcon, DocumentSearchIcon } from './icons';
import ConfirmationModal from './modals/ConfirmationModal';

interface ReservationListProps {
  reservations: Reservation[];
  isSindicoMode: boolean;
  confirmReservation?: (id: string) => void;
  deleteReservation?: (id: string) => void;
  onUploadProofClick?: (reservation: Reservation) => void;
  onViewProofClick?: (url: string) => void;
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
}

const generateMonthOptions = () => {
  const options = [];
  const now = new Date();
  for (let i = -6; i <= 5; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    options.push({
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
    });
  }
  return options.reverse();
};

const statusStyles: { [key in ReservationStatus]: string } = {
    [ReservationStatus.Confirmed]: 'bg-green-100 text-green-800',
    [ReservationStatus.AwaitingConfirmation]: 'bg-purple-100 text-purple-800',
    [ReservationStatus.Pending]: 'bg-yellow-100 text-yellow-800',
};

const ReservationList: React.FC<ReservationListProps> = ({ 
  reservations, 
  isSindicoMode, 
  confirmReservation, 
  deleteReservation,
  onUploadProofClick,
  onViewProofClick,
  selectedMonth: controlledMonth,
  onMonthChange,
}) => {
  const monthOptions = useMemo(() => generateMonthOptions(), []);
  const currentMonthValue = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  
  const [internalMonth, setInternalMonth] = useState(currentMonthValue);
  const isControlled = controlledMonth !== undefined && onMonthChange !== undefined;
  
  const selectedMonth = isControlled ? controlledMonth : internalMonth;
  const setSelectedMonth = isControlled ? onMonthChange! : setInternalMonth;
  
  const [apartmentFilter, setApartmentFilter] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);

  const filteredReservations = useMemo(() => {
    return reservations
      .filter(r => r.date.startsWith(selectedMonth))
      .filter(r => isSindicoMode || !apartmentFilter || r.apartment.includes(apartmentFilter))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [reservations, selectedMonth, apartmentFilter, isSindicoMode]);

  const handleDeleteClick = (id: string) => {
    setReservationToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteReservation && reservationToDelete) {
      deleteReservation(reservationToDelete);
    }
    setShowConfirmModal(false);
    setReservationToDelete(null);
  };
  
  const handleCloseModal = () => {
      setShowConfirmModal(false);
      setReservationToDelete(null);
  }

  return (
    <>
      <div id="reservations" className="my-12 animate-slide-up" style={{ animationDelay: '400ms' }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-500">
                  Reservas
              </h2>
              <span className="flex items-center justify-center bg-green-500 text-white font-bold text-sm rounded-full h-7 w-7">
                  {filteredReservations.length}
              </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {!isSindicoMode && (
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Filtrar por Apto (ex: 101)"
                  value={apartmentFilter}
                  onChange={e => setApartmentFilter(e.target.value)}
                  className="w-full sm:w-auto appearance-none bg-white border-2 border-green-300 rounded-lg py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                />
              </div>
            )}
            <div className="relative w-full sm:w-auto">
              <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-green-300 rounded-lg py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              >
                  {monthOptions.map(option => (
                      <option key={option.value} value={option.value}>
                          {option.label.charAt(0).toUpperCase() + option.label.slice(1)}
                      </option>
                  ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {filteredReservations.length > 0 ? (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <div key={reservation.id} className="bg-white/80 p-4 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:border-green-400 hover:shadow-lg">
                  <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[reservation.status]}`}>
                            {reservation.status}
                          </span>
                          <h4 className="font-bold text-lg text-slate-700">{reservation.spaceName}</h4>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-slate-500 gap-x-4 gap-y-1">
                         <p><span className="font-semibold">Data:</span> {new Date(reservation.date + 'T00:00:00-03:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric'})}</p>
                          <p className="flex items-center gap-1"><HomeIcon className="h-4 w-4" /> <span className="font-semibold">Apto:</span> {reservation.apartment}</p>
                          <p><span className="font-semibold">Valor:</span> R$ {reservation.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                  </div>

                 <div className="flex gap-2 w-full sm:w-auto">
                    {!isSindicoMode && reservation.status === ReservationStatus.Pending && onUploadProofClick && (
                        <button onClick={() => onUploadProofClick(reservation)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                            <UploadIcon className="h-4 w-4" />
                            <span>Enviar Comprovante</span>
                        </button>
                    )}
                    {!isSindicoMode && reservation.status === ReservationStatus.AwaitingConfirmation && (
                        <span className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs px-3 py-2 bg-gray-200 text-gray-600 rounded-md cursor-default">
                            Comprovante Enviado
                        </span>
                    )}
                    {isSindicoMode && (
                        <>
                            {reservation.status === ReservationStatus.AwaitingConfirmation && (
                                <>
                                    {onViewProofClick && reservation.proofOfPaymentUrl && (
                                        <button onClick={() => onViewProofClick(reservation.proofOfPaymentUrl!)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition">
                                            <DocumentSearchIcon className="h-4 w-4" />
                                            <span>Ver Comprovante</span>
                                        </button>
                                    )}
                                    {confirmReservation && (
                                        <button onClick={() => confirmReservation(reservation.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                                            <CheckIcon className="h-4 w-4" />
                                            <span>Confirmar</span>
                                        </button>
                                    )}
                                </>
                            )}
                            {reservation.status === ReservationStatus.Pending && confirmReservation && (
                                 <button onClick={() => confirmReservation(reservation.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition" title="Confirmar manualmente sem comprovante">
                                    <CheckIcon className="h-4 w-4" />
                                    <span>Confirmar</span>
                                </button>
                            )}
                            <button onClick={() => handleDeleteClick(reservation.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                                <TrashIcon className="h-4 w-4" />
                                <span>Excluir</span>
                            </button>
                        </>
                    )}
                  </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-slate-500">Nenhuma reserva encontrada para os filtros selecionados.</p>
          </div>
        )}
      </div>
      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita."
        />
      )}
    </>
  );
};

export default ReservationList;
