import { Job, TrackedJob, JobStatus, JobType, Settings } from '@prisma/client'

// Re-export Prisma types for convenience
export type { Job, TrackedJob, JobStatus, JobType, Settings }

// Extended types
export type JobWithTracking = Job & {
  tracking?: TrackedJob | null
}

export type TrackedJobWithJob = TrackedJob & {
  job: Job
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Form types
export interface SettingsFormData {
  desiredRoles: string
  preferredLocations: string
  remotePreference: string
  salaryExpectation: string
  skills: string
  experience: string
  education: string
  industries: string
  companySize: string
  dealBreakers: string
  additionalNotes: string
}

// Status display helpers
export const statusLabels: Record<JobStatus, string> = {
  SAVED: 'Saved',
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
}

export const statusColors: Record<JobStatus, string> = {
  SAVED: 'bg-status-saved',
  APPLIED: 'bg-status-applied',
  INTERVIEW: 'bg-status-interview',
  OFFER: 'bg-yellow-500',
  ACCEPTED: 'bg-status-accepted',
  REJECTED: 'bg-status-rejected',
  WITHDRAWN: 'bg-steel-400',
}

export const jobTypeLabels: Record<JobType, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
  REMOTE: 'Remote',
}

