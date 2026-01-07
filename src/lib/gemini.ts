import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI features will not work.')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Use gemini-2.0-flash - fast and capable
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

// Use Gemini to enhance job descriptions or provide AI suggestions
export async function enhanceJobWithAI(job: {
  title: string
  company: string
  description: string
}): Promise<string> {
  const prompt = `Summarize this job in 2 concise sentences highlighting the key requirements and benefits:

Title: ${job.title}
Company: ${job.company}
Description: ${job.description}

Return only the summary, no formatting.`

  try {
    const result = await gemini.generateContent(prompt)
    return result.response.text().trim()
  } catch (error) {
    console.error('Failed to enhance job:', error)
    return job.description
  }
}
