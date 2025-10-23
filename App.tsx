import React, { useState, useEffect } from 'react';
import { Reservation, Space, ReservationStatus, SpacePrices } from './types';
import { ToastProvider } from './contexts/ToastContext';
import { useToast } from './hooks/useToast';
import { supabase, updateSupabaseCredentials, areCredentialsConfigured } from './supabaseClient';

import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import StatsBanner from './components/StatsBanner';
import SpaceCard from './components/SpaceCard';
import ReservationList from './components/ReservationList';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginModal from './components/modals/LoginModal';
import ReservationModal from './components/modals/ReservationModal';
import UpdatePricesModal from './components/modals/UpdatePricesModal';
import UnifiedCalendar from './components/UnifiedCalendar';
import InfoModal from './components/modals/InfoModal';
import UploadProofModal from './components/modals/UploadProofModal';
import ViewProofModal from './components/modals/ViewProofModal';
import SupabaseConfigModal from './components/modals/SupabaseConfigModal';

const AppContent: React.FC = () => {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isConfigured, setIsConfigured] = useState(false);
    
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [spacePrices, setSpacePrices] = useState<SpacePrices>({});

    useEffect(() => {
        // First, check if Supabase credentials are set
        if (areCredentialsConfigured()) {
            setIsConfigured(true);
        } else {
            setIsLoading(false); // Stop loading to show the config modal
        }
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            // Only fetch if configured
            if (!isConfigured) return;

            try {
                // Fetch spaces, prices, and reservations in parallel
                const [spacesRes, pricesRes, reservationsRes] = await Promise.all([
                    supabase.from('spaces').select('*'),
                    supabase.from('space_prices').select('*'),
                    supabase.from('reservations').select('*').order('date', { ascending: true })
                ]);

                if (spacesRes.error) throw spacesRes.error;
                if (pricesRes.error) throw pricesRes.error;
                if (reservationsRes.error) throw reservationsRes.error;

                // Process prices into a map
                const pricesMap: SpacePrices = pricesRes.data.reduce((acc, item) => {
                    acc[item.id] = item.price;
                    return acc;
                }, {} as SpacePrices);

                // Combine spaces with their current prices
                const spacesWithPrices = spacesRes.data.map(space => ({
                    ...space,
                    price: pricesMap[space.id] || 0,
                }));
                
                setSpaces(spacesWithPrices);
                setSpacePrices(pricesMap);
                setReservations(reservationsRes.data);

            } catch (error: any) {
                console.error("Error fetching initial data:", error);
                addToast(`Falha ao carregar dados: ${error.message}. Verifique as credenciais e a conexão.`, 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [addToast, isConfigured]);

    const [isSindicoMode, setIsSindicoMode] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [showUpdatePricesModal, setShowUpdatePricesModal] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
    const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [spaceForInfo, setSpaceForInfo] = useState<Space | null>(null);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showViewProofModal, setShowViewProofModal] = useState(false);
    const [reservationForModal, setReservationForModal] = useState<Reservation | null>(null);
    const [proofImageUrl, setProofImageUrl] = useState<string>('');


    const handleReserveClick = (space: Space) => {
        setSelectedSpace(space);
        setShowReservationModal(true);
    };
    
    const handleInfoClick = (space: Space) => {
        setSpaceForInfo(space);
        setShowInfoModal(true);
    };

    const handleAddReservation = async (reservation: Omit<Reservation, 'id' | 'status' | 'price'>) => {
        const space = spaces.find(s => s.id === reservation.spaceId);
        if (!space) {
            addToast('Espaço selecionado não é válido.', 'error');
            return;
        }

        const newReservationData = {
            ...reservation,
            status: ReservationStatus.Pending,
            price: space.price,
        };

        const { data, error } = await supabase
            .from('reservations')
            .insert(newReservationData)
            .select()
            .single();

        if (error) {
            console.error('Error adding reservation:', error);
            addToast('Erro ao criar a reserva. Tente novamente.', 'error');
        } else {
            setReservations(prev => [...prev, data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            addToast('Reserva solicitada! Anexe o comprovante para análise.', 'success');
        }
    };

    const handleConfirmReservation = async (id: string) => {
        const { error } = await supabase
            .from('reservations')
            .update({ status: ReservationStatus.Confirmed })
            .eq('id', id);

        if (error) {
            console.error('Error confirming reservation:', error);
            addToast('Erro ao confirmar a reserva.', 'error');
        } else {
            setReservations(prev => prev.map(r => r.id === id ? { ...r, status: ReservationStatus.Confirmed } : r));
            addToast('Reserva confirmada com sucesso.', 'success');
        }
    };

    const handleDeleteReservation = async (id: string) => {
        const { error } = await supabase
            .from('reservations')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting reservation:', error);
            addToast('Erro ao excluir a reserva.', 'error');
        } else {
            setReservations(prev => prev.filter(r => r.id !== id));
            addToast('Reserva excluída com sucesso.', 'success');
        }
    };

    const handleUploadProof = async (reservationId: string, proofUrl: string) => {
        const { error } = await supabase
            .from('reservations')
            .update({ proofOfPaymentUrl: proofUrl, status: ReservationStatus.AwaitingConfirmation })
            .eq('id', reservationId);

        if (error) {
            console.error('Error updating proof:', error);
            addToast('Erro ao enviar o comprovante.', 'error');
        } else {
            setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, proofOfPaymentUrl: proofUrl, status: ReservationStatus.AwaitingConfirmation } : r));
            addToast('Comprovante enviado! Aguardando confirmação.', 'success');
        }
        setShowUploadModal(false);
        setReservationForModal(null);
    };


    const handleLogin = (password: string): boolean => {
        if (password === 'sindico2025') {
            setIsSindicoMode(true);
            setShowLoginModal(false);
            addToast('Login bem-sucedido! Bem-vindo, Síndico.', 'success');
            return true;
        }
        addToast('Senha incorreta. Tente novamente.', 'error');
        return false;
    };

    const handleLogout = () => {
        setIsSindicoMode(false);
        addToast('Você saiu do modo síndico.', 'info');
    };

    const handleUpdatePrices = async (newPrices: SpacePrices) => {
        const pricesData = Object.entries(newPrices).map(([id, price]) => ({ id, price }));
        const { error } = await supabase.from('space_prices').upsert(pricesData);

        if (error) {
            console.error('Error updating prices:', error);
            addToast('Erro ao atualizar os valores.', 'error');
        } else {
            setSpacePrices(newPrices);
            setSpaces(prevSpaces => prevSpaces.map(space => ({ ...space, price: newPrices[space.id] || space.price })));
            addToast('Valores atualizados com sucesso.', 'success');
        }
        setShowUpdatePricesModal(false);
    };
    
    const handleCloseReservationModal = () => {
        setShowReservationModal(false);
        setSelectedCalendarDate(null);
    };

    const openUploadModal = (reservation: Reservation) => {
        setReservationForModal(reservation);
        setShowUploadModal(true);
    };

    const openViewProofModal = (url: string) => {
        setProofImageUrl(url);
        setShowViewProofModal(true);
    };

    const handleSaveConfig = (url: string, key: string) => {
        updateSupabaseCredentials(url, key);
    };

    if (isLoading) {
        return <SplashScreen />;
    }

    if (!isConfigured) {
        return <SupabaseConfigModal onSave={handleSaveConfig} />;
    }


    const renderContent = () => {
        return isSindicoMode ? (
            <AdminDashboard 
                reservations={reservations} 
                confirmReservation={handleConfirmReservation}
                deleteReservation={handleDeleteReservation}
                spacePrices={spacePrices}
                onUpdatePricesClick={() => setShowUpdatePricesModal(true)}
                onViewProofClick={openViewProofModal}
            />
        ) : (
            <>
                <StatsBanner reservations={reservations} spaces={spaces} />
                
                <div id="unified-calendar" className="my-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-500">
                        Calendário Unificado
                    </h2>
                    <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
                        Veja a disponibilidade geral ou filtre por espaço. Clique em um dia para pré-selecionar sua data.
                    </p>
                    <UnifiedCalendar
                        reservations={reservations}
                        spaces={spaces}
                        selectedDate={selectedCalendarDate}
                        onDateSelect={setSelectedCalendarDate}
                    />
                </div>

                <div id="spaces" className="my-12 animate-slide-up" style={{ animationDelay: '300ms' }}>
                     <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-500">
                        Reserve seu espaço
                    </h2>
                    <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
                        Faça sua reserva de forma rápida e prática. Escolha o espaço ideal para seu evento.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {spaces.map((space) => (
                            <SpaceCard key={space.id} space={space} onReserveClick={() => handleReserveClick(space)} onInfoClick={() => handleInfoClick(space)}/>
                        ))}
                    </div>
                </div>

                <ReservationList 
                    reservations={reservations} 
                    isSindicoMode={false}
                    onUploadProofClick={openUploadModal}
                 />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-white font-sans text-slate-800">
            <Header
                isSindicoMode={isSindicoMode}
                onSindicoClick={() => isSindicoMode ? handleLogout() : setShowLoginModal(true)}
            />
            <main className="container mx-auto px-4 py-8 pt-24 transition-opacity duration-500">
                {renderContent()}
            </main>

            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLogin={handleLogin}
                />
            )}

            {showReservationModal && selectedSpace && (
                <ReservationModal
                    space={selectedSpace}
                    onClose={handleCloseReservationModal}
                    onAddReservation={handleAddReservation}
                    reservations={reservations}
                    initialDate={selectedCalendarDate}
                />
            )}
             {showUpdatePricesModal && isSindicoMode && (
                <UpdatePricesModal
                    currentPrices={spacePrices}
                    onClose={() => setShowUpdatePricesModal(false)}
                    onSave={handleUpdatePrices}
                />
            )}
            {showInfoModal && spaceForInfo && (
                <InfoModal 
                    space={spaceForInfo}
                    onClose={() => setShowInfoModal(false)}
                />
            )}
            {showUploadModal && reservationForModal && (
                <UploadProofModal
                    reservation={reservationForModal}
                    onClose={() => { setShowUploadModal(false); setReservationForModal(null); }}
                    onUpload={handleUploadProof}
                />
            )}
            {showViewProofModal && (
                <ViewProofModal
                    proofImage={proofImageUrl}
                    onClose={() => setShowViewProofModal(false)}
                />
            )}
        </div>
    );
};


const App: React.FC = () => {
    return (
        <ToastProvider>
            <AppContent />
        </ToastProvider>
    );
};

export default App;