'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  MapPin, 
  Home, 
  DollarSign, 
  Code, 
  Clock,
  GraduationCap,
  Building2,
  Scale,
  Ban,
  MessageSquare,
  Save,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { Settings } from '@prisma/client'

interface SettingsFormProps {
  settings: Settings
}

interface FormField {
  key: keyof Settings
  label: string
  icon: any
  placeholder: string
  hint: string
  color: string
}

const formFields: FormField[] = [
  {
    key: 'desiredRoles',
    label: 'What roles are you looking for?',
    icon: Briefcase,
    placeholder: 'e.g., Software Engineer, Product Manager, Data Scientist...',
    hint: 'List the job titles or roles you\'re interested in',
    color: 'from-blue-400 to-blue-500'
  },
  {
    key: 'preferredLocations',
    label: 'Where do you want to work?',
    icon: MapPin,
    placeholder: 'e.g., San Francisco, New York, London, anywhere in Europe...',
    hint: 'Cities, regions, or countries you\'d like to work in',
    color: 'from-emerald-400 to-emerald-500'
  },
  {
    key: 'remotePreference',
    label: 'Remote work preference?',
    icon: Home,
    placeholder: 'e.g., Fully remote preferred, hybrid okay, willing to relocate...',
    hint: 'Describe your ideal work arrangement',
    color: 'from-violet-400 to-violet-500'
  },
  {
    key: 'salaryExpectation',
    label: 'Salary expectations?',
    icon: DollarSign,
    placeholder: 'e.g., $100k-150k, open to negotiation, equity important...',
    hint: 'Your target compensation range',
    color: 'from-green-400 to-green-500'
  },
  {
    key: 'skills',
    label: 'What are your skills & technologies?',
    icon: Code,
    placeholder: 'e.g., React, Python, AWS, Project Management, Data Analysis...',
    hint: 'Technical and soft skills you bring to the table',
    color: 'from-cyan-400 to-cyan-500'
  },
  {
    key: 'experience',
    label: 'Your work experience',
    icon: Clock,
    placeholder: 'e.g., 5 years in software development, led a team of 8, worked at startups...',
    hint: 'Summarize your professional background',
    color: 'from-amber-400 to-amber-500'
  },
  {
    key: 'education',
    label: 'Educational background',
    icon: GraduationCap,
    placeholder: 'e.g., BS in Computer Science, bootcamp graduate, self-taught...',
    hint: 'Your degrees, certifications, or relevant education',
    color: 'from-indigo-400 to-indigo-500'
  },
  {
    key: 'industries',
    label: 'Industries of interest?',
    icon: Building2,
    placeholder: 'e.g., Tech, Healthcare, Finance, E-commerce, Gaming...',
    hint: 'Sectors or industries you\'d like to work in',
    color: 'from-pink-400 to-pink-500'
  },
  {
    key: 'companySize',
    label: 'Preferred company size?',
    icon: Scale,
    placeholder: 'e.g., Early-stage startup, mid-size, enterprise, doesn\'t matter...',
    hint: 'The type of company culture you thrive in',
    color: 'from-teal-400 to-teal-500'
  },
  {
    key: 'dealBreakers',
    label: 'Deal breakers?',
    icon: Ban,
    placeholder: 'e.g., No on-call, won\'t relocate, need visa sponsorship...',
    hint: 'Things that would make you pass on a job',
    color: 'from-rose-400 to-rose-500'
  },
  {
    key: 'additionalNotes',
    label: 'Anything else Jobbi should know?',
    icon: MessageSquare,
    placeholder: 'e.g., Looking for a role that values work-life balance, interested in AI companies...',
    hint: 'Any other preferences or details that might help',
    color: 'from-accent to-accent-dark'
  },
]

export function SettingsForm({ settings }: SettingsFormProps) {
  const [formData, setFormData] = useState(settings)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (key: keyof Settings, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {formFields.map((field, index) => {
          const Icon = field.icon
          const value = formData[field.key] as string | null
          
          return (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05, type: 'spring', bounce: 0.3 }}
              className="card p-7 hover:shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              <label className="block">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${field.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-jobbi-dark text-lg">
                      {field.label}
                    </span>
                    <p className="text-sm text-jobbi-muted font-medium">{field.hint}</p>
                  </div>
                </div>
                
                <textarea
                  value={value || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="textarea"
                  rows={3}
                />
              </label>
            </motion.div>
          )
        })}
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="sticky bottom-6 mt-10"
      >
        <div className="card p-5 flex items-center justify-between shadow-card border-2 border-jobbi-light/30">
          <p className="text-jobbi-muted font-semibold flex items-center gap-2">
            {saved 
              ? <>
                  <Sparkles className="w-5 h-5 text-accent" />
                  Your preferences have been saved!
                </>
              : '💾 Remember to save your changes'
            }
          </p>
          
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary disabled:opacity-50"
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Saved!
              </>
            ) : isSaving ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </motion.div>
    </form>
  )
}
