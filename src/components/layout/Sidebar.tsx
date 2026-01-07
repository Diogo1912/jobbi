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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-jobbi-dark flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Jobbi</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-accent text-white' 
                      : 'text-steel-400 hover:bg-jobbi-navy hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Search for Jobs Button */}
      <div className="p-4 border-t border-jobbi-navy">
        <button
          onClick={handleNewSearch}
          disabled={isSearching}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
          {isSearching ? 'Searching...' : 'Find New Jobs'}
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-steel-500">
          Powered by Gemini AI
        </p>
      </div>
    </aside>
  )
}

