'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface MappingService {
  id: string
  routeName: string
  sourceNetwork: string
  targetNetwork: string
  protocol: string
  status: 'active' | 'inactive' | 'maintenance'
  latency: string
  created: string
}

export default function MappingServicesPage() {
  const [services, setServices] = useState<MappingService[]>([
    { id: '1', routeName: 'Main-Branch-Network', sourceNetwork: '192.168.1.0/24', targetNetwork: '10.0.1.0/24', protocol: 'TCP/IP', status: 'active', latency: '12ms', created: '2024-01-15' },
    { id: '2', routeName: 'ATM-Cluster-East', sourceNetwork: '192.168.2.0/24', targetNetwork: '10.0.2.0/24', protocol: 'TCP/IP', status: 'active', latency: '8ms', created: '2024-02-20' },
    { id: '3', routeName: 'ATM-Cluster-West', sourceNetwork: '192.168.3.0/24', targetNetwork: '10.0.3.0/24', protocol: 'TCP/IP', status: 'maintenance', latency: '15ms', created: '2023-11-10' },
    { id: '4', routeName: 'Mobile-Gateway', sourceNetwork: '172.16.0.0/16', targetNetwork: '10.1.0.0/16', protocol: 'HTTPS', status: 'active', latency: '25ms', created: '2023-09-05' },
    { id: '5', routeName: 'Backup-Route', sourceNetwork: '192.168.10.0/24', targetNetwork: '10.0.10.0/24', protocol: 'TCP/IP', status: 'inactive', latency: 'N/A', created: '2024-03-01' },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    routeName: '',
    sourceNetwork: '',
    targetNetwork: '',
    protocol: 'TCP/IP',
    status: 'active' as 'active' | 'inactive' | 'maintenance',
  })

  const filteredServices = services.filter(service => 
    service.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.sourceNetwork.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.targetNetwork.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateService = () => {
    if (!formData.routeName || !formData.sourceNetwork || !formData.targetNetwork) {
      alert('Please fill in all required fields')
      return
    }

    const newService: MappingService = {
      id: Date.now().toString(),
      ...formData,
      latency: formData.status === 'active' ? '0ms' : 'N/A',
      created: new Date().toISOString().split('T')[0],
    }

    setServices([...services, newService])
    setFormData({ routeName: '', sourceNetwork: '', targetNetwork: '', protocol: 'TCP/IP', status: 'active' })
    setShowCreateForm(false)
  }

  const handleEditService = (service: MappingService) => {
    setFormData({
      routeName: service.routeName,
      sourceNetwork: service.sourceNetwork,
      targetNetwork: service.targetNetwork,
      protocol: service.protocol,
      status: service.status,
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

    setFormData({ routeName: '', sourceNetwork: '', targetNetwork: '', protocol: 'TCP/IP', status: 'active' })
    setEditingId(null)
    setShowEditForm(false)
  }

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this mapping route?')) {
      setServices(services.filter(service => service.id !== id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400'
      case 'inactive':
        return 'bg-red-500/20 text-red-400'
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Mapping Services</h1>
            <p className="text-muted-foreground">Manage ATM network routing and mapping configurations</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-primary hover:bg-primary/90">
            + New Mapping Route
          </Button>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || showEditForm) && (
          <Card className="p-6 bg-card/50 border-primary/30">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                {showEditForm ? 'Edit Mapping Route' : 'Create New Mapping Route'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Route Name *</label>
                  <Input
                    value={formData.routeName}
                    onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                    placeholder="Main-Branch-Network"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Protocol</label>
                  <select
                    value={formData.protocol}
                    onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                  >
                    <option value="TCP/IP">TCP/IP</option>
                    <option value="HTTPS">HTTPS</option>
                    <option value="VPN">VPN</option>
                    <option value="MPLS">MPLS</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Source Network *</label>
                  <Input
                    value={formData.sourceNetwork}
                    onChange={(e) => setFormData({ ...formData, sourceNetwork: e.target.value })}
                    placeholder="192.168.1.0/24"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Target Network *</label>
                  <Input
                    value={formData.targetNetwork}
                    onChange={(e) => setFormData({ ...formData, targetNetwork: e.target.value })}
                    placeholder="10.0.1.0/24"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'maintenance' })}
                    className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={showEditForm ? handleUpdateService : handleCreateService}
                  className="bg-primary hover:bg-primary/90"
                >
                  {showEditForm ? 'Update Route' : 'Create Route'}
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateForm(false)
                    setShowEditForm(false)
                    setFormData({ routeName: '', sourceNetwork: '', targetNetwork: '', protocol: 'TCP/IP', status: 'active' })
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
            placeholder="Search by route name or network..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <div className="text-sm text-muted-foreground py-2">
            Total Routes: {filteredServices.length} / {services.length}
          </div>
        </div>

        {/* Services Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-card/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Route Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Source Network</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Target Network</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Protocol</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Latency</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Created</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="border-b border-border hover:bg-card/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{service.routeName}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{service.sourceNetwork}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{service.targetNetwork}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{service.protocol}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-foreground">{service.latency}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{service.created}</td>
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
                    <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                      No mapping routes found
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