import { Device, Session } from '@/types'

interface SessionsTableProps {
  sessions: Session[]
  devices: Device[]
  formatDate: (date: string) => string
}

export default function SessionsTable({ sessions, devices, formatDate }: SessionsTableProps) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow overflow-hidden animate-slideInFromBottom">
      <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">سجل الجلسات</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الجهاز</th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وقت البدء</th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وقت الانتهاء</th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المدة</th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التكلفة</th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sessions.map((session) => {
              const device = devices.find(d => d.id === session.deviceId)
              return (
                <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{device?.name || 'غير معروف'}</td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600">{formatDate(session.startTime)}</td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600">{session.endTime ? formatDate(session.endTime) : '-'}</td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600">{session.duration ? `${session.duration.toFixed(2)} ساعة` : '-'}</td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-green-600">{session.cost ? `${session.cost} ج.م` : '-'}</td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'جارية'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
} 