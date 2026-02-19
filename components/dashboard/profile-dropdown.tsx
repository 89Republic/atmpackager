'use client'

import React, { useState, useEffect } from 'react'
import { LogOut, User, Shield, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ProfileDropdown() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || 'admin@atmpackager.com'
    setUserEmail(email)
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-profile-dropdown]')) setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const handleLogout = () => {
    localStorage.removeItem('authenticated')
    localStorage.removeItem('userEmail')
    router.push('/')
  }

  const initial = userEmail.charAt(0).toUpperCase()
  const displayName = userEmail.split('@')[0] ?? 'Admin'
  const displayNameFormatted = displayName.charAt(0).toUpperCase() + displayName.slice(1)

  return (
    <div data-profile-dropdown className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-colors ${
          isOpen ? 'bg-muted' : 'hover:bg-muted/60'
        }`}
      >
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-foreground leading-none">{displayNameFormatted}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Administrator</p>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0"
          style={{ background: 'linear-gradient(135deg, oklch(0.65 0.24 278), oklch(0.55 0.22 295))' }}
        >
          {initial}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden surface-elevated">
          {/* Profile header */}
          <div className="px-4 py-4 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0"
                style={{ background: 'linear-gradient(135deg, oklch(0.65 0.24 278), oklch(0.55 0.22 295))' }}
              >
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{displayNameFormatted}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="px-4 py-3 space-y-2.5">
            <InfoRow icon={Shield} label="Role" value="System Administrator" />
            <InfoRow icon={User} label="Department" value="Operations" />
            <InfoRow icon={Clock} label="Last Login" value={`Today at ${currentTime}`} />
          </div>

          {/* Actions */}
          <div className="p-2 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/8 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0 flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground shrink-0">{label}</span>
        <span className="text-xs font-medium text-foreground truncate text-right">{value}</span>
      </div>
    </div>
  )
}
