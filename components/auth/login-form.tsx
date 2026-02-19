'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Loader2, ShieldCheck, Zap, BarChart3, Lock } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 700))
    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }
    localStorage.setItem('authenticated', 'true')
    localStorage.setItem('userEmail', email)
    router.push('/dashboard')
  }

  const features = [
    { icon: Zap, text: 'Real-time ATM monitoring & analytics' },
    { icon: ShieldCheck, text: 'Enterprise-grade security & compliance' },
    { icon: BarChart3, text: 'Intelligent packaging & reporting' },
  ]

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(145deg, oklch(0.10 0.04 268) 0%, oklch(0.14 0.06 278) 50%, oklch(0.12 0.05 290) 100%)'
        }}
      >
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(oklch(0.7 0.2 278 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.2 278 / 0.3) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, oklch(0.65 0.24 278), transparent)' }}
        />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-2xl opacity-15"
          style={{ background: 'radial-gradient(circle, oklch(0.58 0.2 175), transparent)' }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, oklch(0.65 0.24 278), oklch(0.55 0.22 295))' }}
            >
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">ATM Packager</span>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight text-balance">
              Intelligent ATM
              <span className="block" style={{ color: 'oklch(0.75 0.20 278)' }}>Package Management</span>
            </h1>
            <p className="text-base leading-relaxed" style={{ color: 'oklch(0.70 0.04 260)' }}>
              Streamline your ATM operations with precision-engineered packaging, real-time monitoring, and enterprise-grade reporting.
            </p>
          </div>

          <div className="space-y-3">
            {features.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'oklch(0.65 0.24 278 / 0.2)', border: '1px solid oklch(0.65 0.24 278 / 0.3)' }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: 'oklch(0.75 0.20 278)' }} />
                </div>
                <span className="text-sm" style={{ color: 'oklch(0.72 0.03 260)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-xs" style={{ color: 'oklch(0.45 0.02 260)' }}>© 2026 ATM Packager. Enterprise Edition.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-primary">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">ATM Packager</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in to your dashboard to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-input border-border text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/50 focus-visible:border-primary/60 transition-colors"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/50 focus-visible:border-primary/60 transition-colors"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 p-3.5 bg-destructive/8 border border-destructive/20 rounded-xl">
                <div className="w-1 h-6 rounded-full bg-destructive shrink-0" />
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 font-semibold tracking-wide gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 text-white border-0"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Authenticating...</>
              ) : (
                <><Lock className="w-4 h-4 mr-2" />Sign In Securely</>
              )}
            </Button>
          </form>

          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-border" />
            <p className="text-xs text-muted-foreground/60">Demo access</p>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Use any email address and password to sign in
          </p>
        </div>
      </div>
    </div>
  )
}
