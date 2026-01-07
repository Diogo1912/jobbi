import { prisma } from '@/lib/prisma'
import { JobCard } from '@/components/ui/JobCard'
import { FeedHeader } from '@/components/feed/FeedHeader'
import { EmptyFeed } from '@/components/feed/EmptyFeed'

export const dynamic = 'force-dynamic'

export default async function FeedPage() {
  let jobs: any[] = []
  
  try {
    jobs = await prisma.job.findMany({
      include: {
        tracking: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  } catch (error) {
    console.error('Failed to fetch jobs:', error)
    // Return empty array if database isn't available
  }

  return (
    <div className="min-h-screen bg-steel-50">
      <FeedHeader jobCount={jobs.length} />
      
      <div className="max-w-2xl mx-auto px-6 pb-12">
        {jobs.length === 0 ? (
          <EmptyFeed />
        ) : (
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
