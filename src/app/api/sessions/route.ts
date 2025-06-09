import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Device, Session } from '@/types'
import os from 'os'

// تغيير مسار الملف ليكون في مجلد tmp في بيئة الإنتاج
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
    // إذا لم يكن الملف موجوداً، قم بإنشائه مع البيانات الأولية
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

async function writeData(data: { devices: Device[], sessions: Session[] }) {
  try {
    await fs.writeFile(getDataFilePath(), JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error('Error writing data:', error)
    throw new Error('فشل في حفظ البيانات')
  }
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
    ...newSession
  }
  
  data.sessions.push(session)
  await writeData(data)
  
  return NextResponse.json(session)
}

export async function PATCH(request: Request) {
  const data = await readData()
  const update = await request.json()
  const { id, ...changes } = update

  const sessionIndex = data.sessions.findIndex((s: Session) => s.id === id)
  if (sessionIndex === -1) {
    return new NextResponse('Session not found', { status: 404 })
  }

  data.sessions[sessionIndex] = { ...data.sessions[sessionIndex], ...changes }
  await writeData(data)

  return NextResponse.json(data.sessions[sessionIndex])
} 