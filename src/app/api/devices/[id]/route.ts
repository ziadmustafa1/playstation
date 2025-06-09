import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const device = await prisma.device.findUnique({
      where: { id: params.id },
      include: {
        sessions: true
      }
    })
    
    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 })
    }
    
    return NextResponse.json(device)
  } catch (error) {
    console.error('Error fetching device:', error)
    return NextResponse.json({ error: 'Failed to fetch device' }, { status: 500 })
  }
} 