'use client'

import { motion } from 'framer-motion'
import { ClipboardList, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function EmptyTracker() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', bounce: 0.4 }}
      className="text-center py-20 relative"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bubble-bg pointer-events-none" />

      <motion.div
        animate={{ 
          y: [0, -15, 0],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-32 h-32 mx-auto mb-10 rounded-4xl bg-gradient-to-br from-blue-100 via-jobbi-50 to-blue-50 flex items-center justify-center shadow-bubble relative"
      >
        <ClipboardList className="w-16 h-16 text-jobbi-navy" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center"
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>

      <h2 className="text-3xl font-black text-jobbi-dark mb-4">
        No jobs tracked yet
      </h2>
      <p className="text-jobbi-muted max-w-md mx-auto mb-10 text-lg font-medium">
        Save jobs from your feed to track your application progress here. 
        Keep everything organized in one place! 📋
      </p>

      <Link href="/" className="btn-primary">
        Browse Job Feed
        <ArrowRight className="w-5 h-5" />
      </Link>
    </motion.div>
  )
}
