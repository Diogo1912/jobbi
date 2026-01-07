import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchAllJobs, filterJobsByPreferences, RawJob } from '@/lib/jobSources'
import { scrapeMultipleUrls } from '@/lib/scraper'

export async function POST() {
  try {
    // Get user settings
    const settings = await prisma.settings.findUnique({
      where: { id: 'user-settings' }
    })

    // Collect jobs from all sources
    const allJobs: RawJob[] = []

    // 1. Fetch from free APIs
    console.log('Fetching jobs from free APIs...')
    const apiJobs = await fetchAllJobs()
    allJobs.push(...apiJobs)
    console.log(`Found ${apiJobs.length} jobs from APIs`)

    // 2. Scrape custom URLs if configured
    if (settings?.scrapeUrls) {
      const urls = settings.scrapeUrls.split('\n').filter(url => url.trim())
      if (urls.length > 0) {
        console.log(`Scraping ${urls.length} custom URLs...`)
        const scrapedJobs = await scrapeMultipleUrls(urls)
        
        // Convert scraped jobs to RawJob format
        const formattedScrapedJobs: RawJob[] = scrapedJobs.map(job => ({
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          salary: job.salary || undefined,
          description: job.description,
          url: job.url,
          source: job.source,
        }))
        
        allJobs.push(...formattedScrapedJobs)
        console.log(`Found ${scrapedJobs.length} jobs from scraping`)
      }
    }

    if (allJobs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No jobs found. Try adding more sources in Settings.' },
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

    // Take top 50 jobs
    const jobsToSave = (filteredJobs.length > 0 ? filteredJobs : allJobs).slice(0, 50)

    console.log(`Attempting to save ${jobsToSave.length} jobs...`)

    // Get existing job URLs to avoid duplicates (application-level deduplication)
    const existingJobs = await prisma.job.findMany({
      select: { url: true, title: true, company: true }
    })
    
    // Create a set of existing job identifiers (url or title+company combo)
    const existingSet = new Set<string>()
    existingJobs.forEach(j => {
      existingSet.add(j.url)
      existingSet.add(`${j.title}:::${j.company}`.toLowerCase())
    })

    // Filter out duplicates
    const newJobs = jobsToSave.filter(job => {
      const urlExists = existingSet.has(job.url)
      const titleCompanyExists = existingSet.has(`${job.title}:::${job.company}`.toLowerCase())
      return !urlExists && !titleCompanyExists
    })
    
    console.log(`${newJobs.length} new jobs after deduplication`)

    if (newJobs.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          jobsFound: 0,
          message: 'No new jobs found. All jobs already exist in your feed.',
        }
      })
    }

    // Store new jobs in database
    const createdJobs = await prisma.job.createMany({
      data: newJobs.map(job => ({
        title: job.title,
        company: job.company,
        location: job.location || null,
        type: mapJobType(job.type),
        salary: job.salary || null,
        description: job.description,
        url: job.url,
        source: job.source,
        postedAt: job.postedAt || new Date(),
      })),
      skipDuplicates: true,
    })

    // Log the search
    await prisma.searchLog.create({
      data: {
        query: `APIs + ${settings?.scrapeUrls ? 'Custom URLs' : 'No custom URLs'}`,
        jobsFound: createdJobs.count,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        jobsFound: createdJobs.count,
        totalScanned: allJobs.length,
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
  const upperType = (type || '').toUpperCase()
  if (upperType.includes('REMOTE')) return 'REMOTE'
  if (upperType.includes('PART')) return 'PART_TIME'
  if (upperType.includes('CONTRACT')) return 'CONTRACT'
  if (upperType.includes('INTERN')) return 'INTERNSHIP'
  if (upperType.includes('FREELANCE')) return 'FREELANCE'
  return 'FULL_TIME'
}
