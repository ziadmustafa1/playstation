export interface Device {
  id: string;
  name: string;
  hourlyRate: number;
  status: 'متاح' | 'مشغول';
  currentSession: {
    startTime: string;
    status: 'جارية';
  } | null;
}

export interface Session {
  id: number;
  deviceId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  cost?: number;
  status: 'جارية' | 'منتهية';
} 