'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function LogsPage() {
  const logs = [
    {
      id: 1,
      timestamp: '2024-01-15 14:32:45',
      service: 'API Gateway',
      level: 'ERROR',
      message: 'Connection timeout to database service',
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:32:12',
      service: 'Auth Service',
      level: 'WARN',
      message: 'High memory usage detected - 85%',
    },
    {
      id: 3,
      timestamp: '2024-01-15 14:31:55',
      service: 'Cache Layer',
      level: 'INFO',
      message: 'Cache invalidated for user sessions',
    },
    {
      id: 4,
      timestamp: '2024-01-15 14:31:20',
      service: 'Message Queue',
      level: 'ERROR',
      message: 'Failed to process message batch',
    },
    {
      id: 5,
      timestamp: '2024-01-15 14:30:45',
      service: 'Search Service',
      level: 'INFO',
      message: 'Index rebuild completed successfully',
    },
    {
      id: 6,
      timestamp: '2024-01-15 14:30:12',
      service: 'Database',
      level: 'WARN',
      message: 'Query execution time exceeded threshold',
    },
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'bg-red-500/20 text-red-400'
      case 'WARN':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'INFO':
        return 'bg-blue-500/20 text-blue-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">System Logs</h1>
          <p className="text-muted-foreground">Real-time monitoring of all system events</p>
        </div>

        <Card className="p-4">
          <Input placeholder="Search logs..." className="bg-muted/50" />
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Timestamp</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Service</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Level</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Message</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-4 text-foreground font-medium">{log.service}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground max-w-md truncate">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing 6 of 1,245 logs</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 hover:bg-muted rounded transition-colors">Previous</button>
            <button className="px-3 py-1 bg-muted rounded">1</button>
            <button className="px-3 py-1 hover:bg-muted rounded transition-colors">2</button>
            <button className="px-3 py-1 hover:bg-muted rounded transition-colors">3</button>
            <button className="px-3 py-1 hover:bg-muted rounded transition-colors">Next</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
