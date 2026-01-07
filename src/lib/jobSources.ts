// Free job APIs that don't require authentication

export interface RawJob {
  title: string
  company: string
  location: string
  type: string
  salary?: string
  description: string
  url: string
  source: string
  postedAt?: Date
}

// Remotive API - Remote jobs
async function fetchRemotiveJobs(): Promise<RawJob[]> {
  try {
    const response = await fetch('https://remotive.com/api/remote-jobs?limit=20', {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    return data.jobs?.map((job: any) => ({
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || 'Remote',
      type: 'REMOTE',
      salary: job.salary || null,
      description: stripHtml(job.description).substring(0, 500),
      url: job.url,
      source: 'Remotive',
      postedAt: job.publication_date ? new Date(job.publication_date) : null,
    })) || []
  } catch (error) {
    console.error('Remotive API error:', error)
    return []
  }
}

// Arbeitnow API - Europe + Remote jobs
async function fetchArbeitnowJobs(): Promise<RawJob[]> {
  try {
    const response = await fetch('https://arbeitnow.com/api/job-board-api', {
      next: { revalidate: 3600 }
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    return data.data?.slice(0, 20).map((job: any) => ({
      title: job.title,
      company: job.company_name,
      location: job.location || (job.remote ? 'Remote' : 'Europe'),
      type: job.remote ? 'REMOTE' : 'FULL_TIME',
      salary: null,
      description: stripHtml(job.description).substring(0, 500),
      url: job.url,
      source: 'Arbeitnow',
      postedAt: job.created_at ? new Date(job.created_at * 1000) : null,
    })) || []
  } catch (error) {
    console.error('Arbeitnow API error:', error)
    return []
  }
}

// RemoteOK API - Remote tech jobs
async function fetchRemoteOKJobs(): Promise<RawJob[]> {
  try {
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Jobbi Job Search App'
      },
      next: { revalidate: 3600 }
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    // First item is metadata, skip it
    return data.slice(1, 21).map((job: any) => ({
      title: job.position,
      company: job.company,
      location: job.location || 'Remote',
      type: 'REMOTE',
      salary: job.salary_min && job.salary_max 
        ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
        : null,
      description: stripHtml(job.description || '').substring(0, 500),
      url: job.url || `https://remoteok.com/l/${job.id}`,
      source: 'RemoteOK',
      postedAt: job.date ? new Date(job.date) : null,
    })) || []
  } catch (error) {
    console.error('RemoteOK API error:', error)
    return []
  }
}

// Adzuna RSS (UK jobs) - No API key needed for RSS
async function fetchAdzunaRSS(): Promise<RawJob[]> {
  try {
    // Adzuna provides RSS feeds for job searches
    const response = await fetch('https://www.adzuna.co.uk/jobs/rss?q=developer', {
      next: { revalidate: 3600 }
    })
    
    if (!response.ok) return []
    
    const xml = await response.text()
    const jobs: RawJob[] = []
    
    // Simple XML parsing for RSS items
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    
    while ((match = itemRegex.exec(xml)) !== null && jobs.length < 10) {
      const item = match[1]
      const title = extractTag(item, 'title')
      const link = extractTag(item, 'link')
      const description = extractTag(item, 'description')
      const company = extractTag(item, 'source') || 'Unknown'
      
      if (title && link) {
        jobs.push({
          title: decodeHtmlEntities(title),
          company: decodeHtmlEntities(company),
          location: 'UK',
          type: 'FULL_TIME',
          description: stripHtml(decodeHtmlEntities(description || '')).substring(0, 500),
          url: link,
          source: 'Adzuna',
        })
      }
    }
    
    return jobs
  } catch (error) {
    console.error('Adzuna RSS error:', error)
    return []
  }
}

// Helper to strip HTML tags
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Helper to extract XML tag content
function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))
  return match ? (match[1] || match[2] || '').trim() : ''
}

// Helper to decode HTML entities
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

// Fetch from all sources and combine
export async function fetchAllJobs(): Promise<RawJob[]> {
  const [remotive, arbeitnow, remoteok, adzuna] = await Promise.all([
    fetchRemotiveJobs(),
    fetchArbeitnowJobs(),
    fetchRemoteOKJobs(),
    fetchAdzunaRSS(),
  ])

  console.log(`Fetched jobs: Remotive=${remotive.length}, Arbeitnow=${arbeitnow.length}, RemoteOK=${remoteok.length}, Adzuna=${adzuna.length}`)

  // Combine and shuffle
  const allJobs = [...remotive, ...arbeitnow, ...remoteok, ...adzuna]
  
  // Shuffle array
  for (let i = allJobs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allJobs[i], allJobs[j]] = [allJobs[j], allJobs[i]]
  }

  return allJobs
}

// Filter jobs based on user preferences using simple keyword matching
export function filterJobsByPreferences(
  jobs: RawJob[],
  preferences: {
    desiredRoles?: string | null
    preferredLocations?: string | null
    skills?: string | null
    industries?: string | null
  }
): RawJob[] {
  const roleKeywords = (preferences.desiredRoles || '').toLowerCase().split(/[,\s]+/).filter(Boolean)
  const locationKeywords = (preferences.preferredLocations || '').toLowerCase().split(/[,\s]+/).filter(Boolean)
  const skillKeywords = (preferences.skills || '').toLowerCase().split(/[,\s]+/).filter(Boolean)
  
  if (roleKeywords.length === 0 && locationKeywords.length === 0 && skillKeywords.length === 0) {
    // No preferences set, return all jobs
    return jobs
  }

  return jobs.filter(job => {
    const jobText = `${job.title} ${job.description} ${job.company}`.toLowerCase()
    const jobLocation = job.location.toLowerCase()
    
    // Check if any role keyword matches
    const roleMatch = roleKeywords.length === 0 || roleKeywords.some(kw => jobText.includes(kw))
    
    // Check location (be lenient - 'remote' matches everything if user wants remote)
    const locationMatch = locationKeywords.length === 0 || 
      locationKeywords.some(kw => jobLocation.includes(kw) || kw === 'remote' && job.type === 'REMOTE')
    
    // Check skills
    const skillMatch = skillKeywords.length === 0 || skillKeywords.some(kw => jobText.includes(kw))
    
    return roleMatch || skillMatch // At least one should match
  })
}

