'use client'

import { Card } from '@/components/ui/card'

interface MetricCard {
  label: string
  value: string | number
  unit?: string
  trend?: number
  icon: string
  color: 'primary' | 'accent' | 'chart-1' | 'chart-2'
}

const metrics: MetricCard[] = [
  {
    label: 'Response Time',
    value: 245,
    unit: 'ms',
    trend: -12,
    icon: '⚡',
    color: 'primary',
  },
  {
    label: 'Error Rate',
    value: 0.23,
    unit: '%',
    trend: 5,
    icon: '⚠️',
    color: 'chart-1',
  },
  {
    label: 'Active Users',
    value: 2847,
    trend: 23,
    icon: '👥',
    color: 'accent',
  },
  {
    label: 'Throughput',
    value: 15420,
    unit: '/min',
    trend: 8,
    icon: '📊',
    color: 'chart-2',
  },
]

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="border border-border bg-card p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">{metric.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                {metric.unit && <span className="text-sm text-muted-foreground">{metric.unit}</span>}
              </div>
              {metric.trend !== undefined && (
                <p
                  className={`text-xs mt-2 font-medium ${
                    metric.trend >= 0
                      ? metric.label === 'Error Rate'
                        ? 'text-destructive'
                        : 'text-chart-1'
                      : 'text-chart-1'
                  }`}
                >
                  {metric.trend >= 0 ? '+' : ''}{metric.trend}% from last hour
                </p>
              )}
            </div>
            <div
              className={`text-3xl p-3 rounded-lg bg-${metric.color}/10`}
            >
              {metric.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
