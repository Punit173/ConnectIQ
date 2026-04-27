'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, MessageSquareText, Settings, LogOut, ChevronRight, Menu, X, Code2, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: MessageSquareText, label: 'Interview', href: '/dashboard/interview' },
  { icon: Code2, label: 'Tech Round', href: '/dashboard/coding' },
  { icon: Users, label: 'Community', href: '/dashboard/community' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || 'User')
      }
    }
    fetchUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={{ width: 256 }}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        className="hidden md:flex flex-col border-r border-border h-full bg-card/50 backdrop-blur-xl relative z-20"
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          {isSidebarOpen ? (
             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
               ConnectIQ
             </span>
          ) : (
            <span className="text-xl font-bold text-primary">C</span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md hover:bg-secondary transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : 'mr-0'}`} />
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && isSidebarOpen && (
                   <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-primary ml-auto" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          {userEmail && (
            <div className={`flex items-center px-4 py-3 rounded-xl bg-secondary/30 text-sm overflow-hidden ${!isSidebarOpen && 'justify-center'}`}>
              <User className={`w-5 h-5 flex-shrink-0 text-primary ${isSidebarOpen ? 'mr-3' : ''}`} />
              {isSidebarOpen && <span className="truncate text-muted-foreground font-medium">{userEmail}</span>}
            </div>
          )}
          <button
            onClick={handleSignOut}
            className={`flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? 'mr-3' : ''}`} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-background/50">
        {/* Mobile Header */}
        <div className="md:hidden h-16 flex items-center justify-between px-6 border-b border-border bg-background">
          <span className="text-lg font-bold">ConnectIQ</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
