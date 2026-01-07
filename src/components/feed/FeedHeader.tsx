'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface FeedHeaderProps {
  jobCount: number
}

export function FeedHeader({ jobCount }: FeedHeaderProps) {
  return (
    <header className="sticky top-0 z-10 glass border-b border-steel-200">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl font-bold text-jobbi-dark flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Job Feed
            </h1>
            <p className="text-sm text-steel-500">
              {jobCount > 0 
                ? `${jobCount} opportunities found`
                : 'Find your next opportunity'
              }
            </p>
          </div>
          
          {jobCount > 0 && (
            <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded text-xs font-medium">
              Updated
            </span>
          )}
        </motion.div>
      </div>
    </header>
  )
}
