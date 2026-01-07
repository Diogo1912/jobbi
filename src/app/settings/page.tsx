import { prisma } from '@/lib/prisma'
import { SettingsHeader } from '@/components/settings/SettingsHeader'
import { SettingsForm } from '@/components/settings/SettingsForm'
import { Settings } from '@prisma/client'

export const dynamic = 'force-dynamic'

const defaultSettings: Settings = {
  id: 'user-settings',
  desiredRoles: null,
  preferredLocations: null,
  remotePreference: null,
  salaryExpectation: null,
  skills: null,
  experience: null,
  education: null,
  industries: null,
  companySize: null,
  dealBreakers: null,
  additionalNotes: null,
  updatedAt: new Date(),
  createdAt: new Date(),
}

export default async function SettingsPage() {
  let settings: Settings = defaultSettings
  
  try {
    const dbSettings = await prisma.settings.findUnique({
      where: { id: 'user-settings' }
    })

    if (!dbSettings) {
      settings = await prisma.settings.create({
        data: { id: 'user-settings' }
      })
    } else {
      settings = dbSettings
    }
  } catch (error) {
    console.error('Failed to fetch settings:', error)
  }

  return (
    <div className="min-h-screen bg-steel-50">
      <SettingsHeader />
      
      <div className="max-w-2xl mx-auto px-4 py-4">
        <SettingsForm settings={settings} />
      </div>
    </div>
  )
}
