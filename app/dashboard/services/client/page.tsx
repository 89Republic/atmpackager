'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ClientService {
  id: string
  clientName: string
  serviceType: string
  contractDate: string
  status: 'active' | 'inactive' | 'pending'
  monthlyFee: number
  lastBilling: string
}

export default function ClientServicesPage() {
  const [services, setServices] = useState<ClientService[]>([
    { id: '1', clientName: 'Bank of America', serviceType: 'Premium ATM Package', contractDate: '2024-01-15', status: 'active', monthlyFee: 5000, lastBilling: '2024-01-01' },
    { id: '2', clientName: 'Wells Fargo', serviceType: 'Standard ATM Package', contractDate: '2024-02-20', status: 'active', monthlyFee: 3000, lastBilling: '2024-01-01' },
    { id: '3', clientName: 'Chase Bank', serviceType: 'Enterprise ATM Package', contractDate: '2023-11-10', status: 'active', monthlyFee: 8000, lastBilling: '2024-01-01' },
    { id: '4', clientName: 'Citibank', serviceType: 'Basic ATM Package', contractDate: '2023-09-05', status: 'inactive', monthlyFee: 2000, lastBilling: '2023-12-01' },
    { id: '5', clientName: 'US Bank', serviceType: 'Standard ATM Package', contractDate: '2024-03-01', status: 'pending', monthlyFee: 3500, lastBilling: 'N/A' },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    clientName: '',
    serviceType: '',
    status: 'active' as 'active' | 'inactive' | 'pending',
    monthlyFee: 0,
  })

  const filteredServices = services.filter(service => 
    service.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateService = () => {
    if (!formData.clientName || !formData.serviceType) {
      alert('Please fill in all required fields')
      return
    }

    const newService: ClientService = {
      id: Date.now().toString(),
      ...formData,
      contractDate: new Date().toISOString().split('T')[0],
      lastBilling: formData.status === 'active' ? new Date().toISOString().split('T')[0] : 'N/A',
    }

    setServices([...services, newService])
    setFormData({ clientName: '', serviceType: '', status: 'active', monthlyFee: 0 })
    setShowCreateForm(false)
  }

  const handleEditService = (service: ClientService) => {
    setFormData({
      clientName: service.clientName,
      serviceType: service.serviceType,
      status: service.status,
      monthlyFee: service.monthlyFee,
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

    setFormData({ clientName: '', serviceType: '', status: 'active', monthlyFee: 0 })
    setEditingId(null)
    setShowEditForm(false)
  }

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this client service?')) {
      setServices(services.filter(service => service.id !== id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400'
      case 'inactive':
        return 'bg-red-500/20 text-red-400'
      case 'pending':
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
            <h1 className="text-3xl font-bold text-foreground">Client Services</h1>
            <p className="text-muted-foreground">Manage client-specific ATM service packages</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-primary hover:bg-primary/90">
            + New Client Service
          </Button>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || showEditForm) && (
          <Card className="p-6 bg-card/50 border-primary/30">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                {showEditForm ? 'Edit Client Service' : 'Create New Client Service'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Client Name *</label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Bank/Institution Name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Service Type *</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                  >
                    <option value="">Select Service Type</option>
                    <option value="Basic ATM Package">Basic ATM Package</option>
                    <option value="Standard ATM Package">Standard ATM Package</option>
                    <option value="Premium ATM Package">Premium ATM Package</option>
                    <option value="Enterprise ATM Package">Enterprise ATM Package</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Monthly Fee ($)</label>
                  <Input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: parseInt(e.target.value) })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'pending' })}
                    className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
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
                    setFormData({ clientName: '', serviceType: '', status: 'active', monthlyFee: 0 })
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
            placeholder="Search by client name or service type..."
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
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Client Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Service Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Contract Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Monthly Fee</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Last Billing</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="border-b border-border hover:bg-card/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{service.clientName}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{service.serviceType}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{service.contractDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-foreground">${service.monthlyFee}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{service.lastBilling}</td>
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
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                      No client services found
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