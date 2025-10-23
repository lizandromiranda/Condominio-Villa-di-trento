
import React from 'react';
import { BuildingIcon, LockClosedIcon } from './icons';

interface HeaderProps {
    isSindicoMode: boolean;
    onSindicoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSindicoMode, onSindicoClick }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-lg border-b border-green-500/20 shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                     <div className="p-2 bg-gradient-to-br from-green-400 to-yellow-400 rounded-lg animate-pulse-subtle">
                        <BuildingIcon className="h-6 w-6 text-white"/>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-500">
                        Condomínio Villa Di Trento
                    </h1>
                </div>
                <button
                    onClick={onSindicoClick}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isSindicoMode
                            ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400'
                            : 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400'
                    }`}
                >
                    {isSindicoMode ? (
                        <>
                            <span className="hidden md:inline">👨‍💼 Sair do Modo Síndico</span>
                            <span className="md:hidden">Sair</span>
                        </>
                    ) : (
                        <>
                             <LockClosedIcon className="h-4 w-4" />
                            <span className="hidden md:inline">🔐 Área do Síndico</span>
                             <span className="md:hidden">Síndico</span>
                        </>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
