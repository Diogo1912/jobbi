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
  Briefcase,
  Sparkles
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
  FULL_TIME: 'bg-blue-100 text-blue-600',
  PART_TIME: 'bg-purple-100 text-purple-600',
  CONTRACT: 'bg-amber-100 text-amber-600',
  INTERNSHIP: 'bg-emerald-100 text-emerald-600',
  FREELANCE: 'bg-pink-100 text-pink-600',
  REMOTE: 'bg-teal-100 text-teal-600',
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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', bounce: 0.3 }}
      className="card-hover p-7 relative overflow-visible"
    >
      {/* Decorative corner bubble */}
      <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-jobbi-50 to-blue-100 rounded-full opacity-60 blur-xl" />
      
      {/* Header */}
      <div className="relative flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-5">
          {/* Company Logo Placeholder */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-jobbi-50 to-jobbi-light/30 flex items-center justify-center flex-shrink-0 shadow-inner">
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={job.company}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <Building2 className="w-7 h-7 text-jobbi-muted" />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-jobbi-dark line-clamp-1 mb-1">
              {job.title}
            </h3>
            <p className="text-jobbi-muted font-semibold">{job.company}</p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`
            p-3.5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md
            ${isSaved 
              ? 'bg-gradient-to-br from-accent/20 to-accent/10 text-accent hover:scale-110' 
              : 'bg-jobbi-50 text-jobbi-muted hover:bg-jobbi-light/30 hover:text-jobbi-navy hover:scale-110'
            }
            disabled:opacity-50 active:scale-95
          `}
          aria-label={isSaved ? 'Remove from saved' : 'Save job'}
        >
          {isSaved ? (
            <BookmarkCheck className="w-6 h-6" />
          ) : (
            <Bookmark className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2.5 mb-5">
        <span className={`badge ${jobTypeColors[job.type]}`}>
          <Briefcase className="w-3.5 h-3.5 mr-1.5" />
          {jobTypeLabels[job.type]}
        </span>
        
        {job.location && (
          <span className="badge bg-jobbi-50 text-jobbi-navy">
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            {job.location}
          </span>
        )}
        
        {job.salary && (
          <span className="badge bg-emerald-50 text-emerald-600">
            <DollarSign className="w-3.5 h-3.5 mr-1.5" />
            {job.salary}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-steel-600 leading-relaxed line-clamp-3 mb-5">
        {job.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-5 border-t-2 border-jobbi-50">
        <div className="flex items-center gap-2 text-sm text-jobbi-muted font-medium">
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
              <span className="mx-2 text-jobbi-light">•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {job.source}
              </span>
            </>
          )}
        </div>

        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm py-2.5 px-5"
        >
          View Job
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.article>
  )
}
