import * as cheerio from 'cheerio'
import { gemini } from './gemini'

export interface ScrapedJob {
  title: string
  company: string
  location: string
  type: string
  salary?: string
  description: string
  url: string
  source: string
}

// Scrape a careers page and extract job listings using AI
export async function scrapeJobsFromUrl(url: string): Promise<ScrapedJob[]> {
  try {
    console.log(`Scraping: ${url}`)
    
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`)
      return []
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    
    // Remove scripts, styles, and other non-content elements
    $('script, style, nav, footer, header, aside, iframe, noscript').remove()
    
    // Extract main content
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim()
    
    // Get all links that might be job postings
    const links: { text: string; href: string }[] = []
    $('a').each((_, el) => {
      const href = $(el).attr('href')
      const text = $(el).text().trim()
      if (href && text && text.length > 5 && text.length < 200) {
        // Make absolute URL
        let absoluteUrl = href
        if (href.startsWith('/')) {
          const urlObj = new URL(url)
          absoluteUrl = `${urlObj.origin}${href}`
        } else if (!href.startsWith('http')) {
          absoluteUrl = new URL(href, url).toString()
        }
        links.push({ text, href: absoluteUrl })
      }
    })

    // Get the domain for source name
    const domain = new URL(url).hostname.replace('www.', '')
    
    // Use AI to extract job listings
    const jobs = await extractJobsWithAI(bodyText, links, domain, url)
    
    return jobs
  } catch (error) {
    console.error(`Error scraping ${url}:`, error)
    return []
  }
}

async function extractJobsWithAI(
  pageText: string, 
  links: { text: string; href: string }[],
  source: string,
  sourceUrl: string
): Promise<ScrapedJob[]> {
  // Truncate text to avoid token limits
  const truncatedText = pageText.substring(0, 8000)
  const truncatedLinks = links.slice(0, 50)

  const prompt = `You are a job listing extractor. Analyze this career page content and extract job listings.

PAGE CONTENT (truncated):
${truncatedText}

LINKS ON PAGE:
${truncatedLinks.map(l => `- "${l.text}" -> ${l.href}`).join('\n')}

Extract up to 10 job listings from this page. For each job, provide:
- title: The job title
- company: Company name (extract from page or use domain name)
- location: Location if mentioned, otherwise "Not specified"
- type: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE, or REMOTE
- salary: Salary if mentioned, otherwise null
- description: Brief job description (1-2 sentences) if available
- url: The most likely URL for this specific job posting from the links provided

If this doesn't appear to be a careers/jobs page, return an empty array.

Return ONLY a valid JSON array, no markdown, no explanation. Example:
[{"title":"Software Engineer","company":"Acme Inc","location":"Remote","type":"REMOTE","salary":null,"description":"Build amazing products","url":"https://example.com/jobs/123"}]`

  try {
    const result = await gemini.generateContent(prompt)
    const response = result.response.text()
    
    // Clean up response
    let cleanJson = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    
    const jobs = JSON.parse(cleanJson)
    
    // Add source to each job
    return jobs.map((job: any) => ({
      ...job,
      source,
      url: job.url || sourceUrl,
    }))
  } catch (error) {
    console.error('AI extraction failed:', error)
    return []
  }
}

// Scrape multiple URLs
export async function scrapeMultipleUrls(urls: string[]): Promise<ScrapedJob[]> {
  const allJobs: ScrapedJob[] = []
  
  // Process URLs sequentially to be respectful to servers
  for (const url of urls) {
    if (!url.trim()) continue
    
    try {
      const jobs = await scrapeJobsFromUrl(url.trim())
      allJobs.push(...jobs)
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error)
    }
  }
  
  return allJobs
}

