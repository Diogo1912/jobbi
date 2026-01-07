'use client'

import { motion } from 'framer-motion'
import { Briefcase, Settings, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function EmptyFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      {/* Animated Icon */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0] 
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-accent/20 to-orange-100 flex items-center justify-center"
      >
        <Briefcase className="w-12 h-12 text-accent" />
      </motion.div>

      <h2 className="text-2xl font-bold text-jobbi-dark mb-3">
        Your feed is empty
      </h2>
      <p className="text-steel-500 max-w-md mx-auto mb-8">
        Set up your preferences and let Jobbi find the perfect jobs for you. 
        The more you tell us, the better we can match!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/settings" className="btn-primary">
          <Settings className="w-5 h-5" />
          Set Up Preferences
          <ArrowRight className="w-4 h-4" />
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
          className="btn-outline"
        >
          <Sparkles className="w-5 h-5" />
          Find Jobs Now
        </button>
      </div>

      {/* Tips */}
      <div className="mt-12 grid gap-4 max-w-lg mx-auto">
        <div className="card p-4 text-left flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <h3 className="font-semibold text-jobbi-dark">Pro Tip</h3>
            <p className="text-sm text-steel-500">
              The more specific your preferences, the better Jobbi can find matching opportunities.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

