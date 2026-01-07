import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI features will not work.')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Use gemini-1.5-pro - stable and widely available
export const gemini = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

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
  const prompt = `You are Jobbi, an AI job search assistant. Based on the user's preferences, generate 10 REALISTIC job listings that match their criteria.

USER PREFERENCES:
- Desired Roles: ${preferences.desiredRoles || 'Software Engineer, Developer, Tech roles'}
- Preferred Locations: ${preferences.preferredLocations || 'Remote, USA, Europe'}
- Remote Preference: ${preferences.remotePreference || 'Remote friendly'}
- Salary Expectation: ${preferences.salaryExpectation || 'Competitive'}
- Skills: ${preferences.skills || 'Programming, Problem solving'}
- Experience: ${preferences.experience || 'Mid-level'}
- Industries of Interest: ${preferences.industries || 'Technology, Software'}
- Company Size Preference: ${preferences.companySize || 'Any'}
- Deal Breakers: ${preferences.dealBreakers || 'None specified'}
- Additional Notes: ${preferences.additionalNotes || 'None'}

IMPORTANT REQUIREMENTS:
1. Use REAL companies that are known to hire for these roles (Google, Meta, Microsoft, Amazon, Apple, Netflix, Stripe, Airbnb, Uber, Spotify, Salesforce, Adobe, Oracle, IBM, Cisco, VMware, Shopify, Atlassian, Twilio, Datadog, Snowflake, etc.)
2. Generate REALISTIC job titles that these companies actually use
3. For URLs, use the company's ACTUAL careers page format:
   - Google: careers.google.com/jobs/results/
   - Meta: metacareers.com/jobs/
   - Microsoft: careers.microsoft.com/
   - Amazon: amazon.jobs/en/jobs/
   - Apple: jobs.apple.com/
   - Netflix: jobs.netflix.com/
   - Stripe: stripe.com/jobs/
   - Airbnb: careers.airbnb.com/
   - Spotify: lifeatspotify.com/jobs
   - Salesforce: salesforce.com/company/careers/
   - For other companies: use linkedin.com/jobs/view/ with a realistic ID
4. Salary ranges should be realistic for the role and location
5. Descriptions should be 2-3 sentences highlighting key responsibilities and requirements

Return ONLY a valid JSON array with these fields for each job:
- title (string): Realistic job title
- company (string): Real company name
- location (string): City, State/Country or "Remote"
- type (string): One of FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE, REMOTE
- salary (string): Realistic salary range like "$120,000 - $180,000/year"
- description (string): 2-3 sentence job description
- url (string): Real company careers page URL
- source (string): "Company Website" or "LinkedIn"

Return ONLY the JSON array, no markdown, no explanation.`

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
