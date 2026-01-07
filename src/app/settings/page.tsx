import { prisma } from '@/lib/prisma'
import { SettingsHeader } from '@/components/settings/SettingsHeader'
import { SettingsForm } from '@/components/settings/SettingsForm'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  // Get or create settings
  let settings = await prisma.settings.findUnique({
    where: { id: 'user-settings' }
  })

  if (!settings) {
    settings = await prisma.settings.create({
      data: { id: 'user-settings' }
    })
  }

  return (
    <div className="min-h-screen bg-steel-50">
      <SettingsHeader />
      
      <div className="max-w-3xl mx-auto px-6 pb-12">
        <SettingsForm settings={settings} />
      </div>
    </div>
  )
}

