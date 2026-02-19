'use client'

import { usePathname } from 'next/navigation'
import { ProfileDropdown } from './profile-dropdown'
import { ThemeToggle } from './theme-toggle'
import { ChevronRight } from 'lucide-react'

const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  '/dashboard': { title: 'Dashboard', description: 'System overview and key metrics' },
  '/dashboard/logs': { title: 'Logs', description: 'Activity and audit trail' },
  '/dashboard/settings': { title: 'Settings', description: 'System configuration' },
  '/dashboard/analytics': { title: 'Analytics', description: 'Performance analytics' },
  '/dashboard/services/standard': { title: 'Standard Config', description: 'ISO field standards management' },
  '/dashboard/services/client': { title: 'Client Config', description: 'Client-specific configurations' },
  '/dashboard/services/mapping': { title: 'Field Mapping', description: 'Client to standard field mappings' },
}

export function Header() {
  const pathname = usePathname()
  const page = PAGE_TITLES[pathname] ?? { title: 'ATM Packager', description: '' }

  const crumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
      href: '/' + arr.slice(0, i + 1).join('/'),
    }))

  return (
    <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border px-8 flex items-center justify-between shrink-0 sticky top-0 z-10">
      <div className="flex flex-col justify-center">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
          {crumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3" />}
              <span className={i === crumbs.length - 1 ? 'text-foreground font-medium' : ''}>
                {crumb.label}
              </span>
            </span>
          ))}
        </div>
        {page.description && (
          <p className="text-xs text-muted-foreground/70 hidden sm:block">{page.description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <ProfileDropdown />
      </div>
    </header>
  )
}
