
import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from './icons';

interface CalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
  bookedDates: string[];
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate, bookedDates }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (amount: number) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + amount)));
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isPast = date < today;
      const isBooked = bookedDates.includes(dateString);
      const isSelected = selectedDate === dateString;

      let buttonClass = 'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 text-sm';
      if (isPast || isBooked) {
        buttonClass += ' bg-gray-200 text-gray-400 cursor-not-allowed line-through';
      } else if (isSelected) {
        buttonClass += ' bg-green-500 text-white font-bold ring-2 ring-offset-2 ring-green-500 transform scale-110';
      } else {
        buttonClass += ' bg-green-100 text-green-800 hover:bg-green-200 hover:font-semibold';
      }

      days.push(
        <div key={day} className="p-1 flex justify-center items-center">
          <button
            onClick={() => !isPast && !isBooked && onDateSelect(dateString)}
            disabled={isPast || isBooked}
            className={buttonClass}
          >
            {day}
          </button>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-inner">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h3 className="font-bold text-lg capitalize">
          {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 font-semibold mb-2">
        <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
