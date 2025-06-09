import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Delete all sessions first to avoid foreign key constraints
    await prisma.session.deleteMany()
    
    // Then delete all devices
    await prisma.device.deleteMany()
    
    return NextResponse.json({ message: 'تم مسح البيانات بنجاح' })
  } catch (error) {
    console.error('Error resetting data:', error)
    return NextResponse.json({ error: 'فشل في مسح البيانات' }, { status: 500 })
  }
} 