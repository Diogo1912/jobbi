import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'user-settings' }
    })

    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: 'user-settings' }
      })
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const settings = await prisma.settings.upsert({
      where: { id: 'user-settings' },
      create: {
        id: 'user-settings',
        desiredRoles: body.desiredRoles,
        preferredLocations: body.preferredLocations,
        remotePreference: body.remotePreference,
        salaryExpectation: body.salaryExpectation,
        skills: body.skills,
        experience: body.experience,
        education: body.education,
        industries: body.industries,
        companySize: body.companySize,
        dealBreakers: body.dealBreakers,
        additionalNotes: body.additionalNotes,
      },
      update: {
        desiredRoles: body.desiredRoles,
        preferredLocations: body.preferredLocations,
        remotePreference: body.remotePreference,
        salaryExpectation: body.salaryExpectation,
        skills: body.skills,
        experience: body.experience,
        education: body.education,
        industries: body.industries,
        companySize: body.companySize,
        dealBreakers: body.dealBreakers,
        additionalNotes: body.additionalNotes,
      },
    })

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

