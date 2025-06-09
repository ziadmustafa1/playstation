import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Device } from '@/types'
import { Session } from '@/types'

const dataFilePath = path.join(process.cwd(), 'src/data/db.json')

async function readData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading data:', error)
    return { devices: [], sessions: [] }
  }
}

async function writeData(data: { devices: Device[], sessions: Session[] }) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error('Error writing data:', error)
  }
}

export async function GET() {
  const data = await readData()
  return NextResponse.json(data.devices)
}

export async function POST(request: Request) {
  const data = await readData()
  const newDevice = await request.json()
  
  const device = {
    id: Date.now().toString(),
    ...newDevice,
    status: 'متاح',
    currentSession: null
  }
  
  data.devices.push(device)
  await writeData(data)
  
  return NextResponse.json(device)
}

export async function PATCH(request: Request) {
  const data = await readData()
  const update = await request.json()
  const { id, ...changes } = update

  const deviceIndex = data.devices.findIndex((d: Device) => d.id === id)
  if (deviceIndex === -1) {
    return new NextResponse('Device not found', { status: 404 })
  }

  data.devices[deviceIndex] = { ...data.devices[deviceIndex], ...changes }
  await writeData(data)

  return NextResponse.json(data.devices[deviceIndex])
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) return new NextResponse('ID is required', { status: 400 })
  
  const data = await readData()
  data.devices = data.devices.filter((d: Device) => d.id.toString() === id)
  await writeData(data)
  
  return new NextResponse(null, { status: 204 })
} 