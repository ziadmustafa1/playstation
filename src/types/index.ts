export interface Device {
  id: number;
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
  deviceId: number;
  startTime: string;
  endTime?: string;
  duration?: number;
  cost?: number;
  status: 'جارية' | 'منتهية';
} 