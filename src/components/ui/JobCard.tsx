'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Briefcase
} from 'lucide-react'
import { Job, JobType, TrackedJob } from '@prisma/client'

type JobWithTracking = Job & {
  tracking?: TrackedJob | null
}

interface JobCardProps {
  job: JobWithTracking
  index?: number
}

const jobTypeLabels: Record<JobType, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
  REMOTE: 'Remote',
}

const jobTypeColors: Record<JobType, string> = {
  FULL_TIME: 'bg-blue-50 text-blue-600',
  PART_TIME: 'bg-purple-50 text-purple-600',
  CONTRACT: 'bg-amber-50 text-amber-600',
  INTERNSHIP: 'bg-emerald-50 text-emerald-600',
  FREELANCE: 'bg-pink-50 text-pink-600',
  REMOTE: 'bg-teal-50 text-teal-600',
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(!!job.tracking)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (isSaved) {
        await fetch(`/api/tracking/${job.id}`, { method: 'DELETE' })
        setIsSaved(false)
      } else {
        await fetch('/api/tracking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId: job.id }),
        })
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Failed to save job:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="card-hover p-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-steel-100 flex items-center justify-center flex-shrink-0">
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={job.company}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Building2 className="w-5 h-5 text-steel-400" />
            )}
          </div>
          
          <div className="min-w-0">
            <h3 className="font-semibold text-jobbi-dark truncate">
              {job.title}
            </h3>
            <p className="text-sm text-steel-500">{job.company}</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
            isSaved 
              ? 'bg-accent/10 text-accent hover:bg-accent/20' 
              : 'bg-steel-100 text-steel-400 hover:bg-steel-200 hover:text-steel-600'
          } disabled:opacity-50`}
          aria-label={isSaved ? 'Remove from saved' : 'Save job'}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`badge ${jobTypeColors[job.type]}`}>
          {jobTypeLabels[job.type]}
        </span>
        
        {job.location && (
          <span className="badge bg-steel-100 text-steel-600">
            <MapPin className="w-3 h-3 mr-1" />
            {job.location}
          </span>
        )}
        
        {job.salary && (
          <span className="badge bg-green-50 text-green-600">
            {job.salary}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-steel-600 line-clamp-2 mb-3">
        {job.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-steel-100">
        <div className="flex items-center gap-1.5 text-xs text-steel-400">
          <Clock className="w-3 h-3" />
          {job.postedAt 
            ? new Date(job.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : 'Recently'
          }
          {job.source && (
            <>
              <span className="mx-1">·</span>
              <span>{job.source}</span>
            </>
          )}
        </div>

        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-xs py-1.5 px-3"
        >
          View Job
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.article>
  )
}
