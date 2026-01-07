import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI features will not work.')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Use gemini-2.0-flash which is the latest model
export const gemini = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

export interface JobSearchResult {
  title: string
  company: string
  location?: string
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE' | 'REMOTE'
  salary?: string
  description: string
  url: string
  source?: string
}

export async function generateJobSearch(preferences: {
  desiredRoles?: string | null
  preferredLocations?: string | null
  remotePreference?: string | null
  salaryExpectation?: string | null
  skills?: string | null
  experience?: string | null
  industries?: string | null
  companySize?: string | null
  dealBreakers?: string | null
  additionalNotes?: string | null
}): Promise<JobSearchResult[]> {
  const prompt = `You are Jobbi, an AI job search assistant. Based on the user's preferences below, generate a list of 10 realistic job listings that would match their criteria.

USER PREFERENCES:
- Desired Roles: ${preferences.desiredRoles || 'Not specified'}
- Preferred Locations: ${preferences.preferredLocations || 'Not specified'}
- Remote Preference: ${preferences.remotePreference || 'Not specified'}
- Salary Expectation: ${preferences.salaryExpectation || 'Not specified'}
- Skills: ${preferences.skills || 'Not specified'}
- Experience: ${preferences.experience || 'Not specified'}
- Industries of Interest: ${preferences.industries || 'Not specified'}
- Company Size Preference: ${preferences.companySize || 'Not specified'}
- Deal Breakers: ${preferences.dealBreakers || 'None specified'}
- Additional Notes: ${preferences.additionalNotes || 'None'}

Generate 10 diverse job listings in JSON format. Include a mix of companies (real company names are fine) and make the listings feel authentic. Each job should have:
- title: Job title
- company: Company name
- location: City, State or Country (or "Remote")
- type: One of FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE, REMOTE
- salary: Salary range (e.g., "$80,000 - $120,000/year")
- description: A compelling 2-3 sentence job description
- url: A realistic job board URL (use linkedin.com/jobs/view/[random-id], indeed.com/viewjob?jk=[random-id], or the company's career page)
- source: Where the job was found (LinkedIn, Indeed, Company Website, etc.)

Return ONLY valid JSON array, no markdown formatting or explanations.`

  try {
    const result = await gemini.generateContent(prompt)
    const response = result.response.text()
    
    // Clean up the response - remove markdown code blocks if present
    let cleanJson = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    
    const jobs: JobSearchResult[] = JSON.parse(cleanJson)
    return jobs
  } catch (error) {
    console.error('Failed to generate job search:', error)
    return []
  }
}

export async function analyzeJobFit(
  jobDescription: string,
  userProfile: string
): Promise<{ score: number; analysis: string }> {
  const prompt = `Analyze how well this job matches the candidate's profile.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE PROFILE:
${userProfile}

Provide a JSON response with:
- score: A number from 0-100 indicating match percentage
- analysis: A brief 2-3 sentence analysis of the fit

Return ONLY valid JSON, no markdown.`

  try {
    const result = await gemini.generateContent(prompt)
    const response = result.response.text()
    const cleanJson = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleanJson)
  } catch (error) {
    console.error('Failed to analyze job fit:', error)
    return { score: 0, analysis: 'Unable to analyze job fit.' }
  }
}
