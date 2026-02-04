'use client'

import { Card } from '@/components/ui/card'

interface Service {
  name: string
  responseTime: number
  errorRate: number
  status: 'healthy' | 'warning' | 'critical'
  lastUpdated: string
}

const services: Service[] = [
  {
    name: 'API Gateway',
    responseTime: 145,
    errorRate: 0.05,
    status: 'healthy',
    lastUpdated: '2 minutes ago',
  },
  {
    name: 'Authentication Service',
    responseTime: 234,
    errorRate: 0.12,
    status: 'healthy',
    lastUpdated: '1 minute ago',
  },
  {
    name: 'Database Service',
    responseTime: 312,
    errorRate: 0.23,
    status: 'warning',
    lastUpdated: '3 minutes ago',
  },
  {
    name: 'Cache Layer',
    responseTime: 89,
    errorRate: 0.02,
    status: 'healthy',
    lastUpdated: '1 minute ago',
  },
  {
    name: 'Message Queue',
    responseTime: 456,
    errorRate: 1.45,
    status: 'critical',
    lastUpdated: '5 minutes ago',
  },
  {
    name: 'Search Service',
    responseTime: 278,
    errorRate: 0.08,
    status: 'healthy',
    lastUpdated: '2 minutes ago',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'bg-chart-1/10 text-chart-1'
    case 'warning':
      return 'bg-chart-3/10 text-chart-3'
    case 'critical':
      return 'bg-destructive/10 text-destructive'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'healthy':
      return '● Healthy'
    case 'warning':
      return '● Warning'
    case 'critical':
      return '● Critical'
    default:
      return '● Unknown'
  }
}

export function ServicesTable() {
  return (
    <Card className="border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Services</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time monitoring of all services
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Service Name</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Response Time</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Error Rate</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((service, index) => (
              <tr key={index} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{service.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{service.responseTime}ms</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      service.errorRate > 1
                        ? 'bg-destructive/10 text-destructive'
                        : service.errorRate > 0.1
                          ? 'bg-chart-3/10 text-chart-3'
                          : 'bg-chart-1/10 text-chart-1'
                    }`}
                  >
                    {service.errorRate.toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    {getStatusBadge(service.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{service.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
