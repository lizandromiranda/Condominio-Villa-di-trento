import React, { useState } from 'react';
import { Reservation } from '../../types';
import BaseModal from './BaseModal';
import { UploadIcon } from '../icons';
import { supabase } from '../../supabaseClient';

interface UploadProofModalProps {
  reservation: Reservation;
  onClose: () => void;
  onUpload: (reservationId: string, proofUrl: string) => void;
}

const UploadProofModal: React.FC<UploadProofModalProps> = ({ reservation, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('O arquivo é muito grande. O limite é de 2MB.');
        return;
      }
      setError('');
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor, selecione um arquivo.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${reservation.apartment}-${reservation.id}-${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('proofs') // Assumes a bucket named 'proofs'
            .upload(filePath, selectedFile, {
                upsert: true, // Overwrite if file exists
            });

        if (uploadError) {
            throw uploadError;
        }

        // Get public URL of the uploaded file
        const { data: urlData } = supabase.storage
            .from('proofs')
            .getPublicUrl(filePath);

        if (!urlData.publicUrl) {
            throw new Error('Could not get public URL for the uploaded file.');
        }

        // Call the onUpload prop with the public URL
        onUpload(reservation.id, urlData.publicUrl);

    } catch (err: any) {
        setError('Ocorreu um erro ao enviar o arquivo. Tente novamente.');
        console.error("Upload error:", err.message || err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <BaseModal title={`Enviar Comprovante`} isOpen={true} onClose={onClose} size="md">
      <div>
        <p className="text-slate-600 mb-4">
          Anexe o comprovante de pagamento para a reserva do espaço <strong>{reservation.spaceName}</strong> no dia <strong>{new Date(reservation.date + 'T00:00:00-03:00').toLocaleDateString('pt-BR')}</strong>.
        </p>
        <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-800 font-semibold">
                {preview ? 'Trocar imagem' : 'Selecionar imagem'}
            </label>
            {preview && (
                 <div className="mt-4">
                    <img src={preview} alt="Pré-visualização" className="max-h-60 mx-auto rounded-md shadow-md" />
                </div>
            )}
        </div>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold" disabled={isLoading}>
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            className="flex items-center gap-2 py-2 px-6 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition disabled:bg-gray-400"
            disabled={!selectedFile || isLoading}
          >
            <UploadIcon className="h-5 w-5" />
            {isLoading ? 'Enviando...' : 'Enviar Comprovante'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default UploadProofModal;