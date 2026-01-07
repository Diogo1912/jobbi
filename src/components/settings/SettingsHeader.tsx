'use client'

import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'

export function SettingsHeader() {
  return (
    <header className="sticky top-0 z-10 glass border-b border-steel-200">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl font-bold text-jobbi-dark flex items-center gap-2">
            <Settings className="w-5 h-5 text-jobbi-navy" />
            Preferences
          </h1>
          <p className="text-sm text-steel-500">
            Help Jobbi find better matches for you
          </p>
        </motion.div>
      </div>
    </header>
  )
}
