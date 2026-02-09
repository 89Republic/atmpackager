'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

interface StandardField {
  recId: number
  fieldId: number
  fieldLength: number
  fieldName: string
  className: string
}

export default function StandardServicesPage() {
  const [services, setServices] = useState<StandardField[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')

  const fetchStandards = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/v1/standards', { cache: 'no-store' })
      const payload = await res.json()
      if (!res.ok || payload?.success === false) {
        const message = payload?.message || 'Failed to load standards'
        throw new Error(message)
      }
      setServices(Array.isArray(payload?.data) ? payload.data : [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load standards'
      setError(message)
      setServices([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStandards()
  }, [])

  const filteredServices = services.filter(service => 
    service.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.className.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Standard Services</h1>
            <p className="text-muted-foreground">Manage standard ATM services and APIs</p>
          </div>
          <Button onClick={fetchStandards} variant="outline" className="bg-transparent">
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="p-4 border-destructive/30 bg-destructive/10 text-destructive text-sm">
            {error}
          </Card>
        )}

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by field name or class name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <div className="text-sm text-muted-foreground py-2">
            {isLoading ? 'Loading standards...' : `Total Services: ${filteredServices.length} / ${services.length}`}
          </div>
        </div>

        {/* Services Table */}
        <Card className="overflow-hidden transition-none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm transition-none">
              <thead className="bg-card/50 border-b border-border transition-none">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">recId</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">fieldId</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">fieldLength</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">fieldName</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">className</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="border-b border-border transition-none">
                      <td className="px-6 py-4"><Skeleton className="h-4 w-28 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-32 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-28 bg-muted/60" /></td>
                    </tr>
                  ))
                ) : filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.recId} className="border-b border-border hover:bg-card/50 transition-none">
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{service.recId}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{service.fieldId}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{service.fieldLength}</td>
                      <td className="px-6 py-4 text-foreground">{service.fieldName}</td>
                      <td className="px-6 py-4 text-foreground">{service.className}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      {isLoading ? 'Loading standards...' : 'No services found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}