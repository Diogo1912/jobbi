'use client'

import { motion } from 'framer-motion'
import { Briefcase, Settings, ArrowRight, Sparkles, Rocket } from 'lucide-react'
import Link from 'next/link'

export function EmptyFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', bounce: 0.4 }}
      className="text-center py-20 relative"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bubble-bg pointer-events-none" />
      
      {/* Animated Icon */}
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-32 h-32 mx-auto mb-10 rounded-4xl bg-gradient-to-br from-accent/30 via-accent/20 to-orange-100 flex items-center justify-center shadow-bubble relative"
      >
        <Briefcase className="w-16 h-16 text-accent" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-jobbi-navy to-jobbi-slate flex items-center justify-center"
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>

      <h2 className="text-3xl font-black text-jobbi-dark mb-4">
        Your feed is empty
      </h2>
      <p className="text-jobbi-muted max-w-md mx-auto mb-10 text-lg font-medium">
        Set up your preferences and let Jobbi find the perfect jobs for you. 
        The more you tell us, the better we can match! 🎯
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/settings" className="btn-secondary">
          <Settings className="w-5 h-5" />
          Set Up Preferences
          <ArrowRight className="w-5 h-5" />
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
          className="btn-primary"
        >
          <Rocket className="w-5 h-5" />
          Find Jobs Now
        </button>
      </div>

      {/* Tips */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-14 max-w-lg mx-auto"
      >
        <div className="card p-6 text-left flex items-start gap-5 border-2 border-jobbi-light/30">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-jobbi-50 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="font-bold text-jobbi-dark text-lg">Pro Tip</h3>
            <p className="text-jobbi-muted mt-1">
              The more specific your preferences, the better Jobbi can find matching opportunities for you!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
