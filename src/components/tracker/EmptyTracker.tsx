'use client'

import { motion } from 'framer-motion'
import { ClipboardList, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function EmptyTracker() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <motion.div
        animate={{ 
          y: [0, -5, 0],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center"
      >
        <ClipboardList className="w-12 h-12 text-status-saved" />
      </motion.div>

      <h2 className="text-2xl font-bold text-jobbi-dark mb-3">
        No jobs tracked yet
      </h2>
      <p className="text-steel-500 max-w-md mx-auto mb-8">
        Save jobs from your feed to track your application progress here. 
        Keep everything organized in one place!
      </p>

      <Link href="/" className="btn-primary">
        Browse Job Feed
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  )
}

