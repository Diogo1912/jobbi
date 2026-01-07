'use client'

import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Zap } from 'lucide-react'

interface FeedHeaderProps {
  jobCount: number
}

export function FeedHeader({ jobCount }: FeedHeaderProps) {
  return (
    <header className="sticky top-0 z-10 glass border-b-2 border-jobbi-50">
      <div className="max-w-2xl mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-black text-jobbi-dark flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              Your Job Feed
            </h1>
            <p className="text-jobbi-muted mt-2 font-medium text-lg">
              {jobCount > 0 
                ? `🎯 ${jobCount} opportunities curated for you`
                : '✨ Let Jobbi find your next opportunity'
              }
            </p>
          </div>
          
          {jobCount > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-2xl text-sm font-bold shadow-lg"
            >
              <Zap className="w-5 h-5" />
              Fresh picks!
            </motion.div>
          )}
        </motion.div>
      </div>
    </header>
  )
}
