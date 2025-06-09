'use server'

import fs from 'fs'
import path from 'path'
import { Device, Customer, Session, MaintenanceRecord, Reservation, DailyReport } from '../utils/dataStore'
import { Device as DeviceType } from '@/types'

const DATA_FILE = path.join(process.cwd(), 'src/data/store.json')
const API_URL = 'http://localhost:3001'

export async function readStoreData(): Promise<{
  devices: Device[];
  customers: Customer[];
  sessions: Session[];
  maintenance: MaintenanceRecord[];
  reservations: Reservation[];
  reports: DailyReport[];
}> {
  try {
    const data = await fs.promises.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading data:', error)
    return {
      devices: [],
      customers: [],
      sessions: [],
      maintenance: [],
      reservations: [],
      reports: []
    }
  }
}

export async function updateDevice(device: Device) {
  try {
    const data = await readStoreData()
    const index = data.devices.findIndex((d: Device) => d.id === device.id)
    if (index !== -1) {
      data.devices[index] = device
      await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error('Error updating device:', error)
  }
}

export async function updateCustomer(customer: Customer) {
  try {
    const data = await readStoreData()
    const index = data.customers.findIndex((c: Customer) => c.id === customer.id)
    if (index !== -1) {
      data.customers[index] = customer
      await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error('Error updating customer:', error)
  }
}

export async function addSession(sessionData: Omit<Session, 'id'>): Promise<Session> {
  try {
    const data = await readStoreData()
    const newSession: Session = {
      ...sessionData,
      id: Math.max(...data.sessions.map((s: Session) => s.id), 0) + 1
    }
    data.sessions.push(newSession)
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    return newSession
  } catch (error) {
    console.error('Error adding session:', error)
    throw error
  }
}

export async function updateSession(session: Session) {
  try {
    const data = await readStoreData()
    const index = data.sessions.findIndex((s: Session) => s.id === session.id)
    if (index !== -1) {
      data.sessions[index] = session
      await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error('Error updating session:', error)
  }
}

export async function addMaintenance(record: Omit<MaintenanceRecord, 'id'>): Promise<MaintenanceRecord> {
  try {
    const data = await readStoreData()
    const newRecord: MaintenanceRecord = {
      ...record,
      id: Math.max(...data.maintenance.map((m) => m.id), 0) + 1
    }
    data.maintenance.push(newRecord)

    // Update device maintenance history
    const device = data.devices.find((d) => d.id === record.deviceId)
    if (device) {
      device.maintenanceHistory = device.maintenanceHistory || []
      device.maintenanceHistory.push(newRecord)
      device.lastMaintenance = record.date
    }

    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    return newRecord
  } catch (error) {
    console.error('Error adding maintenance record:', error)
    throw error
  }
}

export async function addReservation(reservation: Omit<Reservation, 'id'>): Promise<Reservation> {
  try {
    const data = await readStoreData()
    const newReservation: Reservation = {
      ...reservation,
      id: Math.max(...data.reservations.map((r) => r.id), 0) + 1
    }
    data.reservations.push(newReservation)
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    return newReservation
  } catch (error) {
    console.error('Error adding reservation:', error)
    throw error
  }
}

export async function updateReservation(reservation: Reservation) {
  try {
    const data = await readStoreData()
    const index = data.reservations.findIndex((r) => r.id === reservation.id)
    if (index !== -1) {
      data.reservations[index] = reservation
      await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error('Error updating reservation:', error)
  }
}

export async function generateDailyReport(date: string): Promise<DailyReport> {
  try {
    const data = await readStoreData()
    
    // Filter sessions for the given date
    const dailySessions = data.sessions.filter((s) => s.startTime.startsWith(date))
    
    // Calculate statistics
    const totalRevenue = dailySessions.reduce((sum, s) => sum + s.cost, 0)
    const totalDuration = dailySessions.reduce((sum, s) => sum + s.duration, 0)
    
    // Get top devices
    const deviceStats = dailySessions.reduce((acc, session) => {
      const deviceId = session.deviceId
      if (!acc[deviceId]) {
        acc[deviceId] = { revenue: 0, hours: 0 }
      }
      acc[deviceId].revenue += session.cost
      acc[deviceId].hours += session.duration
      return acc
    }, {} as Record<number, { revenue: number; hours: number }>)

    const topDevices = Object.entries(deviceStats)
      .map(([deviceId, stats]) => ({
        deviceId: parseInt(deviceId),
        revenue: stats.revenue,
        hours: stats.hours
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Get top games
    const gameStats = dailySessions.reduce((acc, session) => {
      session.games.forEach((game) => {
        acc[game] = (acc[game] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    const topGames = Object.entries(gameStats)
      .map(([name, playCount]) => ({ name, playCount }))
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 5)

    // Calculate maintenance expenses
    const maintenanceExpenses = data.maintenance
      .filter((m) => m.date.startsWith(date))
      .reduce((sum, m) => sum + m.cost, 0)

    // Calculate service expenses
    const serviceExpenses = dailySessions
      .flatMap((s) => s.additionalServices)
      .reduce((sum, s) => sum + s.cost * s.quantity, 0)

    const report: DailyReport = {
      date,
      totalRevenue,
      totalSessions: dailySessions.length,
      averageSessionDuration: dailySessions.length ? totalDuration / dailySessions.length : 0,
      topDevices,
      topGames,
      expenses: {
        maintenance: maintenanceExpenses,
        services: serviceExpenses,
        other: 0
      }
    }

    // Save the report
    const data2 = await readStoreData()
    data2.reports = data2.reports || []
    data2.reports.push(report)
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data2, null, 2))

    return report
  } catch (error) {
    console.error('Error generating daily report:', error)
    throw error
  }
}

export async function updateCustomerBalance(customerId: number, amount: number) {
  try {
    const data = await readStoreData()
    const customer = data.customers.find((c) => c.id === customerId)
    if (customer) {
      customer.balance += amount
      await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error('Error updating customer balance:', error)
  }
}

export async function getDevices(): Promise<DeviceType[]> {
  const res = await fetch(`${API_URL}/devices`)
  return res.json()
}

export async function addDevice(device: Omit<DeviceType, 'id' | 'status' | 'currentSession'>): Promise<DeviceType> {
  const res = await fetch(`${API_URL}/devices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...device,
      status: 'متاح',
      currentSession: null,
    }),
  })
  return res.json()
}

export async function startSession(deviceId: number): Promise<Session> {
  // Get the device first
  const deviceRes = await fetch(`${API_URL}/devices/${deviceId}`)
  const device = await deviceRes.json()

  if (device.status === 'مشغول') {
    throw new Error('الجهاز مشغول حالياً')
  }

  // Create new session
  const session = {
    deviceId,
    startTime: new Date().toISOString(),
    status: 'جارية' as const,
  }

  const sessionRes = await fetch(`${API_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(session),
  })
  const newSession = await sessionRes.json()

  // Update device status
  await fetch(`${API_URL}/devices/${deviceId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'مشغول',
      currentSession: newSession,
    }),
  })

  return newSession
}

export async function endSession(deviceId: number): Promise<Session> {
  // Get the device first
  const deviceRes = await fetch(`${API_URL}/devices/${deviceId}`)
  const device = await deviceRes.json()

  if (device.status !== 'مشغول' || !device.currentSession) {
    throw new Error('لا توجد جلسة جارية لهذا الجهاز')
  }

  const session = device.currentSession
  const startTime = new Date(session.startTime)
  const endTime = new Date()
  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) // Convert to hours
  const cost = Math.ceil(duration * device.hourlyRate)

  // Update session
  const updatedSession = {
    ...session,
    endTime: endTime.toISOString(),
    duration,
    cost,
    status: 'منتهية' as const,
  }

  const sessionRes = await fetch(`${API_URL}/sessions/${session.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedSession),
  })

  // Update device status
  await fetch(`${API_URL}/devices/${deviceId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'متاح',
      currentSession: null,
    }),
  })

  return sessionRes.json()
} 