'use client'

import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Device, Session } from '@/types'
import { Check, X, AlertTriangle } from 'lucide-react'
import StatsCards from './StatsCards'
import DeviceCard from './DeviceCard'
import SessionsTable from './SessionsTable'
import ConfirmDialog from './ConfirmDialog'
import DeviceModals from './DeviceModals'

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function HomeClient() {
  const [devices, setDevices] = useState<Device[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [isAddingDevice, setIsAddingDevice] = useState(false)
  const [isEditingDevice, setIsEditingDevice] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [newDevice, setNewDevice] = useState({
    name: '',
    hourlyRate: ''
  })
  const [timers, setTimers] = useState<{ [key: string]: number }>({})
  const [filterPeriod, setFilterPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('all')
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)

  useEffect(() => {
    loadDevices()
    loadSessions()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const newTimers = { ...prevTimers }
        devices.forEach(device => {
          if (device.status === 'مشغول' && device.currentSession) {
            const startTime = new Date(device.currentSession.startTime)
            const now = new Date()
            const seconds = Math.floor((now.getTime() - startTime.getTime()) / 1000)
            newTimers[device.id] = seconds
          }
        })
        return newTimers
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [devices])

  async function loadDevices() {
    try {
      const res = await fetch('/api/devices')
      const data = await res.json()
      setDevices(data)
    } catch (error) {
      console.error('Error loading devices:', error)
    }
  }

  async function loadSessions() {
    try {
      const res = await fetch('/api/sessions')
      const data = await res.json()
      setSessions(data)
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }

  async function handleDeleteDevice(deviceId: string) {
    const promise = new Promise<string>(async (resolve, reject) => {
      try {
        const res = await fetch(`/api/devices?id=${deviceId}`, {
          method: 'DELETE'
        })

        if (!res.ok) throw new Error('فشل في حذف الجهاز')
        
        await loadDevices()
        resolve('تم حذف الجهاز بنجاح')
      } catch (error) {
        console.error('Error deleting device:', error)
        reject('حدث خطأ أثناء حذف الجهاز')
      }
    })

    toast.promise(promise, {
      loading: 'جاري حذف الجهاز...',
      success: (message: string) => (
        <div className="flex items-center gap-2 font-medium">
          <Check className="w-5 h-5 text-green-500" />
          <span>{message}</span>
        </div>
      ),
      error: (message: string) => (
        <div className="flex items-center gap-2 font-medium">
          <X className="w-5 h-5 text-red-500" />
          <span>{message}</span>
        </div>
      ),
    })
  }

  async function handleAddDevice() {
    if (!newDevice.name || !newDevice.hourlyRate) {
      toast.error(
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="w-5 h-5" />
          <span>يرجى ملء جميع الحقول</span>
        </div>
      )
      return
    }

    const promise = new Promise<string>(async (resolve, reject) => {
      try {
        const res = await fetch('/api/devices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newDevice.name,
            hourlyRate: parseFloat(newDevice.hourlyRate),
            status: 'متاح',
            currentSession: null
          })
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'فشل في إضافة الجهاز')
        }

        setIsAddingDevice(false)
        setNewDevice({ name: '', hourlyRate: '' })
        await loadDevices()
        resolve('تم إضافة الجهاز بنجاح')
      } catch (error) {
        console.error('Error adding device:', error)
        reject(error instanceof Error ? error.message : 'حدث خطأ أثناء إضافة الجهاز')
      }
    })

    toast.promise(promise, {
      loading: 'جاري إضافة الجهاز...',
      success: (message: string) => (
        <div className="flex items-center gap-2 font-medium">
          <Check className="w-5 h-5 text-green-500" />
          <span>{message}</span>
        </div>
      ),
      error: (message: string) => (
        <div className="flex items-center gap-2 font-medium">
          <X className="w-5 h-5 text-red-500" />
          <span>{message}</span>
        </div>
      ),
    })
  }

  async function handleStartSession(deviceId: string) {
    const promise = new Promise<string>(async (resolve, reject) => {
      try {
        const startTime = new Date().toISOString()
        
        const deviceRes = await fetch(`/api/devices`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: deviceId,
            status: 'مشغول',
            currentSession: {
              startTime,
              status: 'جارية'
            }
          })
        })

        if (!deviceRes.ok) throw new Error('فشل في بدء الجلسة')

        const sessionRes = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            deviceId,
            startTime,
            status: 'جارية'
          })
        })

        if (!sessionRes.ok) throw new Error('فشل في إنشاء الجلسة')

        setTimers(prev => ({ ...prev, [deviceId]: 0 }))
        await loadDevices()
        resolve('تم بدء الجلسة بنجاح')
      } catch (error) {
        console.error('Error starting session:', error)
        reject('حدث خطأ أثناء بدء الجلسة')
      }
    })

    toast.promise(promise, {
      loading: 'جاري بدء الجلسة...',
      success: (message: string) => (
        <div className="flex items-center gap-2 font-medium">
          <Check className="w-5 h-5 text-green-500" />
          <span>{message}</span>
        </div>
      ),
      error: (message: string) => (
        <div className="flex items-center gap-2 font-medium">
          <X className="w-5 h-5 text-red-500" />
          <span>{message}</span>
        </div>
      ),
    })
  }

  interface SessionEndResult {
    message: string;
    duration: number;
    cost: number;
  }

  async function handleEndSession(deviceId: string) {
    const promise = new Promise<SessionEndResult>(async (resolve, reject) => {
      try {
        const deviceRes = await fetch(`/api/devices/${deviceId}`)
        if (!deviceRes.ok) {
          const errorData = await deviceRes.json()
          throw new Error(errorData.error || 'فشل في العثور على الجهاز')
        }
        const device = await deviceRes.json()

        if (!device.currentSession) throw new Error('لا توجد جلسة نشطة')

        const startTime = new Date(device.currentSession.startTime)
        const endTime = new Date()
        const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) // بالساعات
        const cost = Math.ceil(duration * device.hourlyRate)

        await fetch(`/api/devices`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: deviceId,
            status: 'متاح',
            currentSession: null
          })
        })

        const sessionsRes = await fetch('/api/sessions')
        const sessions = await sessionsRes.json()
        const currentSession = sessions.find(
          (s: Session) => s.deviceId === deviceId && s.status === 'جارية'
        )

        if (currentSession) {
          await fetch(`/api/sessions`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: currentSession.id,
              endTime: endTime.toISOString(),
              duration,
              cost,
              status: 'منتهية'
            })
          })
        }

        await loadDevices()
        await loadSessions()
        resolve({ message: 'تم إنهاء الجلسة بنجاح', duration, cost })
      } catch (error) {
        console.error('Error ending session:', error)
        reject(error instanceof Error ? error.message : 'حدث خطأ أثناء إنهاء الجلسة')
      }
    })

    toast.promise(promise, {
      loading: 'جاري إنهاء الجلسة...',
      success: (data: SessionEndResult) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-5 h-5 text-green-500" />
            <span>{data.message}</span>
          </div>
          <div className="text-sm text-gray-600">
            <div>المدة: {data.duration.toFixed(2)} ساعة</div>
            <div>التكلفة: {data.cost} ج.م</div>
          </div>
        </div>
      ),
      error: (message: string) => (
        <div className="flex items-center gap-2 font-medium">
          <X className="w-5 h-5 text-red-500" />
          <span>{message}</span>
        </div>
      ),
    })
  }

  async function handleEditDevice() {
    if (!selectedDevice || !selectedDevice.name || !selectedDevice.hourlyRate) {
      toast.error(
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="w-5 h-5" />
          <span>يرجى ملء جميع الحقول</span>
        </div>
      )
      return
    }

    const promise = new Promise<string>(async (resolve, reject) => {
      try {
        const res = await fetch('/api/devices', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: selectedDevice.id,
            name: selectedDevice.name,
            hourlyRate: parseFloat(selectedDevice.hourlyRate.toString())
          })
        })

        if (!res.ok) throw new Error('فشل في تعديل الجهاز')

        setIsEditingDevice(false)
        setSelectedDevice(null)
        await loadDevices()
        resolve('تم تعديل الجهاز بنجاح')
      } catch (error) {
        console.error('Error editing device:', error)
        reject('حدث خطأ أثناء تعديل الجهاز')
      }
    })

    toast.promise(promise, {
      loading: 'جاري تعديل الجهاز...',
      success: (message: string) => (
        <div className="flex items-center gap-2 font-medium">
          <Check className="w-5 h-5 text-green-500" />
          <span>{message}</span>
        </div>
      ),
      error: (message: string) => (
        <div className="flex items-center gap-2 font-medium">
          <X className="w-5 h-5 text-red-500" />
          <span>{message}</span>
        </div>
      ),
    })
  }

  const handleResetConfirm = () => {
    setIsResetConfirmOpen(true)
  }

  const handleResetCancel = () => {
    setIsResetConfirmOpen(false)
  }

  const handleResetConfirmed = async () => {
    const promise = new Promise<string>(async (resolve, reject) => {
      try {
        const res = await fetch('/api/reset', {
          method: 'POST'
        })

        if (!res.ok) throw new Error('فشل في مسح البيانات')

        await loadDevices()
        await loadSessions()
        setIsResetConfirmOpen(false)
        resolve('تم مسح جميع البيانات بنجاح')
      } catch (error) {
        console.error('Error resetting data:', error)
        reject('حدث خطأ أثناء مسح البيانات')
      }
    })

    toast.promise(promise, {
      loading: 'جاري مسح البيانات...',
      success: (message: string) => (
        <div className="flex items-center gap-2 font-medium">
          <Check className="w-5 h-5 text-green-500" />
          <span>{message}</span>
        </div>
      ),
      error: (message: string) => (
        <div className="flex items-center gap-2 font-medium">
          <X className="w-5 h-5 text-red-500" />
          <span>{message}</span>
        </div>
      ),
    })
  }

  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime)
    const now = new Date()

    switch (filterPeriod) {
      case 'daily':
        return sessionDate.toDateString() === now.toDateString()
      case 'weekly':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return sessionDate >= weekAgo
      case 'monthly':
        return (
          sessionDate.getMonth() === now.getMonth() &&
          sessionDate.getFullYear() === now.getFullYear()
        )
      default:
        return true
    }
  })

  const totalRevenue = filteredSessions.reduce((sum, session) => sum + (session.cost || 0), 0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6" dir="rtl">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <StatsCards
          devices={devices}
          sessions={sessions}
          totalRevenue={totalRevenue}
          filterPeriod={filterPeriod}
          onFilterChange={setFilterPeriod}
          onAddDevice={() => setIsAddingDevice(true)}
          onResetData={handleResetConfirm}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              timer={timers[device.id] || 0}
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
              onEditDevice={(device) => {
                setSelectedDevice(device)
                setIsEditingDevice(true)
              }}
              onDeleteDevice={handleDeleteDevice}
              formatTime={formatTime}
              formatDate={formatDate}
            />
          ))}
        </div>

        <SessionsTable
          sessions={filteredSessions}
          devices={devices}
          formatDate={formatDate}
        />
      </div>

      <DeviceModals
        isAddingDevice={isAddingDevice}
        isEditingDevice={isEditingDevice}
        selectedDevice={selectedDevice}
        newDevice={newDevice}
        onAddDevice={handleAddDevice}
        onEditDevice={handleEditDevice}
        onCloseAdd={() => setIsAddingDevice(false)}
        onCloseEdit={() => {
          setIsEditingDevice(false)
          setSelectedDevice(null)
        }}
        onNewDeviceChange={setNewDevice}
        onSelectedDeviceChange={setSelectedDevice}
      />

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={handleResetCancel}
        onConfirm={handleResetConfirmed}
        title="تأكيد تصفير البيانات"
        message="هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع عن هذه العملية!"
        confirmText="نعم، امسح البيانات"
        cancelText="لا، إلغاء"
      />
    </main>
  )
} 