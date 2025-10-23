import React, { useState, useMemo } from 'react';
import { Reservation, Space } from '../types';
import { ArrowLeftIcon, ArrowRightIcon } from './icons';

interface UnifiedCalendarProps {
  reservations: Reservation[];
  spaces: Space[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

type FilterType = 'all' | string;

const UnifiedCalendar: React.FC<UnifiedCalendarProps> = ({ reservations, spaces, selectedDate, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState<FilterType>('all');

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, string[]>();
    reservations.forEach(r => {
      const dateKey = r.date.split('T')[0];
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, r.spaceId]);
    });
    return map;
  }, [reservations]);

  const changeMonth = (amount: number) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + amount)));
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const FilterButtons = () => (
    <div className="flex justify-center items-center gap-2 mb-4">
        <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === 'all' ? 'bg-green-500 text-white font-semibold' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
        >
            Todos
        </button>
        {spaces.map(space => (
             <button
                key={space.id}
                onClick={() => setFilter(space.id)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === space.id ? 'bg-green-500 text-white font-semibold' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
             >
                {space.name}
            </button>
        ))}
    </div>
  );

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-1"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isPast = date < today;
      
      const dayBookings = bookingsByDate.get(dateString) || [];
      const isBookedForFilter = filter === 'all' 
          ? dayBookings.length >= spaces.length 
          : dayBookings.includes(filter);

      const isDisabled = isPast || isBookedForFilter;
      const isSelected = selectedDate === dateString;

      let buttonClass = 'relative w-full h-20 rounded-lg flex flex-col items-center justify-center p-1 transition-all duration-200 text-sm focus:outline-none';
      if (isDisabled) {
        buttonClass += ' bg-slate-100 text-slate-400 cursor-not-allowed';
      } else {
        buttonClass += ' bg-white hover:bg-green-50 text-slate-700 cursor-pointer';
      }
      
      if (isSelected && !isDisabled) {
        buttonClass += ' ring-2 ring-green-500 shadow-lg';
      }

      days.push(
        <div key={day} className="p-1">
          <button
            onClick={() => !isDisabled && onDateSelect(dateString)}
            disabled={isDisabled}
            className={buttonClass}
          >
            <span className={`font-semibold ${isSelected && !isDisabled ? 'text-green-600' : ''}`}>{day}</span>
            <div className="flex gap-1.5 mt-2">
                {spaces.map(space => {
                    if (filter !== 'all' && space.id !== filter) return null;
                    const isBooked = dayBookings.includes(space.id);
                    const availableColor = space.id === 'churrasqueira' ? 'bg-yellow-400' : 'bg-green-400';
                    return (
                        <div 
                            key={space.id} 
                            className={`w-2.5 h-2.5 rounded-full ${isBooked || isPast ? 'bg-red-400' : availableColor}`}
                            title={isBooked ? `${space.name} (Reservado)` : `${space.name} (Disponível)`}
                        ></div>
                    )
                })}
            </div>
          </button>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200/50 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeftIcon className="h-5 w-5 text-slate-600" />
        </button>
        <h3 className="font-bold text-lg capitalize text-slate-700">
          {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowRightIcon className="h-5 w-5 text-slate-600" />
        </button>
      </div>
       <FilterButtons />
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 font-semibold mb-2">
        <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
      <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              <span>Salão Disponível</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <span>Churrasqueira Disponível</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <span>Reservado / Data Passada</span>
          </div>
      </div>
    </div>
  );
};

export default UnifiedCalendar;
