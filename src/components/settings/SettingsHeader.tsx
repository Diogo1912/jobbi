'use client'

import { motion } from 'framer-motion'
import { Settings, Sparkles, Wand2 } from 'lucide-react'

export function SettingsHeader() {
  return (
    <header className="sticky top-0 z-10 glass border-b-2 border-jobbi-50">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          <h1 className="text-3xl font-black text-jobbi-dark flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            Your Preferences
          </h1>
          <p className="text-jobbi-muted mt-2 font-medium text-lg flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-accent" />
            Tell Jobbi about yourself to find better matches ✨
          </p>
        </motion.div>
      </div>
    </header>
  )
}
