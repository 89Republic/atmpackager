'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'pending'
  machines: number
  joinDate: string
}

export default function ServiceTypePage() {
  const params = useParams()
  const serviceType = params?.serviceType as string
  
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Bank of America', email: 'contact@bofa.com', phone: '+1-800-123-4567', status: 'active', machines: 245, joinDate: '2024-01-15' },
    { id: '2', name: 'Wells Fargo', email: 'support@wellsfargo.com', phone: '+1-800-869-3557', status: 'active', machines: 189, joinDate: '2024-02-20' },
    { id: '3', name: 'Chase Bank', email: 'admin@chase.com', phone: '+1-800-935-9935', status: 'active', machines: 312, joinDate: '2023-11-10' },
    { id: '4', name: 'Citibank', email: 'info@citibank.com', phone: '+1-800-627-2628', status: 'inactive', machines: 156, joinDate: '2023-09-05' },
    { id: '5', name: 'US Bank', email: 'support@usbank.com', phone: '+1-800-285-8585', status: 'pending', machines: 78, joinDate: '2024-03-01' },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive' | 'pending',
    machines: 0,
  })

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateClient = () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields')
      return
    }

    const newClient: Client = {
      id: Date.now().toString(),
      ...formData,
      joinDate: new Date().toISOString().split('T')[0],
    }

    setClients([...clients, newClient])
    setFormData({ name: '', email: '', phone: '', status: 'active' as 'active' | 'inactive' | 'pending', machines: 0 })
    setShowCreateForm(false)
  }

  const handleEditClient = (client: Client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      status: client.status,
      machines: client.machines,
    })
    setEditingId(client.id)
    setShowEditForm(true)
  }

  const handleUpdateClient = () => {
    if (!editingId) return

    setClients(clients.map(client =>
      client.id === editingId
        ? { ...client, ...formData }
        : client
    ))

    setFormData({ name: '', email: '', phone: '', status: 'active' as 'active' | 'inactive' | 'pending', machines: 0 })
    setEditingId(null)
    setShowEditForm(false)
  }

  const handleDeleteClient = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client.id !== id))
    }
  }

  const handleGetClientById = (id: string) => {
    const client = clients.find(c => c.id === id)
    if (client) {
      alert(`Client Details:\n\nName: ${client.name}\nEmail: ${client.email}\nPhone: ${client.phone}\nStatus: ${client.status}\nMachines: ${client.machines}\nJoin Date: ${client.joinDate}`)
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

  const getServiceTypeTitle = (type: string) => {
    switch (type) {
      case 'standard':
        return 'Standard Service Management'
      case 'client':
        return 'Client Service Management'
      case 'mapping':
        return 'Mapping Service Management'
      default:
        return 'Service Management'
    }
  }

  const getServiceTypeDescription = (type: string) => {
    switch (type) {
      case 'standard':
        return 'Manage standard ATM services and configurations'
      case 'client':
        return 'Manage client-specific ATM services and accounts'
      case 'mapping':
        return 'Manage ATM network mapping and routing services'
      default:
        return 'Manage ATM services'
    }
  }

  if (!serviceType || !['standard', 'client', 'mapping'].includes(serviceType)) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Service Not Found</h1>
          <p className="text-muted-foreground">The requested service type is not available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              {getServiceTypeTitle(serviceType)}
            </h1>
            <p className="text-muted-foreground">{getServiceTypeDescription(serviceType)}</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-primary hover:bg-primary/90">
            + New Client
          </Button>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || showEditForm) && (
          <Card className="p-6 bg-card/50 border-primary/30">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                {showEditForm ? 'Edit Client' : 'Create New Client'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Client Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Bank/Financial Institution name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@bank.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1-800-XXX-XXXX"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Number of Machines</label>
                  <Input
                    type="number"
                    value={formData.machines}
                    onChange={(e) => setFormData({ ...formData, machines: parseInt(e.target.value) })}
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
                  onClick={showEditForm ? handleUpdateClient : handleCreateClient}
                  className="bg-primary hover:bg-primary/90"
                >
                  {showEditForm ? 'Update Client' : 'Create Client'}
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateForm(false)
                    setShowEditForm(false)
                    setFormData({ name: '', email: '', phone: '', status: 'active' as 'active' | 'inactive' | 'pending', machines: 0 })
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

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by client name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive' | 'pending')}
            className="px-4 py-2 bg-input border border-border rounded-md text-foreground text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <div className="text-sm text-muted-foreground py-2">
            Total Clients: {filteredClients.length} / {clients.length}
          </div>
        </div>

        {/* Clients Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-card/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Client Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Phone</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Machines</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Join Date</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="border-b border-border hover:bg-card/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{client.name}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{client.email}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{client.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-foreground">{client.machines}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{client.joinDate}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGetClientById(client.id)}
                            className="bg-transparent text-xs"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClient(client)}
                            className="bg-transparent text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClient(client.id)}
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
                      No clients found
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