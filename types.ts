export enum ReservationStatus {
  Pending = 'Pendente',
  AwaitingConfirmation = 'Aguardando Confirmação',
  Confirmed = 'Confirmado',
}

export interface Reservation {
  id: string;
  spaceId: string;
  spaceName: string;
  apartment: string;
  date: string; // ISO string format: YYYY-MM-DD
  status: ReservationStatus;
  price: number;
  proofOfPaymentUrl?: string;
}

export interface Space {
  id: string;
  name: string;
  capacity: number;
  image: string;
  amenities: string[];
  price: number;
  gradient: string;
  rules: string[];
}

export interface SpacePrices {
  [key: string]: number;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
