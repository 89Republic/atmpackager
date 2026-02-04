'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function ProfileDropdown() {
  const [userEmail, setUserEmail] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || 'admin@atmpackager.com'
    setUserEmail(email)
  }, [])

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('[data-profile-dropdown]')) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div data-profile-dropdown className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-card/80 transition-colors"
      >
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{userEmail}</p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/30 transition-colors">
          <span className="text-sm font-semibold text-primary">
            {userEmail.charAt(0).toUpperCase()}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">ATM Administrator</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-2">
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <span className="font-medium">Role:</span> System Administrator
              </p>
              <p>
                <span className="font-medium">Department:</span> Operations
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className="text-green-500">Active</span>
              </p>
              <p>
                <span className="font-medium">Member Since:</span> Jan 1, 2024
              </p>
              <p>
                <span className="font-medium">Last Login:</span> Today at 2:45 PM
              </p>
            </div>
          </div>

          <div className="p-4 border-t border-border space-y-2">
            <Button variant="ghost" className="w-full justify-start text-sm">
              Edit Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm">
              Change Password
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm">
              Preferences
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
