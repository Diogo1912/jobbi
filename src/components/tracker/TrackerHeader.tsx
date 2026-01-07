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
  { key: 'saved', label: 'Saved', icon: Bookmark, color: 'bg-blue-500' },
  { key: 'applied', label: 'Applied', icon: Send, color: 'bg-accent' },
  { key: 'interview', label: 'Interviews', icon: MessageSquare, color: 'bg-purple-500' },
  { key: 'offers', label: 'Offers', icon: Gift, color: 'bg-yellow-500' },
]

export function TrackerHeader({ stats }: TrackerHeaderProps) {
  return (
    <header className="sticky top-0 z-10 glass border-b border-steel-200">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-jobbi-dark flex items-center gap-2">
                <Table2 className="w-5 h-5 text-jobbi-navy" />
                Job Tracker
              </h1>
              <p className="text-sm text-steel-500">
                {stats.total > 0 
                  ? `Tracking ${stats.total} application${stats.total !== 1 ? 's' : ''}`
                  : 'Start saving jobs to track them'
                }
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {statItems.map((item) => {
              const Icon = item.icon
              const value = stats[item.key as keyof typeof stats]
              
              return (
                <div key={item.key} className="card p-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-jobbi-dark">{value}</p>
                      <p className="text-xs text-steel-500">{item.label}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </header>
  )
}
