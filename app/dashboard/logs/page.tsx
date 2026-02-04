'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function LogsPage() {
  const logs = [
    {
      id: 1,
      timestamp: '2024-02-04 15:45:23',
      service: 'API Gateway',
      level: 'ERROR',
      message: 'Connection timeout to database service after 30s',
    },
    {
      id: 2,
      timestamp: '2024-02-04 15:44:12',
      service: 'Auth Service',
      level: 'WARN',
      message: 'High memory usage detected - 87% threshold exceeded',
    },
    {
      id: 3,
      timestamp: '2024-02-04 15:43:55',
      service: 'Cache Layer',
      level: 'INFO',
      message: 'Cache invalidated for user sessions - cleanup successful',
    },
    {
      id: 4,
      timestamp: '2024-02-04 15:43:20',
      service: 'Message Queue',
      level: 'ERROR',
      message: 'Failed to process message batch: invalid JSON format',
    },
    {
      id: 5,
      timestamp: '2024-02-04 15:42:45',
      service: 'Search Service',
      level: 'INFO',
      message: 'Index rebuild completed successfully in 2.4s',
    },
    {
      id: 6,
      timestamp: '2024-02-04 15:42:12',
      service: 'Database',
      level: 'WARN',
      message: 'Query execution time exceeded threshold: 5.2s on table users',
    },
    {
      id: 7,
      timestamp: '2024-02-04 15:41:38',
      service: 'Load Balancer',
      level: 'INFO',
      message: 'Health check passed for all backend servers',
    },
    {
      id: 8,
      timestamp: '2024-02-04 15:41:15',
      service: 'Payment Service',
      level: 'ERROR',
      message: 'Credit card validation failed for transaction TX_9384756',
    },
    {
      id: 9,
      timestamp: '2024-02-04 15:40:52',
      service: 'File Storage',
      level: 'WARN',
      message: 'Disk space usage at 92% - cleanup recommended',
    },
    {
      id: 10,
      timestamp: '2024-02-04 15:40:30',
      service: 'Notification Service',
      level: 'INFO',
      message: 'Email notification sent successfully to 1,247 users',
    },
    {
      id: 11,
      timestamp: '2024-02-04 15:39:58',
      service: 'Analytics Engine',
      level: 'INFO',
      message: 'Daily report generation started for 2024-02-04',
    },
    {
      id: 12,
      timestamp: '2024-02-04 15:39:22',
      service: 'Security Scanner',
      level: 'WARN',
      message: 'Suspicious login attempt from IP 192.168.1.254',
    },
    {
      id: 13,
      timestamp: '2024-02-04 15:38:45',
      service: 'Backup Service',
      level: 'INFO',
      message: 'Incremental backup completed - 2.3GB processed',
    },
    {
      id: 14,
      timestamp: '2024-02-04 15:38:12',
      service: 'ATM Controller',
      level: 'ERROR',
      message: 'ATM_001 connection lost - attempting reconnection',
    },
    {
      id: 15,
      timestamp: '2024-02-04 15:37:58',
      service: 'Transaction Engine',
      level: 'INFO',
      message: 'Transaction TXN_456789 processed successfully - $250.00',
    },
    {
      id: 16,
      timestamp: '2024-02-04 15:37:33',
      service: 'Monitoring Service',
      level: 'INFO',
      message: 'System health check completed - all services operational',
    },
    {
      id: 17,
      timestamp: '2024-02-04 15:36:45',
      service: 'ATM Controller',
      level: 'WARN',
      message: 'Cash dispenser low on $20 bills - refill needed soon',
    },
    {
      id: 18,
      timestamp: '2024-02-04 15:36:12',
      service: 'API Gateway',
      level: 'INFO',
      message: 'Rate limit enforced for client 192.168.50.100',
    },
    {
      id: 19,
      timestamp: '2024-02-04 15:35:55',
      service: 'User Service',
      level: 'ERROR',
      message: 'Failed to update user profile for user_id: 12845',
    },
    {
      id: 20,
      timestamp: '2024-02-04 15:35:20',
      service: 'Audit Logger',
      level: 'INFO',
      message: 'Admin action logged: password reset for user admin@company.com',
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
          <span>Showing 20 of 3,847 logs</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 hover:bg-muted rounded transition-colors">Previous</button>
            <button className="px-3 py-1 bg-muted rounded">1</button>
            <button className="px-3 py-1 hover:bg-muted rounded transition-colors">2</button>
            <button className="px-3 py-1 hover:bg-muted rounded transition-colors">3</button>
            <button className="px-3 py-1 hover:bg-muted rounded transition-colors">Next</button>
          </div>
        </div>
    </div>
  )
}
