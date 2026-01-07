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
  CheckCircle
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
}

const formFields: FormField[] = [
  {
    key: 'desiredRoles',
    label: 'What roles are you looking for?',
    icon: Briefcase,
    placeholder: 'e.g., Software Engineer, Product Manager, Data Scientist...',
    hint: 'List the job titles or roles you\'re interested in'
  },
  {
    key: 'preferredLocations',
    label: 'Where do you want to work?',
    icon: MapPin,
    placeholder: 'e.g., San Francisco, New York, London, anywhere in Europe...',
    hint: 'Cities, regions, or countries you\'d like to work in'
  },
  {
    key: 'remotePreference',
    label: 'Remote work preference?',
    icon: Home,
    placeholder: 'e.g., Fully remote preferred, hybrid okay, willing to relocate...',
    hint: 'Describe your ideal work arrangement'
  },
  {
    key: 'salaryExpectation',
    label: 'Salary expectations?',
    icon: DollarSign,
    placeholder: 'e.g., $100k-150k, open to negotiation, equity important...',
    hint: 'Your target compensation range'
  },
  {
    key: 'skills',
    label: 'What are your skills & technologies?',
    icon: Code,
    placeholder: 'e.g., React, Python, AWS, Project Management, Data Analysis...',
    hint: 'Technical and soft skills you bring to the table'
  },
  {
    key: 'experience',
    label: 'Your work experience',
    icon: Clock,
    placeholder: 'e.g., 5 years in software development, led a team of 8, worked at startups...',
    hint: 'Summarize your professional background'
  },
  {
    key: 'education',
    label: 'Educational background',
    icon: GraduationCap,
    placeholder: 'e.g., BS in Computer Science, bootcamp graduate, self-taught...',
    hint: 'Your degrees, certifications, or relevant education'
  },
  {
    key: 'industries',
    label: 'Industries of interest?',
    icon: Building2,
    placeholder: 'e.g., Tech, Healthcare, Finance, E-commerce, Gaming...',
    hint: 'Sectors or industries you\'d like to work in'
  },
  {
    key: 'companySize',
    label: 'Preferred company size?',
    icon: Scale,
    placeholder: 'e.g., Early-stage startup, mid-size, enterprise, doesn\'t matter...',
    hint: 'The type of company culture you thrive in'
  },
  {
    key: 'dealBreakers',
    label: 'Deal breakers?',
    icon: Ban,
    placeholder: 'e.g., No on-call, won\'t relocate, need visa sponsorship...',
    hint: 'Things that would make you pass on a job'
  },
  {
    key: 'additionalNotes',
    label: 'Anything else Jobbi should know?',
    icon: MessageSquare,
    placeholder: 'e.g., Looking for a role that values work-life balance, interested in AI companies...',
    hint: 'Any other preferences or details that might help'
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6"
            >
              <label className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="font-semibold text-jobbi-dark">
                      {field.label}
                    </span>
                    <p className="text-sm text-steel-400">{field.hint}</p>
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
        className="sticky bottom-6 mt-8"
      >
        <div className="card p-4 flex items-center justify-between shadow-lg">
          <p className="text-steel-500 text-sm">
            {saved 
              ? '✨ Your preferences have been saved!'
              : 'Remember to save your changes'
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
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

