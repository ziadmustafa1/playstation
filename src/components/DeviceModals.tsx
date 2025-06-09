import { Device } from '@/types'

interface DeviceModalsProps {
  isAddingDevice: boolean
  isEditingDevice: boolean
  selectedDevice: Device | null
  newDevice: {
    name: string
    hourlyRate: string
  }
  onAddDevice: () => void
  onEditDevice: () => void
  onCloseAdd: () => void
  onCloseEdit: () => void
  onNewDeviceChange: (device: { name: string; hourlyRate: string }) => void
  onSelectedDeviceChange: (device: Device) => void
}

export default function DeviceModals({
  isAddingDevice,
  isEditingDevice,
  selectedDevice,
  newDevice,
  onAddDevice,
  onEditDevice,
  onCloseAdd,
  onCloseEdit,
  onNewDeviceChange,
  onSelectedDeviceChange
}: DeviceModalsProps) {
  return (
    <>
      {/* Add Device Modal */}
      {isAddingDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-scaleIn">
            <h2 className="text-2xl font-bold mb-6">إضافة جهاز جديد</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الجهاز
                </label>
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={(e) => onNewDeviceChange({ ...newDevice, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="مثال: PS5-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سعر الساعة
                </label>
                <input
                  type="number"
                  value={newDevice.hourlyRate}
                  onChange={(e) => onNewDeviceChange({ ...newDevice, hourlyRate: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="مثال: 30"
                  min="0"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={onAddDevice}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95"
                >
                  إضافة
                </button>
                <button
                  onClick={onCloseAdd}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Device Modal */}
      {isEditingDevice && selectedDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-scaleIn">
            <h2 className="text-2xl font-bold mb-6">تعديل الجهاز</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الجهاز
                </label>
                <input
                  type="text"
                  value={selectedDevice.name}
                  onChange={(e) => onSelectedDeviceChange({ ...selectedDevice, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="مثال: PS5-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سعر الساعة
                </label>
                <input
                  type="number"
                  value={selectedDevice.hourlyRate}
                  onChange={(e) => onSelectedDeviceChange({ ...selectedDevice, hourlyRate: parseFloat(e.target.value) })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="مثال: 30"
                  min="0"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={onEditDevice}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95"
                >
                  حفظ التعديلات
                </button>
                <button
                  onClick={onCloseEdit}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 