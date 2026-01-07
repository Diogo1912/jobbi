'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ExternalLink, 
  MoreVertical, 
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
  { value: 'SAVED', label: 'Saved', color: 'bg-status-saved' },
  { value: 'APPLIED', label: 'Applied', color: 'bg-status-applied' },
  { value: 'INTERVIEW', label: 'Interview', color: 'bg-status-interview' },
  { value: 'OFFER', label: 'Offer', color: 'bg-yellow-500' },
  { value: 'ACCEPTED', label: 'Accepted', color: 'bg-status-accepted' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-status-rejected' },
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
          j.id === trackedJobId 
            ? { ...j, status: newStatus }
            : j
        ))
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
    setOpenDropdown(null)
  }

  const deleteTracking = async (trackedJobId: string) => {
    try {
      const response = await fetch(`/api/tracking/${trackedJobId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setJobs(jobs.filter(j => j.id !== trackedJobId))
      }
    } catch (error) {
      console.error('Failed to delete tracking:', error)
    }
  }

  const getStatusDisplay = (status: JobStatus) => {
    const option = statusOptions.find(s => s.value === status)
    return option || statusOptions[0]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-steel-50 border-b border-steel-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-jobbi-slate">
                Job
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-jobbi-slate">
                Company
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-jobbi-slate">
                Status
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-jobbi-slate">
                Updated
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-jobbi-slate">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-100">
            {jobs.map((tracked, index) => {
              const statusDisplay = getStatusDisplay(tracked.status)
              
              return (
                <motion.tr
                  key={tracked.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-steel-50/50 transition-colors"
                >
                  {/* Job Title */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-steel-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-steel-400" />
                      </div>
                      <div>
                        <p className="font-medium text-jobbi-dark line-clamp-1">
                          {tracked.job.title}
                        </p>
                        <p className="text-sm text-steel-500">
                          {tracked.job.location || 'Remote'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="px-6 py-4">
                    <span className="text-steel-600">{tracked.job.company}</span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(
                          openDropdown === tracked.id ? null : tracked.id
                        )}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-steel-100 transition-colors"
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${statusDisplay.color}`} />
                        <span className="text-sm font-medium">{statusDisplay.label}</span>
                        <ChevronDown className="w-4 h-4 text-steel-400" />
                      </button>

                      {openDropdown === tracked.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDropdown(null)}
                          />
                          <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-steel-200 py-2 z-20">
                            {statusOptions.map(option => (
                              <button
                                key={option.value}
                                onClick={() => updateStatus(tracked.id, option.value)}
                                className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-steel-50 transition-colors ${
                                  tracked.status === option.value ? 'bg-steel-50' : ''
                                }`}
                              >
                                <span className={`w-2.5 h-2.5 rounded-full ${option.color}`} />
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Updated Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-steel-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(tracked.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={tracked.job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-steel-400 hover:text-accent hover:bg-accent/10 transition-colors"
                        title="View job posting"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => deleteTracking(tracked.id)}
                        className="p-2 rounded-lg text-steel-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove from tracker"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

