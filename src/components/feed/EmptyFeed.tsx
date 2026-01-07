'use client'

import { motion } from 'framer-motion'
import { Briefcase, Settings, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function EmptyFeed() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16 px-4"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-steel-100 flex items-center justify-center">
        <Briefcase className="w-8 h-8 text-steel-400" />
      </div>

      <h2 className="text-lg font-semibold text-jobbi-dark mb-2">
        Your feed is empty
      </h2>
      <p className="text-steel-500 max-w-sm mx-auto mb-6 text-sm">
        Set up your preferences and let Jobbi find the perfect jobs for you.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/settings" className="btn-secondary text-sm">
          <Settings className="w-4 h-4" />
          Set Preferences
        </Link>
        
        <button 
          onClick={async () => {
            try {
              await fetch('/api/jobs/search', { method: 'POST' })
              window.location.reload()
            } catch (e) {
              console.error(e)
            }
          }}
          className="btn-primary text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Find Jobs
        </button>
      </div>
    </motion.div>
  )
}
