
import React, { useState, useEffect } from 'react';
import { BuildingIcon } from './icons';

const SplashScreen: React.FC = () => {
    const [shouldFadeOut, setShouldFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldFadeOut(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-yellow-300 transition-opacity duration-500 ${shouldFadeOut ? 'animate-fade-out' : 'opacity-100'}`}>
            <div className="text-center text-white animate-bounce-in">
                 <BuildingIcon className="h-24 w-24 mx-auto" />
                <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-wider">
                    Villa Di Trento
                </h1>
                <p className="text-lg mt-2 font-light">Sistema de Reservas</p>
            </div>
        </div>
    );
};

export default SplashScreen;
