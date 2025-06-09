import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      include: {
        sessions: true
      }
    })
    return NextResponse.json(devices)
  } catch (error) {
    console.error('Error fetching devices:', error)
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newDevice = await request.json()
    
    const device = await prisma.device.create({
      data: {
        name: newDevice.name,
        hourlyRate: parseFloat(newDevice.hourlyRate),
        status: 'متاح',
        currentSession: null
      }
    })
    
    return NextResponse.json(device)
  } catch (error) {
    console.error('Error creating device:', error)
    return NextResponse.json({ error: 'Failed to create device' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const update = await request.json()
    const { id, ...changes } = update

    const device = await prisma.device.update({
      where: { id },
      data: changes
    })

    return NextResponse.json(device)
  } catch (error) {
    console.error('Error updating device:', error)
    return NextResponse.json({ error: 'Failed to update device' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    await prisma.device.delete({
      where: { id }
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting device:', error)
    return NextResponse.json({ error: 'Failed to delete device' }, { status: 500 })
  }
} 