import { Clock, DollarSign, Filter, Plus, RefreshCw } from 'lucide-react'
import { Device, Session } from '@/types'

interface StatsCardsProps {
  devices: Device[]
  sessions: Session[]
  totalRevenue: number
  filterPeriod: 'daily' | 'weekly' | 'monthly' | 'all'
  onFilterChange: (value: 'daily' | 'weekly' | 'monthly' | 'all') => void
  onAddDevice: () => void
  onResetData: () => void
}

export default function StatsCards({
  devices,
  sessions,
  totalRevenue,
  filterPeriod,
  onFilterChange,
  onAddDevice,
  onResetData
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {/* Total Revenue Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow p-3 sm:p-4 md:p-6 transition-all hover:shadow-xl transform hover:-translate-y-1 animate-slideInFromTop">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="bg-blue-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
          <button 
            onClick={onAddDevice}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 text-xs sm:text-sm transition-all transform hover:scale-105"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">إضافة جهاز</span>
            <span className="sm:hidden">إضافة</span>
          </button>
        </div>
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 mb-1">إجمالي الإيرادات</h3>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{totalRevenue} ج.م</p>
      </div>

      {/* Active Sessions Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow p-3 sm:p-4 md:p-6 transition-all hover:shadow-xl transform hover:-translate-y-1 animate-slideInFromTop animation-delay-100">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="bg-green-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
          </div>
          <span className="bg-green-100 text-green-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium">
            نشط
          </span>
        </div>
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 mb-1">الجلسات النشطة</h3>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
          {devices.filter(d => d.status === 'مشغول').length} / {devices.length}
        </p>
      </div>

      {/* Total Sessions Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow p-3 sm:p-4 md:p-6 transition-all hover:shadow-xl transform hover:-translate-y-1 animate-slideInFromTop animation-delay-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="bg-purple-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
          </div>
          <button 
            onClick={onResetData}
            className="bg-red-100 text-red-600 hover:bg-red-200 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl flex items-center gap-1 text-xs sm:text-sm transition-all"
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="inline">تصفير</span>
          </button>
        </div>
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 mb-1">إجمالي الجلسات</h3>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">{sessions.length}</p>
      </div>

      {/* Filter Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow p-3 sm:p-4 md:p-6 transition-all hover:shadow-xl transform hover:-translate-y-1 animate-slideInFromTop animation-delay-300">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="bg-gray-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
          </div>
        </div>
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 mb-2">تصفية حسب</h3>
        <select
          value={filterPeriod}
          onChange={(e) => onFilterChange(e.target.value as 'daily' | 'weekly' | 'monthly' | 'all')}
          className="w-full bg-gray-50 border-none rounded-lg sm:rounded-xl py-1 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">كل الجلسات</option>
          <option value="daily">اليوم</option>
          <option value="weekly">الأسبوع</option>
          <option value="monthly">الشهر</option>
        </select>
      </div>
    </div>
  )
} 