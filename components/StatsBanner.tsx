
import React from 'react';
import { Reservation, Space } from '../types';
import { CalendarIcon, BuildingIcon, UsersIcon } from './icons';

interface StatsBannerProps {
    reservations: Reservation[];
    spaces: Space[];
}

const StatCard: React.FC<{ icon: React.ReactNode; value: string | number; label: string; delay: string }> = ({ icon, value, label, delay }) => (
    <div className="flex items-center p-4 bg-white/50 rounded-lg shadow-md animate-slide-up" style={{ animationDelay: delay }}>
        <div className="p-3 bg-white rounded-full mr-4 text-green-600">
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-green-100">{label}</p>
        </div>
    </div>
);

const StatsBanner: React.FC<StatsBannerProps> = ({ reservations, spaces }) => {
    const totalCapacity = spaces.reduce((acc, space) => acc + space.capacity, 0);

    return (
        <div className="p-6 bg-gradient-to-r from-green-500 to-yellow-400 rounded-xl shadow-lg -mt-4 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={<CalendarIcon className="h-6 w-6" />} value={reservations.length} label="Total de Reservas" delay="0ms" />
                <StatCard icon={<BuildingIcon className="h-6 w-6" />} value={spaces.length} label="Espaços Disponíveis" delay="100ms" />
                <StatCard icon={<UsersIcon className="h-6 w-6" />} value={totalCapacity} label="Capacidade Total" delay="200ms" />
            </div>
        </div>
    );
};

export default StatsBanner;
