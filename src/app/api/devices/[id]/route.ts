import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'src/data/db.json')

async function readData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return { devices: [], sessions: [] }
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await readData()
  const device = data.devices.find((d: any) => d.id === params.id)
  
  if (!device) {
    return new NextResponse('Device not found', { status: 404 })
  }
  
  return NextResponse.json(device)
} 