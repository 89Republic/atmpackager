'use client'

import { ProfileDropdown } from './profile-dropdown'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Overview</h2>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <ProfileDropdown />
      </div>
    </header>
  )
}
