import { Reservation, ReservationStatus, Space } from '../types';

export const initialSpacesData: Omit<Space, 'price' | 'id'>[] = [
    {
        name: 'Salão de Festas',
        capacity: 45,
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2070&auto=format&fit=crop',
        amenities: ['Mesas e cadeiras', 'Ar condicionado'],
        gradient: 'from-green-500 to-emerald-600',
        rules: [
            'Horário de uso: 10h às 22h.',
            'A limpeza do local é de responsabilidade do morador.',
            'Proibido som excessivamente alto após as 22h.',
            'Qualquer dano ao patrimônio será cobrado do responsável pela reserva.',
            'Lixo deve ser descartado nos locais apropriados.',
        ]
    },
    {
        name: 'Churrasqueira',
        capacity: 30,
        image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1374&auto=format&fit=crop',
        amenities: ['Churrasqueira a carvão', 'Pia e bancada', 'Mesas ao ar livre', 'Área coberta'],
        gradient: 'from-yellow-500 to-amber-600',
        rules: [
            'Horário de uso: 10h às 23h.',
            'A limpeza da churrasqueira e grelhas é obrigatória após o uso.',
            'Utilizar apenas carvão apropriado.',
            'O morador deve trazer seus próprios utensílios (espetos, facas, etc).',
            'Verificar se o gás do fogão auxiliar (se houver) foi desligado.',
        ]
    },
];

const today = new Date();
const getFutureDate = (days: number) => {
    const future = new Date(today);
    future.setDate(today.getDate() + days);
    return future.toISOString().split('T')[0];
};

export const sampleReservations: Reservation[] = [
    {
        id: '1',
        spaceId: 'salao-festas',
        spaceName: 'Salão de Festas',
        apartment: '101',
        date: getFutureDate(5),
        status: ReservationStatus.Confirmed,
        price: 227.00,
    },
    {
        id: '2',
        spaceId: 'churrasqueira',
        spaceName: 'Churrasqueira',
        apartment: '205',
        date: getFutureDate(8),
        status: ReservationStatus.Pending,
        price: 75.00,
    },
    {
        id: '3',
        spaceId: 'churrasqueira',
        spaceName: 'Churrasqueira',
        apartment: '302',
        date: getFutureDate(2),
        status: ReservationStatus.AwaitingConfirmation,
        price: 75.00,
        proofOfPaymentUrl: 'https://i.imgur.com/As8dC2I.png' // Sample image url
    },
        {
        id: '4',
        spaceId: 'salao-festas',
        spaceName: 'Salão de Festas',
        apartment: '404',
        date: getFutureDate(12),
        status: ReservationStatus.Confirmed,
        price: 227.00,
    },
];
