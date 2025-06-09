import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        device: true
      }
    })
    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newSession = await request.json()
    
    const session = await prisma.session.create({
      data: {
        deviceId: newSession.deviceId,
        startTime: new Date(newSession.startTime),
        status: newSession.status
      },
      include: {
        device: true
      }
    })
    
    return NextResponse.json(session)
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const update = await request.json()
    const { id, ...changes } = update

    if (changes.startTime) {
      changes.startTime = new Date(changes.startTime)
    }
    if (changes.endTime) {
      changes.endTime = new Date(changes.endTime)
    }

    const session = await prisma.session.update({
      where: { id },
      data: changes,
      include: {
        device: true
      }
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
  }
} 