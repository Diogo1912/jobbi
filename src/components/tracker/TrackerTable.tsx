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
  { value: 'ACCEPTED', label: 'Accepted', color: 'bg-emerald-500' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-rose-500' },
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
      transition={{ type: 'spring', bounce: 0.3 }}
      className="card overflow-hidden border-2 border-jobbi-50"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-jobbi-50 to-blue-50 border-b-2 border-jobbi-100">
            <tr>
              <th className="text-left px-7 py-5 text-sm font-bold text-jobbi-navy">
                Job
              </th>
              <th className="text-left px-7 py-5 text-sm font-bold text-jobbi-navy">
                Company
              </th>
              <th className="text-left px-7 py-5 text-sm font-bold text-jobbi-navy">
                Status
              </th>
              <th className="text-left px-7 py-5 text-sm font-bold text-jobbi-navy">
                Updated
              </th>
              <th className="text-right px-7 py-5 text-sm font-bold text-jobbi-navy">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-jobbi-50">
            {jobs.map((tracked, index) => {
              const statusDisplay = getStatusDisplay(tracked.status)
              
              return (
                <motion.tr
                  key={tracked.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, type: 'spring' }}
                  className="hover:bg-jobbi-50/50 transition-colors"
                >
                  {/* Job Title */}
                  <td className="px-7 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-jobbi-50 to-jobbi-light/30 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-jobbi-muted" />
                      </div>
                      <div>
                        <p className="font-bold text-jobbi-dark line-clamp-1">
                          {tracked.job.title}
                        </p>
                        <p className="text-sm text-jobbi-muted font-medium">
                          {tracked.job.location || 'Remote'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="px-7 py-5">
                    <span className="text-jobbi-slate font-semibold">{tracked.job.company}</span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-7 py-5">
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(
                          openDropdown === tracked.id ? null : tracked.id
                        )}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-jobbi-50 transition-all duration-200"
                      >
                        <span className={`w-3 h-3 rounded-full ${statusDisplay.color}`} />
                        <span className="text-sm font-bold text-jobbi-dark">{statusDisplay.label}</span>
                        <ChevronDown className="w-4 h-4 text-jobbi-muted" />
                      </button>

                      {openDropdown === tracked.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDropdown(null)}
                          />
                          <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-2xl shadow-card border-2 border-jobbi-50 py-2 z-20 overflow-hidden">
                            {statusOptions.map(option => (
                              <button
                                key={option.value}
                                onClick={() => updateStatus(tracked.id, option.value)}
                                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold hover:bg-jobbi-50 transition-colors ${
                                  tracked.status === option.value ? 'bg-jobbi-50' : ''
                                }`}
                              >
                                <span className={`w-3 h-3 rounded-full ${option.color}`} />
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Updated Date */}
                  <td className="px-7 py-5">
                    <div className="flex items-center gap-2 text-sm text-jobbi-muted font-medium">
                      <Calendar className="w-4 h-4" />
                      {new Date(tracked.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-7 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={tracked.job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl text-jobbi-muted hover:text-jobbi-navy hover:bg-jobbi-50 transition-all duration-200 hover:scale-110"
                        title="View job posting"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => deleteTracking(tracked.id)}
                        className="p-3 rounded-xl text-jobbi-muted hover:text-rose-500 hover:bg-rose-50 transition-all duration-200 hover:scale-110"
                        title="Remove from tracker"
                      >
                        <Trash2 className="w-5 h-5" />
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
