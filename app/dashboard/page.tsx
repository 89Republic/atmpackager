'use client'

import { MetricsCards } from '@/components/dashboard/metrics-cards'
import ClientsTable from '@/components/dashboard/clients-table'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Real-time overview of your ATM infrastructure</p>
      </div>
      <MetricsCards />
      <ClientsTable />
    </div>
  )
}
