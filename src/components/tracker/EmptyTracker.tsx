'use client'

import { motion } from 'framer-motion'
import { ClipboardList, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function EmptyTracker() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16 px-4"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-steel-100 flex items-center justify-center">
        <ClipboardList className="w-8 h-8 text-steel-400" />
      </div>

      <h2 className="text-lg font-semibold text-jobbi-dark mb-2">
        No jobs tracked yet
      </h2>
      <p className="text-steel-500 max-w-sm mx-auto mb-6 text-sm">
        Save jobs from your feed to track your application progress here.
      </p>

      <Link href="/" className="btn-primary text-sm">
        Browse Job Feed
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  )
}
