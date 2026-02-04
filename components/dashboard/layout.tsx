'use client'

import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { MetricsCards } from '@/components/dashboard/metrics-cards'
import { ServicesTable } from '@/components/dashboard/services-table'

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-8 space-y-8">
            {/* Page Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to your ATM monitoring dashboard</p>
            </div>

            {/* Metrics Cards */}
            <MetricsCards />

            {/* Services Table */}
            <ServicesTable />
          </div>
        </main>
      </div>
    </div>
  )
}
