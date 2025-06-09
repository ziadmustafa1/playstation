import { Clock, DollarSign, Edit, Play, Square, Trash2 } from 'lucide-react'
import { Device } from '@/types'

interface DeviceCardProps {
  device: Device
  timer: number
  onStartSession: (deviceId: number) => void
  onEndSession: (deviceId: number) => void
  onEditDevice: (device: Device) => void
  onDeleteDevice: (deviceId: number) => void
  formatTime: (seconds: number) => string
  formatDate: (date: string) => string
}

export default function DeviceCard({
  device,
  timer,
  onStartSession,
  onEndSession,
  onEditDevice,
  onDeleteDevice,
  formatTime,
  formatDate
}: DeviceCardProps) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow overflow-hidden transition-all hover:shadow-xl transform hover:-translate-y-1 animate-scaleIn">
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1">{device.name}</h3>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm text-gray-500">السعر:</span>
              <span className="text-xs sm:text-sm font-semibold text-blue-600">{device.hourlyRate} ج.م/ساعة</span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <span
              className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                device.status === 'متاح'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {device.status}
            </span>
            {device.status === 'متاح' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEditDevice(device)}
                  className="text-blue-500 hover:text-blue-600 transition-colors p-1 sm:p-2 hover:bg-blue-50 rounded-full"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => onDeleteDevice(device.id)}
                  className="text-red-500 hover:text-red-600 transition-colors p-1 sm:p-2 hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {device.status === 'مشغول' && device.currentSession && (
          <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 border border-blue-100">
            <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-blue-900">جلسة نشطة</span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm text-gray-600">الوقت:</span>
                </div>
                <span className="font-mono text-sm sm:text-base md:text-lg font-bold text-blue-600">
                  {formatTime(timer)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  <span className="text-xs sm:text-sm text-gray-600">التكلفة:</span>
                </div>
                <span className="font-mono text-sm sm:text-base md:text-lg font-bold text-green-600">
                  {Math.ceil((timer) / 3600 * device.hourlyRate)} ج.م
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  <span className="text-xs sm:text-sm text-gray-600">بداية:</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-900">
                  {formatDate(device.currentSession.startTime)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          {device.status === 'متاح' ? (
            <button
              onClick={() => onStartSession(device.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 transition-all transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4" />
              بدء جلسة
            </button>
          ) : (
            <button
              onClick={() => onEndSession(device.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 transition-all transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
            >
              <Square className="w-3 h-3 sm:w-4 sm:h-4" />
              إنهاء الجلسة
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 