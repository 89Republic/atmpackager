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

const serviceTypes = [
  { label: 'Standard', value: 'standard' },
  { label: 'Client', value: 'client' },
  { label: 'Mapping', value: 'mapping' },
]

export function Sidebar() {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showServicesDropdown, setShowServicesDropdown] = useState(false)

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
        {menuItems.slice(0, 1).map((item) => (
          <Link key={item.href} href={item.href}>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sidebar-foreground text-sm font-medium">
              <span className="text-lg shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          </Link>
        ))}

        {/* Services Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowServicesDropdown(!showServicesDropdown)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sidebar-foreground text-sm font-medium"
          >
            <span className="text-lg shrink-0">🔧</span>
            {!isCollapsed && (
              <>
                <span className="truncate flex-1 text-left">Services</span>
                <span className={`transition-transform ${showServicesDropdown ? 'rotate-180' : ''}`}>▼</span>
              </>
            )}
          </button>
          
          {/* Dropdown Menu */}
          {showServicesDropdown && !isCollapsed && (
            <div className="ml-4 mt-1 space-y-1">
              {serviceTypes.map((service) => (
                <Link
                  key={service.value}
                  href={`/dashboard/services/${service.value}`}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sidebar-foreground text-sm"
                >
                  <span className="text-sm shrink-0">•</span>
                  <span className="truncate">{service.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {menuItems.slice(1).map((item) => (
          <Link key={item.href} href={item.href}>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sidebar-foreground text-sm font-medium">
              <span className="text-lg shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
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
