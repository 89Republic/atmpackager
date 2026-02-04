'use client'

import { Card } from '@/components/ui/card'

interface Client {
  name: string
  responseTime: number
  errorRate: number
  status: 'active' | 'inactive' | 'blocked'
  lastActive: string
}

const clients: Client[] = [
  {
    name: 'ATM Network Alpha',
    responseTime: 145,
    errorRate: 0.05,
    status: 'active',
    lastActive: '2 minutes ago',
  },
  {
    name: 'ATM Network Beta',
    responseTime: 234,
    errorRate: 0.12,
    status: 'active',
    lastActive: '1 minute ago',
  },
  {
    name: 'ATM Network Gamma',
    responseTime: 312,
    errorRate: 0.23,
    status: 'inactive',
    lastActive: '3 minutes ago',
  },
  {
    name: 'ATM Network Delta',
    responseTime: 89,
    errorRate: 0.02,
    status: 'active',
    lastActive: '1 minute ago',
  },
  {
    name: 'ATM Network Epsilon',
    responseTime: 456,
    errorRate: 1.45,
    status: 'blocked',
    lastActive: '5 minutes ago',
  },
  {
    name: 'ATM Network Zeta',
    responseTime: 278,
    errorRate: 0.08,
    status: 'active',
    lastActive: '2 minutes ago',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-chart-1/10 text-chart-1'
    case 'inactive':
      return 'bg-chart-3/10 text-chart-3'
    case 'blocked':
      return 'bg-destructive/10 text-destructive'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return '● Active'
    case 'inactive':
      return '● Inactive'
    case 'blocked':
      return '● Blocked'
    default:
      return '● Unknown'
  }
}

export function ClientsTable() {
  return (
    <Card className="border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Clients</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time monitoring of all clients
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Client Name</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Response Time</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Error Rate</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Last Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clients.map((client, index) => (
              <tr key={index} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{client.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{client.responseTime}ms</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      client.errorRate > 1
                        ? 'bg-destructive/10 text-destructive'
                        : client.errorRate > 0.1
                          ? 'bg-chart-3/10 text-chart-3'
                          : 'bg-chart-1/10 text-chart-1'
                    }`}
                  >
                    {client.errorRate.toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                    {getStatusBadge(client.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{client.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}