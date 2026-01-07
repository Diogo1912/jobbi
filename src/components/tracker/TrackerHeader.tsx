'use client'

import { motion } from 'framer-motion'
import { Table2, Bookmark, Send, MessageSquare, Gift } from 'lucide-react'

interface TrackerHeaderProps {
  stats: {
    total: number
    saved: number
    applied: number
    interview: number
    offers: number
  }
}

const statItems = [
  { key: 'saved', label: 'Saved', icon: Bookmark, color: 'from-blue-400 to-blue-500' },
  { key: 'applied', label: 'Applied', icon: Send, color: 'from-accent to-accent-dark' },
  { key: 'interview', label: 'Interviews', icon: MessageSquare, color: 'from-purple-400 to-purple-500' },
  { key: 'offers', label: 'Offers', icon: Gift, color: 'from-yellow-400 to-amber-500' },
]

export function TrackerHeader({ stats }: TrackerHeaderProps) {
  return (
    <header className="sticky top-0 z-10 glass border-b-2 border-jobbi-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-jobbi-dark flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-jobbi-navy to-jobbi-slate flex items-center justify-center shadow-lg">
                  <Table2 className="w-6 h-6 text-white" />
                </div>
                Job Tracker
              </h1>
              <p className="text-jobbi-muted mt-2 font-medium text-lg">
                {stats.total > 0 
                  ? `📊 Tracking ${stats.total} application${stats.total !== 1 ? 's' : ''}`
                  : '✨ Start saving jobs to track them here'
                }
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {statItems.map((item, index) => {
              const Icon = item.icon
              const value = stats[item.key as keyof typeof stats]
              
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring', bounce: 0.4 }}
                  className="card p-5 hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-jobbi-dark">{value}</p>
                      <p className="text-sm text-jobbi-muted font-semibold">{item.label}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </header>
  )
}
