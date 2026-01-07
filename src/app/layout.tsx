import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Jobbi - AI-Powered Job Search',
  description: 'Your personal AI job search companion that finds and curates the perfect opportunities for you.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-72">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
