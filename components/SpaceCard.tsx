import React from 'react';
import { Space } from '../types';
import { UsersIcon, CheckIcon, InformationCircleIcon } from './icons';

interface SpaceCardProps {
    space: Space;
    onReserveClick: () => void;
    onInfoClick: () => void;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space, onReserveClick, onInfoClick }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="relative overflow-hidden">
                <img src={space.image} alt={space.name} className="w-full h-56 object-cover transform transition-transform duration-500 group-hover:scale-110" />
                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-white font-bold text-sm bg-gradient-to-br ${space.gradient} shadow-lg transition-transform duration-300 group-hover:animate-pulse-subtle`}>
                    R$ {space.price.toFixed(2).replace('.', ',')}
                </div>
                 <button onClick={onInfoClick} className="absolute top-4 left-4 p-2 bg-white/80 rounded-full text-slate-600 hover:bg-white hover:text-green-600 transition-all duration-300 backdrop-blur-sm shadow-md">
                    <InformationCircleIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-slate-800">{space.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 transform transition-transform duration-300 group-hover:rotate-12">
                        <UsersIcon className="h-5 w-5" />
                        <span className="font-semibold">{space.capacity} Pessoas</span>
                    </div>
                </div>
                <ul className="space-y-2 my-4 text-slate-600">
                    {space.amenities.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <CheckIcon className="h-5 w-5 text-green-500" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={onReserveClick}
                    className={`w-full mt-4 py-3 px-6 rounded-lg text-white font-bold uppercase tracking-wider bg-gradient-to-r ${space.gradient} transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transform`}
                >
                    Reservar Agora
                </button>
            </div>
        </div>
    );
};

export default SpaceCard;
