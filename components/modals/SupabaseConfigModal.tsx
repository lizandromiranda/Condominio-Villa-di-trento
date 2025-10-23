import React, { useState } from 'react';
import { InformationCircleIcon } from '../icons';

interface SupabaseConfigModalProps {
  onSave: (url: string, key: string) => void;
}

const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ onSave }) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!url.trim() || !anonKey.trim()) {
      setError('Ambos os campos são obrigatórios.');
      return;
    }
    if (!url.startsWith('https://') || !url.endsWith('supabase.co')) {
      setError('A URL do projeto parece estar em um formato inválido.');
      return;
    }
    setError('');
    onSave(url, anonKey);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-yellow-50 to-white z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-slide-up">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Configuração do Supabase</h2>
        </div>
        <div className="p-6">
          <p className="text-slate-600 mb-4">
            Olá! Parece que esta é a primeira vez que você executa o aplicativo. Por favor, forneça as credenciais do seu projeto Supabase para conectar ao banco de dados.
          </p>
          
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 text-sm mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p>
                  Você encontra essas informações no seu painel Supabase em: <br />
                  <strong className="font-semibold">Project Settings (ícone de engrenagem) &gt; API</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="supabase-url" className="font-semibold text-slate-700">URL do Projeto</label>
              <input
                type="text"
                id="supabase-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.supabase.co"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400"
              />
            </div>
            <div>
              <label htmlFor="supabase-key" className="font-semibold text-slate-700">Chave Pública (anon key)</label>
              <input
                type="text"
                id="supabase-key"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </div>
        <div className="bg-gray-50 p-4 flex justify-end rounded-b-xl">
          <button
            onClick={handleSave}
            className="py-2 px-6 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Salvar e Conectar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupabaseConfigModal;