import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        tracking: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: jobs })
  } catch (error) {
    console.error('Failed to fetch jobs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    // Delete all jobs (also deletes tracking via cascade)
    await prisma.job.deleteMany()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete jobs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete jobs' },
      { status: 500 }
    )
  }
}

