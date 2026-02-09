'use client'

import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { clientsApi, type Client } from '@/lib/api'

const ClientsTable = () => {
  const [clientData, setClientData] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const data = await clientsApi.getAll()
        setClientData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch clients')
        console.error('Error fetching clients:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  return (
    <Card className="border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Clients</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time monitoring of all clients
        </p>
      </div>

      {loading ? (
        <div className="px-6 py-8 text-center text-muted-foreground">
          Loading clients...
        </div>
      ) : error ? (
        <div className="px-6 py-8 text-center text-destructive">
          Error: {error}
        </div>
      ) : clientData.length === 0 ? (
        <div className="px-6 py-8 text-center text-muted-foreground">
          No clients found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Client Name</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Bitmap Type</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Encoding</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">ISO Version</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clientData.map((client, index) => (
                <tr key={index} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{client.clientName}</td>
                  <td className="px-6 py-4 text-muted-foreground">{client.bitmapType}</td>
                  <td className="px-6 py-4">{client.encoding}</td>
                  <td className="px-6 py-4">{client.isoVersion}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.active)}`}>
                      {getStatusBadge(client.active)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

const getStatusColor = (active: string) => {
  if (active === 'Y') {
    return 'bg-chart-1/10 text-chart-1'
  } else {
    return 'bg-destructive/10 text-destructive'
  }
}

const getStatusBadge = (active: string) => {
  if (active === 'Y') {
    return '● Active'
  } else {
    return '● Inactive'
  }
}

export default ClientsTable