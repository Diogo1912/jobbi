import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, notes } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (status === 'APPLIED') updateData.appliedAt = new Date()

    const trackedJob = await prisma.trackedJob.update({
      where: { id },
      data: updateData,
      include: {
        job: true,
      },
    })

    return NextResponse.json({ success: true, data: trackedJob })
  } catch (error) {
    console.error('Failed to update tracking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tracking' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Try to find by tracked job ID first
    let trackedJob = await prisma.trackedJob.findUnique({
      where: { id }
    })

    // If not found, try to find by job ID
    if (!trackedJob) {
      trackedJob = await prisma.trackedJob.findUnique({
        where: { jobId: id }
      })
    }

    if (!trackedJob) {
      return NextResponse.json(
        { success: false, error: 'Tracked job not found' },
        { status: 404 }
      )
    }

    await prisma.trackedJob.delete({
      where: { id: trackedJob.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete tracking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete tracking' },
      { status: 500 }
    )
  }
}

