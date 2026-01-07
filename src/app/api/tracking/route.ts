import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const trackedJobs = await prisma.trackedJob.findMany({
      include: {
        job: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: trackedJobs })
  } catch (error) {
    console.error('Failed to fetch tracked jobs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tracked jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobId } = body

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Check if already tracked
    const existing = await prisma.trackedJob.findUnique({
      where: { jobId }
    })

    if (existing) {
      return NextResponse.json({ success: true, data: existing })
    }

    // Create tracking
    const trackedJob = await prisma.trackedJob.create({
      data: {
        jobId,
        status: 'SAVED',
      },
      include: {
        job: true,
      },
    })

    return NextResponse.json({ success: true, data: trackedJob })
  } catch (error) {
    console.error('Failed to track job:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track job' },
      { status: 500 }
    )
  }
}

