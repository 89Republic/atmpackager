'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Zap, AlertTriangle, Users, Activity } from 'lucide-react'

interface MetricCard {
  label: string
  value: string | number
  unit?: string
  trend?: number
  description: string
  icon: React.ElementType
  variant: 'primary' | 'success' | 'warning' | 'info'
}

const metrics: MetricCard[] = [
  {
    label: 'Response Time',
    value: '245',
    unit: 'ms',
    trend: -12,
    description: 'Avg. over last hour',
    icon: Zap,
    variant: 'primary',
  },
  {
    label: 'Error Rate',
    value: '0.23',
    unit: '%',
    trend: 5,
    description: 'Above normal threshold',
    icon: AlertTriangle,
    variant: 'warning',
  },
  {
    label: 'Active Clients',
    value: '2,847',
    trend: 23,
    description: 'Connected this session',
    icon: Users,
    variant: 'success',
  },
  {
    label: 'Throughput',
    value: '15,420',
    unit: '/min',
    trend: 8,
    description: 'Transactions per minute',
    icon: Activity,
    variant: 'info',
  },
]

const variantStyles = {
  primary: {
    icon: 'bg-primary/10 text-primary',
    trend: { up: 'text-primary', down: 'text-primary' },
    bar: 'bg-primary',
  },
  success: {
    icon: 'bg-chart-1/10 text-chart-1',
    trend: { up: 'text-chart-1', down: 'text-chart-1' },
    bar: 'bg-chart-1',
  },
  warning: {
    icon: 'bg-chart-3/10 text-chart-3',
    trend: { up: 'text-destructive', down: 'text-chart-1' },
    bar: 'bg-chart-3',
  },
  info: {
    icon: 'bg-chart-2/10 text-chart-2',
    trend: { up: 'text-chart-2', down: 'text-chart-2' },
    bar: 'bg-chart-2',
  },
}

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const style = variantStyles[metric.variant]
        const isPositive = (metric.trend ?? 0) >= 0
        const trendColor = isPositive ? style.trend.up : style.trend.down
        const Icon = metric.icon
        return (
          <Card
            key={index}
            className="relative overflow-hidden border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 surface-elevated group cursor-default"
          >
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${style.bar} opacity-60`} />

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground truncate">
                  {metric.label}
                </p>
                <div className="flex items-baseline gap-1.5 mt-2.5">
                  <p className="text-3xl font-bold text-foreground tracking-tight">{metric.value}</p>
                  {metric.unit && (
                    <span className="text-sm font-medium text-muted-foreground">{metric.unit}</span>
                  )}
                </div>
                {metric.trend !== undefined && (
                  <div className={`flex items-center gap-1 mt-2.5 ${trendColor}`}>
                    {isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span className="text-xs font-semibold">
                      {isPositive ? '+' : ''}{metric.trend}%
                    </span>
                    <span className="text-xs text-muted-foreground font-normal">vs last hour</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground/70 mt-1.5">{metric.description}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${style.icon} transition-transform duration-200 group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
