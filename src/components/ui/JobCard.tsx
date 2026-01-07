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
  FULL_TIME: 'bg-blue-100 text-blue-700',
  PART_TIME: 'bg-purple-100 text-purple-700',
  CONTRACT: 'bg-amber-100 text-amber-700',
  INTERNSHIP: 'bg-green-100 text-green-700',
  FREELANCE: 'bg-pink-100 text-pink-700',
  REMOTE: 'bg-teal-100 text-teal-700',
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card-hover p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Company Logo Placeholder */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-steel-100 to-steel-200 flex items-center justify-center flex-shrink-0">
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={job.company}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <Building2 className="w-6 h-6 text-steel-400" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-jobbi-dark line-clamp-1">
              {job.title}
            </h3>
            <p className="text-steel-500 font-medium">{job.company}</p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`
            p-2.5 rounded-xl transition-all duration-200
            ${isSaved 
              ? 'bg-accent/10 text-accent hover:bg-accent/20' 
              : 'bg-steel-100 text-steel-400 hover:bg-steel-200 hover:text-jobbi-dark'
            }
            disabled:opacity-50
          `}
          aria-label={isSaved ? 'Remove from saved' : 'Save job'}
        >
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`badge ${jobTypeColors[job.type]}`}>
          <Briefcase className="w-3 h-3 mr-1" />
          {jobTypeLabels[job.type]}
        </span>
        
        {job.location && (
          <span className="badge bg-steel-100 text-steel-600">
            <MapPin className="w-3 h-3 mr-1" />
            {job.location}
          </span>
        )}
        
        {job.salary && (
          <span className="badge bg-green-50 text-green-700">
            <DollarSign className="w-3 h-3 mr-1" />
            {job.salary}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-steel-600 text-sm leading-relaxed line-clamp-3 mb-4">
        {job.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-steel-100">
        <div className="flex items-center gap-2 text-sm text-steel-400">
          <Clock className="w-4 h-4" />
          {job.postedAt 
            ? new Date(job.postedAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })
            : 'Recently posted'
          }
          {job.source && (
            <>
              <span className="mx-2">•</span>
              <span>{job.source}</span>
            </>
          )}
        </div>

        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm py-2"
        >
          View Job
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.article>
  )
}

