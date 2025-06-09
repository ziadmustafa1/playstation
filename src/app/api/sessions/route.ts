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

async function writeData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8')
}

export async function GET() {
  const data = await readData()
  return NextResponse.json(data.sessions)
}

export async function POST(request: Request) {
  const data = await readData()
  const newSession = await request.json()
  
  const session = {
    id: Date.now().toString(),
    ...newSession,
  }
  
  data.sessions.push(session)
  await writeData(data)
  
  return NextResponse.json(session)
}

export async function PATCH(request: Request) {
  const data = await readData()
  const update = await request.json()
  const { id, ...changes } = update

  const sessionIndex = data.sessions.findIndex((s: any) => s.id === id)
  if (sessionIndex === -1) {
    return new NextResponse('Session not found', { status: 404 })
  }

  data.sessions[sessionIndex] = { ...data.sessions[sessionIndex], ...changes }
  await writeData(data)

  return NextResponse.json(data.sessions[sessionIndex])
} 