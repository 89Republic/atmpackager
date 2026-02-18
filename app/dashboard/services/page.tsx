'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'

const serviceTypes = [
  {
    name: 'ISO Standards',
    description: 'Manage standard ATM services and configurations',
    href: '/dashboard/services/standard',
    icon: '⚙️'
  },
  {
    name: 'Client Config',
    description: 'Manage client-specific ATM services and accounts',
    href: '/dashboard/services/client',
    icon: '👥'
  },
  {
    name: 'Mapping',
    description: 'Manage ATM network mapping and routing services',
    href: '/dashboard/services/mapping',
    icon: '🗺️'
  }
]

export default function ServicesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Services</h1>
        <p className="text-muted-foreground">Choose a service type to manage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceTypes.map((service) => (
          <Link key={service.name} href={service.href}>
            <Card className="p-6 hover:bg-accent/50 transition-colors cursor-pointer border-2 hover:border-primary/30">
              <div className="text-center space-y-4">
                <div className="text-4xl">{service.icon}</div>
                <h3 className="text-xl font-semibold text-foreground">{service.name}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
