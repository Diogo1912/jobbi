'use client'

import { motion } from 'framer-motion'
import { Settings, Sparkles } from 'lucide-react'

export function SettingsHeader() {
  return (
    <header className="sticky top-0 z-10 glass border-b border-steel-200">
      <div className="max-w-3xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-jobbi-dark flex items-center gap-2">
            <Settings className="w-6 h-6 text-accent" />
            Your Preferences
          </h1>
          <p className="text-steel-500 mt-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Tell Jobbi about yourself to find better matches
          </p>
        </motion.div>
      </div>
    </header>
  )
}

