'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { Card } from '@/components/ui/card'

export default function AnalyticsPage() {
  const metrics = [
    { title: 'Total Requests', value: '1.2M', change: '+12.5%', trend: 'up' },
    { title: 'Avg Response Time', value: '245ms', change: '-8.3%', trend: 'down' },
    { title: 'Error Rate', value: '0.23%', change: '+0.01%', trend: 'up' },
    { title: 'P99 Latency', value: '1.2s', change: '-5.2%', trend: 'down' },
  ]

  const timeSeriesData = [
    { time: '00:00', requests: 45000, errors: 120 },
    { time: '04:00', requests: 52000, errors: 95 },
    { time: '08:00', requests: 78000, errors: 230 },
    { time: '12:00', requests: 95000, errors: 180 },
    { time: '16:00', requests: 87000, errors: 210 },
    { time: '20:00', requests: 65000, errors: 140 },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Detailed performance metrics and trends</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <Card key={i} className="p-4">
              <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change}
                </span>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Request Volume & Errors Over Time</h2>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Time</th>
                    <th className="text-right py-2 px-2 text-muted-foreground font-medium">Requests</th>
                    <th className="text-right py-2 px-2 text-muted-foreground font-medium">Errors</th>
                    <th className="text-right py-2 px-2 text-muted-foreground font-medium">Error Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSeriesData.map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2 text-foreground">{row.time}</td>
                      <td className="py-3 px-2 text-right text-foreground font-medium">{row.requests.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right text-foreground">{row.errors}</td>
                      <td className="py-3 px-2 text-right text-muted-foreground">
                        {((row.errors / row.requests) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Top Endpoints by Volume</h2>
            <div className="space-y-3">
              {[
                { endpoint: '/api/users', requests: 245000, percentage: 65 },
                { endpoint: '/api/products', requests: 98000, percentage: 26 },
                { endpoint: '/api/orders', requests: 32000, percentage: 8 },
                { endpoint: '/api/analytics', requests: 2500, percentage: 1 },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{item.endpoint}</span>
                    <span className="text-muted-foreground">{item.requests.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Error Distribution</h2>
            <div className="space-y-3">
              {[
                { error: '500 Internal Server Error', count: 145, percentage: 45 },
                { error: '502 Bad Gateway', count: 98, percentage: 30 },
                { error: '503 Service Unavailable', count: 65, percentage: 20 },
                { error: '504 Gateway Timeout', count: 15, percentage: 5 },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{item.error}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
