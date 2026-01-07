import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchAllJobs, filterJobsByPreferences, RawJob } from '@/lib/jobSources'

export async function POST() {
  try {
    // Get user settings
    const settings = await prisma.settings.findUnique({
      where: { id: 'user-settings' }
    })

    // Fetch jobs from all free sources
    console.log('Fetching jobs from free APIs...')
    const allJobs = await fetchAllJobs()
    
    if (allJobs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No jobs found from sources. Please try again later.' },
        { status: 400 }
      )
    }

    // Filter based on user preferences
    const filteredJobs = filterJobsByPreferences(allJobs, {
      desiredRoles: settings?.desiredRoles,
      preferredLocations: settings?.preferredLocations,
      skills: settings?.skills,
      industries: settings?.industries,
    })

    // Take top 30 jobs
    const jobsToSave = (filteredJobs.length > 0 ? filteredJobs : allJobs).slice(0, 30)

    console.log(`Saving ${jobsToSave.length} jobs to database...`)

    // Store jobs in database
    const createdJobs = await Promise.all(
      jobsToSave.map(job => 
        prisma.job.create({
          data: {
            title: job.title,
            company: job.company,
            location: job.location,
            type: mapJobType(job.type),
            salary: job.salary || null,
            description: job.description,
            url: job.url,
            source: job.source,
            postedAt: job.postedAt || new Date(),
          }
        })
      )
    )

    // Log the search
    await prisma.searchLog.create({
      data: {
        query: `Fetched from: Remotive, Arbeitnow, RemoteOK, Adzuna`,
        jobsFound: createdJobs.length,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        jobsFound: createdJobs.length,
        sources: ['Remotive', 'Arbeitnow', 'RemoteOK', 'Adzuna'],
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

function mapJobType(type: string): 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE' | 'REMOTE' {
  const upperType = type.toUpperCase()
  if (upperType.includes('REMOTE')) return 'REMOTE'
  if (upperType.includes('PART')) return 'PART_TIME'
  if (upperType.includes('CONTRACT')) return 'CONTRACT'
  if (upperType.includes('INTERN')) return 'INTERNSHIP'
  if (upperType.includes('FREELANCE')) return 'FREELANCE'
  return 'FULL_TIME'
}
