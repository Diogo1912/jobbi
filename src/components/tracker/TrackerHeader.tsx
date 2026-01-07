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
  { key: 'saved', label: 'Saved', icon: Bookmark, color: 'bg-status-saved' },
  { key: 'applied', label: 'Applied', icon: Send, color: 'bg-status-applied' },
  { key: 'interview', label: 'Interviews', icon: MessageSquare, color: 'bg-status-interview' },
  { key: 'offers', label: 'Offers', icon: Gift, color: 'bg-yellow-500' },
]

export function TrackerHeader({ stats }: TrackerHeaderProps) {
  return (
    <header className="sticky top-0 z-10 glass border-b border-steel-200">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-jobbi-dark flex items-center gap-2">
                <Table2 className="w-6 h-6 text-accent" />
                Job Tracker
              </h1>
              <p className="text-steel-500 mt-1">
                {stats.total > 0 
                  ? `Tracking ${stats.total} application${stats.total !== 1 ? 's' : ''}`
                  : 'Start saving jobs to track them here'
                }
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statItems.map((item, index) => {
              const Icon = item.icon
              const value = stats[item.key as keyof typeof stats]
              
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-jobbi-dark">{value}</p>
                      <p className="text-sm text-steel-500">{item.label}</p>
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

