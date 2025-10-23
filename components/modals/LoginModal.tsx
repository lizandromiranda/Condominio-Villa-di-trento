import React, { useState } from 'react';
import BaseModal from './BaseModal';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [password, setPassword] = useState('');

  const handleLoginAttempt = () => {
    onLogin(password);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLoginAttempt();
    }
  };

  return (
    <BaseModal title="Acesso Restrito - Síndico" isOpen={true} onClose={onClose} size="sm">
      <div>
        <p className="text-slate-600 mb-4">Por favor, insira a senha para acessar a área administrativa.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400"
          placeholder="Senha"
          autoFocus
        />
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleLoginAttempt}
            className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
          >
            Entrar
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default LoginModal;