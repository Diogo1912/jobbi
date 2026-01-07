'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ExternalLink, 
  Trash2,
  ChevronDown,
  Building2,
  Calendar
} from 'lucide-react'
import { TrackedJob, Job, JobStatus } from '@prisma/client'

type TrackedJobWithJob = TrackedJob & { job: Job }

interface TrackerTableProps {
  trackedJobs: TrackedJobWithJob[]
}

const statusOptions: { value: JobStatus; label: string; color: string }[] = [
  { value: 'SAVED', label: 'Saved', color: 'bg-blue-500' },
  { value: 'APPLIED', label: 'Applied', color: 'bg-accent' },
  { value: 'INTERVIEW', label: 'Interview', color: 'bg-purple-500' },
  { value: 'OFFER', label: 'Offer', color: 'bg-yellow-500' },
  { value: 'ACCEPTED', label: 'Accepted', color: 'bg-green-500' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-red-500' },
  { value: 'WITHDRAWN', label: 'Withdrawn', color: 'bg-steel-400' },
]

export function TrackerTable({ trackedJobs: initialJobs }: TrackerTableProps) {
  const [jobs, setJobs] = useState(initialJobs)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const updateStatus = async (trackedJobId: string, newStatus: JobStatus) => {
    try {
      const response = await fetch(`/api/tracking/${trackedJobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (response.ok) {
        setJobs(jobs.map(j => 
          j.id === trackedJobId ? { ...j, status: newStatus } : j
        ))
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
    setOpenDropdown(null)
  }

  const deleteTracking = async (trackedJobId: string) => {
    try {
      const response = await fetch(`/api/tracking/${trackedJobId}`, { method: 'DELETE' })
      if (response.ok) {
        setJobs(jobs.filter(j => j.id !== trackedJobId))
      }
    } catch (error) {
      console.error('Failed to delete tracking:', error)
    }
  }

  const getStatusDisplay = (status: JobStatus) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-steel-50 border-b border-steel-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider">Job</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider">Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider">Updated</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-100">
            {jobs.map((tracked) => {
              const statusDisplay = getStatusDisplay(tracked.status)
              
              return (
                <tr key={tracked.id} className="hover:bg-steel-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-steel-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-steel-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-jobbi-dark text-sm truncate max-w-[200px]">
                          {tracked.job.title}
                        </p>
                        <p className="text-xs text-steel-500">{tracked.job.location || 'Remote'}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-sm text-steel-600">{tracked.job.company}</span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === tracked.id ? null : tracked.id)}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-steel-100 transition-colors"
                      >
                        <span className={`w-2 h-2 rounded-full ${statusDisplay.color}`} />
                        <span className="text-sm">{statusDisplay.label}</span>
                        <ChevronDown className="w-3 h-3 text-steel-400" />
                      </button>

                      {openDropdown === tracked.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                          <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-lg shadow-card border border-steel-200 py-1 z-20">
                            {statusOptions.map(option => (
                              <button
                                key={option.value}
                                onClick={() => updateStatus(tracked.id, option.value)}
                                className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-steel-50 ${
                                  tracked.status === option.value ? 'bg-steel-50' : ''
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full ${option.color}`} />
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-xs text-steel-500">
                      {new Date(tracked.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={tracked.job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded text-steel-400 hover:text-jobbi-navy hover:bg-steel-100 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => deleteTracking(tracked.id)}
                        className="p-1.5 rounded text-steel-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
