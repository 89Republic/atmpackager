'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
  },
  {
    label: 'Services',
    href: '/dashboard/services',
    icon: '⚙️',
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: '📈',
  },
  {
    label: 'Logs',
    href: '/dashboard/logs',
    icon: '📝',
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: '⚙️',
  },
]

export function Sidebar() {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('authenticated')
    localStorage.removeItem('userEmail')
    router.push('/')
  }

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-lg font-bold text-sidebar-foreground truncate">ATM Pack</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-sidebar-accent rounded transition-colors"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sidebar-foreground text-sm font-medium">
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {!isCollapsed && (
          <div className="px-4 py-2 bg-sidebar-accent rounded-lg">
            <p className="text-xs font-semibold text-sidebar-accent-foreground">v0.1.0</p>
          </div>
        )}
        <Button
          onClick={handleLogout}
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          size="sm"
        >
          {isCollapsed ? '←' : 'Logout'}
        </Button>
      </div>
    </aside>
  )
}
