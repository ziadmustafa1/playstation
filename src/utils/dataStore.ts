export interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  hourlyRate: number;
  totalHours: number;
  customer: string | null;
  maintenanceHistory: MaintenanceRecord[];
  lastMaintenance: string | null;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  totalSpent: number;
  visits: number;
  membership: MembershipType;
  joinDate: string;
  lastVisit: string;
  favoriteGames: string[];
  notes: string;
  balance: number;
}

export interface Session {
  id: number;
  deviceId: number;
  customerName: string;
  startTime: string;
  duration: number;
  cost: number;
  status: string;
  games: string[];
  additionalServices: AdditionalService[];
  paymentMethod: PaymentMethod;
  discount: number;
}

export interface MaintenanceRecord {
  id: number;
  deviceId: number;
  date: string;
  description: string;
  cost: number;
  technician: string;
  nextMaintenanceDate: string;
}

export interface AdditionalService {
  id: number;
  name: string;
  cost: number;
  quantity: number;
}

export type MembershipType = 'عادي' | 'فضي' | 'ذهبي' | 'بلاتيني' | 'VIP';
export type PaymentMethod = 'نقدي' | 'بطاقة' | 'محفظة إلكترونية' | 'رصيد';

export interface DailyReport {
  date: string;
  totalRevenue: number;
  totalSessions: number;
  averageSessionDuration: number;
  topDevices: {
    deviceId: number;
    revenue: number;
    hours: number;
  }[];
  topGames: {
    name: string;
    playCount: number;
  }[];
  expenses: {
    maintenance: number;
    services: number;
    other: number;
  };
}

export interface Reservation {
  id: number;
  deviceId: number;
  customerId: number;
  date: string;
  startTime: string;
  duration: number;
  status: 'مؤكد' | 'ملغي' | 'منتظر';
  deposit: number;
} 