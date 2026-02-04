'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface StandardService {
  id: string
  name: string
  endpoint: string
  version: string
  status: 'running' | 'stopped' | 'error'
  uptime: string
  description: string
}

export default function StandardServicesPage() {
  const [services, setServices] = useState<StandardService[]>([
    { id: '1', name: 'Authentication API', endpoint: '/api/auth', version: '1.2.0', status: 'running', uptime: '99.9%', description: 'Core authentication service' },
    { id: '2', name: 'Transaction API', endpoint: '/api/transactions', version: '2.1.5', status: 'running', uptime: '99.8%', description: 'ATM transaction processing' },
    { id: '3', name: 'Balance API', endpoint: '/api/balance', version: '1.5.2', status: 'running', uptime: '99.7%', description: 'Account balance inquiries' },
    { id: '4', name: 'Card Validation API', endpoint: '/api/cards', version: '1.0.8', status: 'stopped', uptime: '95.2%', description: 'Card validation and verification' },
    { id: '5', name: 'Logging Service', endpoint: '/api/logs', version: '3.0.1', status: 'running', uptime: '99.9%', description: 'System logging and monitoring' },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    endpoint: '',
    version: '',
    status: 'running' as 'running' | 'stopped' | 'error',
    description: '',
  })

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateService = () => {
    if (!formData.name || !formData.endpoint) {
      alert('Please fill in all required fields')
      return
    }

    const newService: StandardService = {
      id: Date.now().toString(),
      ...formData,
      uptime: '100%',
    }

    setServices([...services, newService])
    setFormData({ name: '', endpoint: '', version: '', status: 'running', description: '' })
    setShowCreateForm(false)
  }

  const handleEditService = (service: StandardService) => {
    setFormData({
      name: service.name,
      endpoint: service.endpoint,
      version: service.version,
      status: service.status,
      description: service.description,
    })
    setEditingId(service.id)
    setShowEditForm(true)
  }

  const handleUpdateService = () => {
    if (!editingId) return

    setServices(services.map(service =>
      service.id === editingId
        ? { ...service, ...formData }
        : service
    ))

    setFormData({ name: '', endpoint: '', version: '', status: 'running', description: '' })
    setEditingId(null)
    setShowEditForm(false)
  }

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/20 text-green-400'
      case 'stopped':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'error':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Standard Services</h1>
            <p className="text-muted-foreground">Manage standard ATM services and APIs</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-primary hover:bg-primary/90">
            + New Service
          </Button>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || showEditForm) && (
          <Card className="p-6 bg-card/50 border-primary/30">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                {showEditForm ? 'Edit Service' : 'Create New Service'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Service Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Authentication API"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Endpoint *</label>
                  <Input
                    value={formData.endpoint}
                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                    placeholder="/api/service"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Version</label>
                  <Input
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="1.0.0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'running' | 'stopped' | 'error' })}
                    className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                  >
                    <option value="running">Running</option>
                    <option value="stopped">Stopped</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Service description"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={showEditForm ? handleUpdateService : handleCreateService}
                  className="bg-primary hover:bg-primary/90"
                >
                  {showEditForm ? 'Update Service' : 'Create Service'}
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateForm(false)
                    setShowEditForm(false)
                    setFormData({ name: '', endpoint: '', version: '', status: 'running', description: '' })
                    setEditingId(null)
                  }}
                  variant="outline"
                  className="bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by service name or endpoint..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <div className="text-sm text-muted-foreground py-2">
            Total Services: {filteredServices.length} / {services.length}
          </div>
        </div>

        {/* Services Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-card/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Service Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Endpoint</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Version</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Uptime</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="border-b border-border hover:bg-card/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-foreground">{service.name}</div>
                          <div className="text-xs text-muted-foreground">{service.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{service.endpoint}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{service.version}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-foreground">{service.uptime}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditService(service)}
                            className="bg-transparent text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteService(service.id)}
                            className="bg-transparent text-xs text-destructive hover:bg-destructive/10"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No services found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}