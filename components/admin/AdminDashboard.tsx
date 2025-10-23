import React, { useState, useMemo } from 'react';
import { Reservation, ReservationStatus, SpacePrices } from '../../types';
import ReservationList from '../ReservationList';
import { CalendarIcon, ClockIcon, CheckCircleIcon, CashIcon, PencilIcon, DocumentSearchIcon } from '../icons';

interface AdminDashboardProps {
  reservations: Reservation[];
  confirmReservation: (id: string) => void;
  deleteReservation: (id: string) => void;
  spacePrices: SpacePrices;
  onUpdatePricesClick: () => void;
  onViewProofClick: (url: string) => void;
}

const InfoCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
    <div className={`p-4 rounded-lg shadow-md flex items-center bg-white`}>
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-700">{value}</p>
            <p className="text-sm text-slate-500">{title}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ reservations, confirmReservation, deleteReservation, spacePrices, onUpdatePricesClick, onViewProofClick }) => {
  const currentMonthValue = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthValue);
  
  const monthlyReport = useMemo(() => {
    const monthReservations = reservations.filter(r => r.date.startsWith(selectedMonth));
    const confirmedReservations = monthReservations.filter(r => r.status === ReservationStatus.Confirmed);

    const pending = monthReservations.filter(r => r.status === ReservationStatus.Pending).length;
    const awaiting = monthReservations.filter(r => r.status === ReservationStatus.AwaitingConfirmation).length;
    const confirmed = confirmedReservations.length;
    const totalRevenue = confirmedReservations.reduce((acc, r) => acc + r.price, 0);

    return {
      total: monthReservations.length,
      pending,
      awaiting,
      confirmed,
      totalRevenue,
    };
  }, [reservations, selectedMonth]);
  
  return (
    <div className="space-y-12">
        <div className="animate-slide-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-500">
                    Painel do Síndico
                </h2>
                <button onClick={onUpdatePricesClick} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400">
                    <PencilIcon className="h-4 w-4" />
                    Alterar Valores
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <InfoCard title="Pendentes (Mês)" value={monthlyReport.pending} icon={<ClockIcon className="h-6 w-6 text-white"/>} color="bg-yellow-500" />
                 <InfoCard title="Aguardando Confirmação" value={monthlyReport.awaiting} icon={<DocumentSearchIcon className="h-6 w-6 text-white"/>} color="bg-purple-500" />
                 <InfoCard title="Confirmadas (Mês)" value={monthlyReport.confirmed} icon={<CheckCircleIcon className="h-6 w-6 text-white"/>} color="bg-green-500" />
                 <InfoCard title="Receita Confirmada (Mês)" value={`R$ ${monthlyReport.totalRevenue.toFixed(2).replace('.', ',')}`} icon={<CashIcon className="h-6 w-6 text-white"/>} color="bg-blue-500" />
            </div>

             <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg shadow-md bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    <h3 className="font-bold text-lg">🎉 Salão de Festas</h3>
                    <p className="text-2xl font-light">R$ {spacePrices['salao-festas']?.toFixed(2).replace('.', ',')}</p>
                    <p className="text-xs opacity-80">*Valor para futuras reservas</p>
                </div>
                 <div className="p-4 rounded-lg shadow-md bg-gradient-to-br from-yellow-500 to-amber-600 text-white">
                    <h3 className="font-bold text-lg">🔥 Churrasqueira</h3>
                    <p className="text-2xl font-light">R$ {spacePrices['churrasqueira']?.toFixed(2).replace('.', ',')}</p>
                    <p className="text-xs opacity-80">*Valor para futuras reservas</p>
                </div>
            </div>
        </div>

        <ReservationList 
            reservations={reservations} 
            isSindicoMode={true} 
            confirmReservation={confirmReservation}
            deleteReservation={deleteReservation}
            onViewProofClick={onViewProofClick}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
        />
    </div>
  );
};

export default AdminDashboard;
