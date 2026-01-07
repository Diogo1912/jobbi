'use client'

import { motion } from 'framer-motion'
import { Sparkles, TrendingUp } from 'lucide-react'

interface FeedHeaderProps {
  jobCount: number
}

export function FeedHeader({ jobCount }: FeedHeaderProps) {
  return (
    <header className="sticky top-0 z-10 glass border-b border-steel-200">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-jobbi-dark flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              Your Job Feed
            </h1>
            <p className="text-steel-500 mt-1">
              {jobCount > 0 
                ? `${jobCount} opportunities curated for you`
                : 'Let Jobbi find your next opportunity'
              }
            </p>
          </div>
          
          {jobCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              Fresh picks
            </div>
          )}
        </motion.div>
      </div>
    </header>
  )
}

