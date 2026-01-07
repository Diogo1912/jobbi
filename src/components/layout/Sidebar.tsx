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
    <aside className="fixed left-0 top-0 h-screen w-56 bg-jobbi-dark flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Jobbi</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors
                    ${isActive 
                      ? 'bg-accent text-white' 
                      : 'text-jobbi-light hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Search Button */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleNewSearch}
          disabled={isSearching}
          className="w-full py-2 px-3 rounded-lg bg-white text-jobbi-dark font-medium hover:bg-steel-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
          {isSearching ? 'Searching...' : 'Find Jobs'}
        </button>
      </div>

      {/* Footer */}
      <div className="p-3 text-center">
        <p className="text-xs text-jobbi-light/50">Powered by Gemini AI</p>
      </div>
    </aside>
  )
}
