import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import { Device } from '@/types'

const getDataFilePath = () => {
  if (process.env.NODE_ENV === 'production') {
    return path.join(os.tmpdir(), 'db.json')
  }
  return path.join(process.cwd(), 'src/data/db.json')
}

async function ensureFileExists() {
  const filePath = getDataFilePath()
  try {
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, JSON.stringify({ devices: [], sessions: [] }, null, 2), 'utf8')
  }
}

async function readData() {
  try {
    await ensureFileExists()
    const data = await fs.readFile(getDataFilePath(), 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading data:', error)
    return { devices: [], sessions: [] }
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await readData()
  const device = data.devices.find((d: Device) => d.id === params.id)
  
  if (!device) {
    return NextResponse.json({ error: 'Device not found' }, { status: 404 })
  }
  
  return NextResponse.json(device)
} 