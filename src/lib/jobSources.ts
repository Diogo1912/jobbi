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
    const response = await fetch('https://remotive.com/api/remote-jobs?limit=50', {
      next: { revalidate: 3600 }
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
    
    return data.data?.slice(0, 50).map((job: any) => ({
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
    
    return data.slice(1, 51).map((job: any) => ({
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

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Fetch from all sources and combine
export async function fetchAllJobs(): Promise<RawJob[]> {
  const [remotive, arbeitnow, remoteok] = await Promise.all([
    fetchRemotiveJobs(),
    fetchArbeitnowJobs(),
    fetchRemoteOKJobs(),
  ])

  console.log(`Fetched jobs: Remotive=${remotive.length}, Arbeitnow=${arbeitnow.length}, RemoteOK=${remoteok.length}`)

  return [...remotive, ...arbeitnow, ...remoteok]
}

// Improved job filtering with scoring
export function filterJobsByPreferences(
  jobs: RawJob[],
  preferences: {
    desiredRoles?: string | null
    preferredLocations?: string | null
    remotePreference?: string | null
    skills?: string | null
    industries?: string | null
    dealBreakers?: string | null
  }
): RawJob[] {
  // Extract keywords from preferences
  const roleKeywords = extractKeywords(preferences.desiredRoles)
  const locationKeywords = extractKeywords(preferences.preferredLocations)
  const skillKeywords = extractKeywords(preferences.skills)
  const industryKeywords = extractKeywords(preferences.industries)
  const dealBreakers = extractKeywords(preferences.dealBreakers)
  
  // Check if user wants remote
  const wantsRemote = (preferences.remotePreference || '').toLowerCase().includes('remote')
  
  // If no preferences, return all jobs
  if (roleKeywords.length === 0 && skillKeywords.length === 0 && industryKeywords.length === 0) {
    console.log('No preferences set, returning all jobs')
    return jobs
  }

  // Score each job
  const scoredJobs = jobs.map(job => {
    const jobText = `${job.title} ${job.description} ${job.company}`.toLowerCase()
    const jobTitle = job.title.toLowerCase()
    const jobLocation = job.location.toLowerCase()
    
    let score = 0
    let matchDetails: string[] = []

    // Role matching (highest weight - 40 points)
    if (roleKeywords.length > 0) {
      const roleMatches = roleKeywords.filter(kw => {
        // Title match is worth more
        if (jobTitle.includes(kw)) return true
        // Description match
        if (jobText.includes(kw)) return true
        return false
      })
      
      if (roleMatches.length > 0) {
        // Title matches worth more
        const titleMatches = roleMatches.filter(kw => jobTitle.includes(kw))
        score += titleMatches.length * 20 // 20 points per title match
        score += (roleMatches.length - titleMatches.length) * 5 // 5 points per description match
        matchDetails.push(`roles: ${roleMatches.join(', ')}`)
      }
    }

    // Skills matching (30 points)
    if (skillKeywords.length > 0) {
      const skillMatches = skillKeywords.filter(kw => jobText.includes(kw))
      if (skillMatches.length > 0) {
        score += Math.min(skillMatches.length * 10, 30)
        matchDetails.push(`skills: ${skillMatches.join(', ')}`)
      }
    }

    // Location matching (15 points)
    if (locationKeywords.length > 0) {
      const locationMatch = locationKeywords.some(kw => jobLocation.includes(kw))
      if (locationMatch) {
        score += 15
        matchDetails.push('location match')
      }
    }
    
    // Remote preference (15 points)
    if (wantsRemote && (job.type === 'REMOTE' || jobLocation.includes('remote'))) {
      score += 15
      matchDetails.push('remote')
    }

    // Industry matching (10 points)
    if (industryKeywords.length > 0) {
      const industryMatch = industryKeywords.some(kw => jobText.includes(kw))
      if (industryMatch) {
        score += 10
        matchDetails.push('industry match')
      }
    }

    // Deal breakers (negative score)
    if (dealBreakers.length > 0) {
      const hasDealBreaker = dealBreakers.some(kw => jobText.includes(kw))
      if (hasDealBreaker) {
        score -= 100 // Heavily penalize
        matchDetails.push('DEAL BREAKER')
      }
    }

    return { job, score, matchDetails }
  })

  // Filter out jobs with score <= 0 and sort by score
  const filteredJobs = scoredJobs
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
  
  console.log(`Filtering: ${jobs.length} jobs -> ${filteredJobs.length} matching jobs`)
  
  // Log top matches for debugging
  filteredJobs.slice(0, 5).forEach(({ job, score, matchDetails }) => {
    console.log(`  [${score}] ${job.title} at ${job.company} - ${matchDetails.join(', ')}`)
  })

  return filteredJobs.map(({ job }) => job)
}

// Extract meaningful keywords from preference string
function extractKeywords(text: string | null | undefined): string[] {
  if (!text) return []
  
  // Common words to ignore
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her',
    'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'this',
    'that', 'these', 'those', 'am', 'no', 'not', 'any', 'some', 'all',
    'etc', 'like', 'such', 'want', 'looking', 'prefer', 'preferably',
    'ideally', 'experience', 'years', 'work', 'job', 'role', 'position'
  ])

  // Split by common delimiters and clean up
  const words = text
    .toLowerCase()
    .replace(/[,;\/\-\(\)]/g, ' ') // Replace delimiters with spaces
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length >= 2 && !stopWords.has(w))
  
  // Also extract multi-word phrases (e.g., "software engineer", "full stack")
  const phrases: string[] = []
  const commonPhrases = [
    'software engineer', 'frontend developer', 'backend developer', 'full stack',
    'fullstack', 'data scientist', 'data engineer', 'machine learning', 'ml engineer',
    'product manager', 'project manager', 'ux designer', 'ui designer', 'devops',
    'site reliability', 'sre', 'qa engineer', 'quality assurance', 'mobile developer',
    'ios developer', 'android developer', 'react developer', 'node developer',
    'python developer', 'java developer', 'golang', 'rust developer', 'cloud engineer',
    'solutions architect', 'technical lead', 'tech lead', 'engineering manager',
    'senior engineer', 'junior developer', 'entry level', 'mid level', 'senior level'
  ]
  
  const lowerText = text.toLowerCase()
  commonPhrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      phrases.push(phrase)
    }
  })
  
  // Combine individual words and phrases, remove duplicates
  const allKeywords = [...new Set([...words, ...phrases])]
  
  return allKeywords
}
