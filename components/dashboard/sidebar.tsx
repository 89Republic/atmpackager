'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, ScrollText, Settings, Cpu, ChevronDown,
  LogOut, Zap, ChevronLeft, ChevronRight, Layers, Users, GitMerge
} from 'lucide-react'

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Logs', href: '/dashboard/logs', icon: ScrollText },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const serviceTypes = [
  { label: 'ISO Standard', value: 'standard', icon: Layers },
  { label: 'Client Config', value: 'client', icon: Users },
  { label: 'Mapping', value: 'mapping', icon: GitMerge },
]

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showServicesDropdown, setShowServicesDropdown] = useState(
    pathname.startsWith('/dashboard/services')
  )

  const handleLogout = () => {
    localStorage.removeItem('authenticated')
    localStorage.removeItem('userEmail')
    router.push('/')
  }

  const isActive = (href: string) => pathname === href
  const isServiceActive = (value: string) => pathname === `/dashboard/services/${value}`

  return (
    <aside
      className={`${
        isCollapsed ? 'w-[72px]' : 'w-64'
      } bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col shrink-0`}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-sidebar-border shrink-0 ${
        isCollapsed ? 'justify-center px-4' : 'px-5 gap-3'
      }`}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, oklch(0.65 0.24 278), oklch(0.55 0.22 295))' }}
        >
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!isCollapsed && (
          <>
            <span className="text-sm font-bold text-sidebar-foreground tracking-tight flex-1 truncate">ATM Packager</span>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-md text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="absolute left-full ml-1 top-1/2 -translate-y-1/2 hidden"
          />
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="mx-auto mt-3 p-1.5 rounded-md text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-3">
        {/* Section label */}
        {!isCollapsed && (
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">Main</p>
        )}

        {/* Dashboard only */}
        <NavLink
          href={menuItems[0].href}
          icon={menuItems[0].icon}
          label={menuItems[0].label}
          isActive={isActive(menuItems[0].href)}
          isCollapsed={isCollapsed}
        />

        {/* Services group */}
        {!isCollapsed && (
          <p className="px-2 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">Services</p>
        )}
        {isCollapsed && <div className="my-3 h-px bg-sidebar-border mx-1" />}

        <div>
          <button
            onClick={() => setShowServicesDropdown(!showServicesDropdown)}
            className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium group ${
              pathname.startsWith('/dashboard/services')
                ? 'bg-sidebar-primary/15 text-sidebar-primary'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}
          >
            <Cpu className={`shrink-0 transition-colors ${
              isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
            } ${
              pathname.startsWith('/dashboard/services') ? 'text-sidebar-primary' : ''
            }`} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showServicesDropdown ? 'rotate-180' : ''
                }`} />
              </>
            )}
          </button>

          {showServicesDropdown && !isCollapsed && (
            <div className="mt-1 ml-3 pl-3 border-l border-sidebar-border space-y-0.5">
              {serviceTypes.map(({ label, value, icon: Icon }) => (
                <Link
                  key={value}
                  href={`/dashboard/services/${value}`}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 ${
                    isServiceActive(value)
                      ? 'bg-sidebar-primary/15 text-sidebar-primary font-medium'
                      : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                  {isServiceActive(value) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Remaining items */}
        {!isCollapsed && (
          <p className="px-2 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">System</p>
        )}
        {isCollapsed && <div className="my-3 h-px bg-sidebar-border mx-1" />}

        {menuItems.slice(1).map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.href)}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className={`border-t border-sidebar-border ${isCollapsed ? 'p-3' : 'p-4'}`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-all duration-150 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Sign out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}

function NavLink({
  href,
  icon: Icon,
  label,
  isActive,
  isCollapsed,
}: {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
  isCollapsed: boolean
}) {
  return (
    <Link href={href}>
      <span
        className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
          isActive
            ? 'bg-sidebar-primary/15 text-sidebar-primary'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        } ${isCollapsed ? 'justify-center' : ''}`}
        title={isCollapsed ? label : undefined}
      >
        <Icon className={`shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
        {!isCollapsed && <span className="truncate flex-1">{label}</span>}
        {!isCollapsed && isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-sidebar-primary shrink-0" />
        )}
      </span>
    </Link>
  )
}
