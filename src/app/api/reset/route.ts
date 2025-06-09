import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'src/data/db.json')

export async function POST() {
  try {
    const emptyData = {
      devices: [],
      sessions: []
    }
    
    await fs.writeFile(dataFilePath, JSON.stringify(emptyData, null, 2), 'utf8')
    return NextResponse.json({ message: 'تم مسح البيانات بنجاح' })
  } catch (error) {
    console.error('Error resetting data:', error)
    return new NextResponse('فشل في مسح البيانات', { status: 500 })
  }
} 