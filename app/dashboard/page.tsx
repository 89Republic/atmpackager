'use client'

import { MetricsCards } from '@/components/dashboard/metrics-cards'
import ClientsTable from '@/components/dashboard/clients-table'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your ATM monitoring dashboard</p>
      </div>

      <MetricsCards />
      <ClientsTable />
    </div>
  )
}
