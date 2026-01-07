import { prisma } from '@/lib/prisma'
import { TrackerHeader } from '@/components/tracker/TrackerHeader'
import { TrackerTable } from '@/components/tracker/TrackerTable'
import { EmptyTracker } from '@/components/tracker/EmptyTracker'

export const dynamic = 'force-dynamic'

export default async function TrackerPage() {
  let trackedJobs: any[] = []
  
  try {
    trackedJobs = await prisma.trackedJob.findMany({
      include: {
        job: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
  } catch (error) {
    console.error('Failed to fetch tracked jobs:', error)
  }

  const stats = {
    total: trackedJobs.length,
    saved: trackedJobs.filter(j => j.status === 'SAVED').length,
    applied: trackedJobs.filter(j => j.status === 'APPLIED').length,
    interview: trackedJobs.filter(j => j.status === 'INTERVIEW').length,
    offers: trackedJobs.filter(j => j.status === 'OFFER').length,
  }

  return (
    <div className="min-h-screen bg-steel-50">
      <TrackerHeader stats={stats} />
      
      <div className="max-w-5xl mx-auto px-4 py-4">
        {trackedJobs.length === 0 ? (
          <EmptyTracker />
        ) : (
          <TrackerTable trackedJobs={trackedJobs} />
        )}
      </div>
    </div>
  )
}
