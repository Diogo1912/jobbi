'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Newspaper, 
  Table2, 
  Settings, 
  Sparkles,
  RefreshCw
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', icon: Newspaper, label: 'Feed' },
  { href: '/tracker', icon: Table2, label: 'Tracker' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isSearching, setIsSearching] = useState(false)

  const handleNewSearch = async () => {
    setIsSearching(true)
    try {
      const response = await fetch('/api/jobs/search', { method: 'POST' })
      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-jobbi-dark via-jobbi-dark to-jobbi-navy flex flex-col rounded-r-4xl shadow-2xl">
      {/* Decorative bubbles */}
      <div className="absolute inset-0 overflow-hidden rounded-r-4xl pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-jobbi-navy/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 -left-10 w-24 h-24 bg-jobbi-slate/20 rounded-full blur-2xl" />
      </div>

      {/* Logo */}
      <div className="relative p-8">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-black text-white tracking-tight">Jobbi</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-5 py-8">
        <ul className="space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-accent to-accent-hover text-white shadow-lg shadow-accent/30 scale-105' 
                      : 'text-jobbi-light hover:bg-white/10 hover:text-white hover:translate-x-1'
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Search for Jobs Button */}
      <div className="relative p-5">
        <button
          onClick={handleNewSearch}
          disabled={isSearching}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-white to-jobbi-50 text-jobbi-dark font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
        >
          <RefreshCw className={`w-5 h-5 ${isSearching ? 'animate-spin' : ''}`} />
          {isSearching ? 'Searching...' : 'Find New Jobs'}
        </button>
      </div>

      {/* Footer */}
      <div className="relative p-5 text-center">
        <p className="text-sm text-jobbi-light/60 font-medium">
          ✨ Powered by Gemini AI
        </p>
      </div>
    </aside>
  )
}
