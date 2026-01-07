import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateJobSearch } from '@/lib/gemini'

export async function POST() {
  try {
    // Get user settings
    const settings = await prisma.settings.findUnique({
      where: { id: 'user-settings' }
    })

    // Generate jobs using Gemini
    const jobs = await generateJobSearch({
      desiredRoles: settings?.desiredRoles,
      preferredLocations: settings?.preferredLocations,
      remotePreference: settings?.remotePreference,
      salaryExpectation: settings?.salaryExpectation,
      skills: settings?.skills,
      experience: settings?.experience,
      industries: settings?.industries,
      companySize: settings?.companySize,
      dealBreakers: settings?.dealBreakers,
      additionalNotes: settings?.additionalNotes,
    })

    if (jobs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No jobs found. Please check your settings and try again.' },
        { status: 400 }
      )
    }

    // Store jobs in database
    const createdJobs = await Promise.all(
      jobs.map(job => 
        prisma.job.create({
          data: {
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            salary: job.salary,
            description: job.description,
            url: job.url,
            source: job.source,
            postedAt: new Date(),
          }
        })
      )
    )

    // Log the search
    await prisma.searchLog.create({
      data: {
        query: `Auto-search based on user preferences`,
        jobsFound: createdJobs.length,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        jobsFound: createdJobs.length,
        jobs: createdJobs,
      }
    })
  } catch (error) {
    console.error('Job search failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search for jobs' },
      { status: 500 }
    )
  }
}

