import { createClient } from '@supabase/supabase-js';

// Valores padrão que indicam que a configuração não foi feita
const PLACEHOLDER_URL = 'https://seu-projeto-url.supabase.co';
const PLACEHOLDER_KEY = 'sua-chave-anon-publica';

// Tenta obter as credenciais do localStorage
const supabaseUrl = localStorage.getItem('supabaseUrl') || PLACEHOLDER_URL;
const supabaseAnonKey = localStorage.getItem('supabaseAnonKey') || PLACEHOLDER_KEY;

/**
 * Verifica se as credenciais do Supabase foram configuradas e não são os valores padrão.
 * @returns {boolean} True se as credenciais estiverem configuradas.
 */
export const areCredentialsConfigured = (): boolean => {
    return supabaseUrl !== PLACEHOLDER_URL && supabaseAnonKey !== PLACEHOLDER_KEY;
};

if (!areCredentialsConfigured()) {
    console.warn("Supabase URL ou Anon Key não foram configuradas. O aplicativo irá solicitar a configuração na interface do usuário.");
}

/**
 * Salva as novas credenciais no localStorage e recarrega a página
 * para aplicar as alterações em toda a aplicação.
 * @param {string} url - A URL do projeto Supabase.
 * @param {string} key - A chave anônima (pública) do Supabase.
 */
export const updateSupabaseCredentials = (url: string, key: string) => {
    localStorage.setItem('supabaseUrl', url);
    localStorage.setItem('supabaseAnonKey', key);
    window.location.reload();
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);