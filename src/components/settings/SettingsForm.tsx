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
}

const formFields: FormField[] = [
  {
    key: 'desiredRoles',
    label: 'Desired roles',
    icon: Briefcase,
    placeholder: 'e.g., Software Engineer, Product Manager, Data Scientist...',
  },
  {
    key: 'preferredLocations',
    label: 'Preferred locations',
    icon: MapPin,
    placeholder: 'e.g., San Francisco, New York, Remote...',
  },
  {
    key: 'remotePreference',
    label: 'Remote preference',
    icon: Home,
    placeholder: 'e.g., Fully remote, hybrid, on-site...',
  },
  {
    key: 'salaryExpectation',
    label: 'Salary expectation',
    icon: DollarSign,
    placeholder: 'e.g., $100k-150k, negotiable...',
  },
  {
    key: 'skills',
    label: 'Skills & technologies',
    icon: Code,
    placeholder: 'e.g., React, Python, AWS, Project Management...',
  },
  {
    key: 'experience',
    label: 'Work experience',
    icon: Clock,
    placeholder: 'e.g., 5 years in software development...',
  },
  {
    key: 'education',
    label: 'Education',
    icon: GraduationCap,
    placeholder: 'e.g., BS in Computer Science, bootcamp...',
  },
  {
    key: 'industries',
    label: 'Industries of interest',
    icon: Building2,
    placeholder: 'e.g., Tech, Healthcare, Finance...',
  },
  {
    key: 'companySize',
    label: 'Company size preference',
    icon: Scale,
    placeholder: 'e.g., Startup, mid-size, enterprise...',
  },
  {
    key: 'dealBreakers',
    label: 'Deal breakers',
    icon: Ban,
    placeholder: 'e.g., No on-call, need visa sponsorship...',
  },
  {
    key: 'additionalNotes',
    label: 'Additional notes',
    icon: MessageSquare,
    placeholder: 'Anything else that might help...',
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
      <div className="space-y-4">
        {formFields.map((field, index) => {
          const Icon = field.icon
          const value = formData[field.key] as string | null
          
          return (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="card p-4"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-jobbi-navy" />
                  <span className="font-medium text-sm text-jobbi-dark">
                    {field.label}
                  </span>
                </div>
                
                <textarea
                  value={value || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="textarea text-sm"
                  rows={2}
                />
              </label>
            </motion.div>
          )
        })}
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4 mt-6">
        <div className="card p-3 flex items-center justify-between shadow-card">
          <p className="text-sm text-steel-500">
            {saved ? 'Preferences saved!' : 'Save your changes'}
          </p>
          
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Saved
              </>
            ) : isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
