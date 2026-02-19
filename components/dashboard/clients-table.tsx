'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import { clientsApi, type Client } from '@/lib/api'
import { Users, AlertCircle, CheckCircle2 } from 'lucide-react'

const ClientsTable = () => {
  const [clientData, setClientData] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        setError(null)
        if (statusFilter === 'active') {
          const data = await clientsApi.getActive()
          setClientData(data)
        } else {
          const data = await clientsApi.getAll()
          setClientData(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch clients')
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [statusFilter])

  const filteredClients = clientData.filter(client => {
    const isInactive = client.active?.toLowerCase() === 'n'
    if (statusFilter === 'inactive') return isInactive
    if (statusFilter === 'active') return !isInactive
    return true
  })

  const activeCount = clientData.filter(c => c.active?.toLowerCase() !== 'n').length
  const inactiveCount = clientData.length - activeCount

  return (
    <Card className="border border-border bg-card overflow-hidden surface-elevated">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Client Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeCount} active &middot; {inactiveCount} inactive
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-1.5 bg-input border border-border rounded-lg text-foreground text-xs font-medium cursor-pointer hover:border-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">CLIENT NAME</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">BITMAP TYPE</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">ENCODING</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">ISO VERSION</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-40 bg-muted/60" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-28 bg-muted/60" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-muted/60" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-muted/60" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-20 bg-muted/60" /></td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8 text-destructive/60" />
                    <p className="text-sm text-destructive font-medium">Failed to load clients</p>
                    <p className="text-xs text-muted-foreground">{error}</p>
                  </div>
                </td>
              </tr>
            ) : filteredClients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground text-sm">No clients found</td>
              </tr>
            ) : (
              filteredClients.map((client, index) => {
                const isActive = client.active?.toLowerCase() !== 'n'
                return (
                  <tr key={index} className="hover:bg-muted/30 transition-colors duration-100">
                    <td className="px-6 py-3.5 font-medium text-foreground">{client.clientName}</td>
                    <td className="px-6 py-3.5 text-muted-foreground text-xs">{client.bitmapType}</td>
                    <td className="px-6 py-3.5 text-muted-foreground text-xs">{client.encoding}</td>
                    <td className="px-6 py-3.5 text-muted-foreground text-xs">{client.isoVersion}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        isActive
                          ? 'bg-chart-1/10 text-chart-1'
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {isActive
                          ? <CheckCircle2 className="w-3 h-3" />
                          : <AlertCircle className="w-3 h-3" />
                        }
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default ClientsTable
