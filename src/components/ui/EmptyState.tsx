'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-steel-100 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-steel-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-jobbi-dark mb-2">{title}</h3>
      <p className="text-steel-500 max-w-md mb-6">{description}</p>
      
      {action && (
        <button onClick={action.onClick} className="btn-primary">
          {action.label}
        </button>
      )}
    </motion.div>
  )
}

