'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { clientsApi, type Client } from '@/lib/api'
import Swal from 'sweetalert2'
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationPrevious, 
  PaginationNext,
  PaginationEllipsis 
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RefreshCw } from 'lucide-react'

type ClientForm = Omit<Client, 'clientId'> & { clientId: string }

interface StandardField {
  recId: number
  fieldId: number
  fieldLength: number
  fieldName: string
  className: string
}

interface StandardEditForm {
  clientId: string
  fieldLength: string
  fieldName: string
  className: string
}

export default function ClientServicesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [editingClientName, setEditingClientName] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [standards, setStandards] = useState<StandardField[]>([])
  const [standardsLoading, setStandardsLoading] = useState(false)
  const [standardsError, setStandardsError] = useState<string | null>(null)
  const [selectedConfigClientId, setSelectedConfigClientId] = useState('')
  const [uploadedXmlFileName, setUploadedXmlFileName] = useState('')
  const [editingStandardRecId, setEditingStandardRecId] = useState<number | null>(null)
  const [standardEditForm, setStandardEditForm] = useState<StandardEditForm>({
    clientId: '',
    fieldLength: '',
    fieldName: '',
    className: '',
  })
  const [isSavingStandardConfig, setIsSavingStandardConfig] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [formData, setFormData] = useState<ClientForm>({
    clientId: '',
    clientName: '',
    isoVersion: '',
    encoding: '',
    bitmapType: '',
    active: 'Y',
  })

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError(null)
      if (statusFilter === 'active') {
        const data = await clientsApi.getActive()
        setClients(data)
      } else {
        const data = await clientsApi.getAll()
        setClients(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [statusFilter])

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.bitmapType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.encoding.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.isoVersion.toLowerCase().includes(searchTerm.toLowerCase())

    const normalizedActive = client.active?.toLowerCase()
    const isInactive = normalizedActive === 'n' || normalizedActive === 'false'
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !isInactive) ||
      (statusFilter === 'inactive' && isInactive)

    return matchesSearch && matchesStatus
  })

  const sortedClients = [...filteredClients].sort((a, b) => {
    const aId = a.clientId ?? Number.POSITIVE_INFINITY
    const bId = b.clientId ?? Number.POSITIVE_INFINITY
    return aId - bId
  })

  const nextClientIdPreview =
    clients
      .map((client) => client.clientId)
      .filter((clientId): clientId is number => typeof clientId === 'number')
      .reduce((maxId, clientId) => Math.max(maxId, clientId), 0) + 1

  // Pagination calculations
  const totalItems = sortedClients.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentClients = sortedClients.slice(startIndex, endIndex)

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      const startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, currentPage + 2)

      if (startPage > 1) {
        pages.push(
          <PaginationItem key={1}>
            <PaginationLink
              isActive={false}
              onClick={() => handlePageChange(1)}
              className="cursor-pointer"
            >
              1
            </PaginationLink>
          </PaginationItem>
        )
        if (startPage > 2) {
          pages.push(
            <PaginationItem key="ellipsis-start">
              <PaginationEllipsis />
            </PaginationItem>
          )
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <PaginationItem key="ellipsis-end">
              <PaginationEllipsis />
            </PaginationItem>
          )
        }
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              isActive={false}
              onClick={() => handlePageChange(totalPages)}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )
      }
    }

    return pages
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'y':
      case 'true':
      case 'active':
        return 'bg-green-500/20 text-green-400'
      case 'n':
      case 'false':
      case 'inactive':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'y':
      case 'true':
        return 'Active'
      case 'n':
      case 'false':
        return 'Inactive'
      default:
        return status || '-'
    }
  }

  const handleCreateClient = async () => {
    if (!formData.clientName || !formData.isoVersion || !formData.encoding || !formData.bitmapType) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing information',
        text: 'Please fill in all required fields.',
      })
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      const payload: Client = {
        clientName: formData.clientName.trim(),
        isoVersion: formData.isoVersion.trim(),
        encoding: formData.encoding.trim(),
        bitmapType: formData.bitmapType.trim(),
        active: formData.active?.toLowerCase() === 'n' || formData.active?.toLowerCase() === 'false' ? 'N' : 'Y',
      }
      await clientsApi.create(payload)
      setShowCreateForm(false)
      setFormData({ clientId: '', clientName: '', isoVersion: '', encoding: '', bitmapType: '', active: 'Y' })
      await fetchClients()
      await Swal.fire({
        icon: 'success',
        title: 'Client created',
        text: `${payload.clientName} was added successfully.`,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create client'
      setError(message)
      await Swal.fire({
        icon: 'error',
        title: 'Create failed',
        text: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClient = (client: Client) => {
    const normalizedActive = client.active?.toLowerCase()
    setFormData({
      clientId: client.clientId ? String(client.clientId) : '',
      clientName: client.clientName,
      isoVersion: client.isoVersion,
      encoding: client.encoding,
      bitmapType: client.bitmapType,
      active: normalizedActive === 'n' || normalizedActive === 'false' ? 'N' : 'Y',
    })
    setEditingClientName(client.clientName)
    setShowEditForm(true)
    setShowCreateForm(false)
  }

  const handleUpdateClient = async () => {
    if (!editingClientName) return
    if (!formData.clientId || !/^[0-9]+$/.test(formData.clientId)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Invalid client ID',
        text: 'Please provide a valid client ID.',
      })
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      const payload: Client = {
        clientId: Number(formData.clientId),
        clientName: formData.clientName.trim(),
        isoVersion: formData.isoVersion.trim(),
        encoding: formData.encoding.trim(),
        bitmapType: formData.bitmapType.trim(),
        active: formData.active?.toLowerCase() === 'n' || formData.active?.toLowerCase() === 'false' ? 'N' : 'Y',
      }
      await clientsApi.update(payload)
      setShowEditForm(false)
      setEditingClientName(null)
      setFormData({ clientId: '', clientName: '', isoVersion: '', encoding: '', bitmapType: '', active: 'Y' })
      await fetchClients()
      await Swal.fire({
        icon: 'success',
        title: 'Client updated',
        text: `${payload.clientName} was updated successfully.`,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update client'
      setError(message)
      await Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClient = async (client: Client) => {
    if (!client.clientId) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing client ID',
        text: 'This client record has no ID and cannot be deleted.',
      })
      return
    }

    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete client?',
      text: `${client.clientName} will be removed permanently.`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      setIsSubmitting(true)
      setError(null)
      await clientsApi.remove(client.clientId)
      await fetchClients()
      await Swal.fire({
        icon: 'success',
        title: 'Client deleted',
        text: `${client.clientName} was deleted successfully.`,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete client'
      setError(message)
      await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const normalizeStandardRows = (payload: any): StandardField[] => {
    const rawRows = Array.isArray(payload?.data?.mappings)
      ? payload.data.mappings
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : []

    return rawRows.map((row: any, index: number) => {
      const iso = row?.isoStandardDefinition ?? {}
      const client = row?.clientDefinition ?? {}

      const recId =
        Number(row?.recId) ||
        Number(row?.isoRecId) ||
        Number(iso?.isoFieldNo) ||
        Number(row?.mappingId) ||
        index + 1

      const fieldId =
        Number(row?.fieldId) ||
        Number(iso?.isoFieldNo) ||
        recId

      const fieldLength =
        Number(row?.fieldLength) ||
        Number(iso?.length) ||
        0

      return {
        recId,
        fieldId,
        fieldLength,
        fieldName: row?.fieldName ?? iso?.isoFieldName ?? '',
        className: row?.className ?? row?.isoClassName ?? '',
      }
    })
  }

  const fetchStandards = async (clientId?: string) => {
    try {
      setStandardsLoading(true)
      setStandardsError(null)

      const normalizedClientId = (clientId ?? '').trim()
      const endpoint = /^\d+$/.test(normalizedClientId)
        ? `/api/v1/mappings/client/${normalizedClientId}`
        : '/api/v1/standards'

      const res = await fetch(endpoint, { cache: 'no-store' })
      const payload = await res.json()
      if (!res.ok || payload?.success === false) {
        const message = payload?.message || 'Failed to load client standards'
        throw new Error(message)
      }

      setStandards(normalizeStandardRows(payload))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load client standards'
      setStandardsError(message)
      setStandards([])
    } finally {
      setStandardsLoading(false)
    }
  }

  const handleOpenConfigurationModal = async (clientId?: number) => {
    const nextClientId = typeof clientId === 'number'
      ? String(clientId)
      : selectedConfigClientId

    if (typeof clientId === 'number') {
      setSelectedConfigClientId(nextClientId)
      if (editingStandardRecId !== null) {
        setStandardEditForm((prev) => ({ ...prev, clientId: nextClientId }))
      }
    }

    setShowConfigModal(true)
    await fetchStandards(nextClientId)
  }

  const handleEditStandard = (standard: StandardField) => {
    const selectedClientId = /^\d+$/.test(selectedConfigClientId)
      ? selectedConfigClientId
      : String(standard.fieldId)

    setEditingStandardRecId(standard.recId)
    setStandardEditForm({
      clientId: selectedClientId,
      fieldLength: String(standard.fieldLength),
      fieldName: standard.fieldName,
      className: standard.className,
    })
  }

  const handleCancelStandardEdit = () => {
    setEditingStandardRecId(null)
    setStandardEditForm({
      clientId: '',
      fieldLength: '',
      fieldName: '',
      className: '',
    })
  }

  const handleSaveStandardConfig = async (standard: StandardField) => {
    if (!selectedConfigClientId || !/^\d+$/.test(selectedConfigClientId)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Client ID required',
        text: 'Select a valid client before saving configuration.',
      })
      return
    }

    if (!standardEditForm.clientId || !/^\d+$/.test(standardEditForm.clientId)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Invalid clientID',
        text: 'clientID must be numeric.',
      })
      return
    }

    if (!standardEditForm.fieldLength || !/^\d+$/.test(standardEditForm.fieldLength)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Invalid field length',
        text: 'Field length must be numeric.',
      })
      return
    }

    if (!standardEditForm.fieldName.trim() || !standardEditForm.className.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Field name and class name are required.',
      })
      return
    }

    await Swal.fire({
      icon: 'info',
      title: 'Temporarily unavailable',
      text: 'Saving client configuration is disabled for now because the mapping endpoint was removed.',
    })
  }

  const handleXmlFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setUploadedXmlFileName('')
      return
    }

    const isXml = file.name.toLowerCase().endsWith('.xml') || file.type === 'text/xml' || file.type === 'application/xml'
    if (!isXml) {
      setUploadedXmlFileName('')
      event.target.value = ''
      await Swal.fire({
        icon: 'warning',
        title: 'Invalid file type',
        text: 'Please upload an XML file.',
      })
      return
    }

    setUploadedXmlFileName(file.name)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Client Config</h1>
            <p className="text-muted-foreground">Manage client-specific ATM service packages</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setShowCreateForm(true)
                setShowEditForm(false)
                setEditingClientName(null)
                setFormData({ clientId: '', clientName: '', isoVersion: '', encoding: '', bitmapType: '', active: 'Y' })
              }}
              className="bg-primary hover:bg-primary/90"
            >
              + New Client
            </Button>
            <Button
              onClick={fetchClients}
              variant="outline"
              size="icon"
              className="bg-transparent"
              disabled={loading}
              aria-label="Refresh clients"
              title="Refresh clients"
            >
              <RefreshCw className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>

        <Dialog
          open={showCreateForm || showEditForm}
          onOpenChange={(open) => {
            if (!open) {
              setShowCreateForm(false)
              setShowEditForm(false)
              setEditingClientName(null)
              setUploadedXmlFileName('')
              setFormData({ clientId: '', clientName: '', isoVersion: '', encoding: '', bitmapType: '', active: 'Y' })
            }
          }}
        >
          <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-2xl lg:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{showEditForm ? 'Edit Client' : 'Create New Client'}</DialogTitle>
              <DialogDescription>
                {showEditForm ? 'Update the selected client details.' : 'Enter the details to create a new client.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-3 max-w-2xl">
                <div>
                  <label className="text-sm font-medium text-foreground">Client ID *</label>
                  <Input
                    value={showEditForm ? formData.clientId : String(nextClientIdPreview)}
                    className="mt-1"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Client Name *</label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Client name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">ISO Version *</label>
                  <Input
                    value={formData.isoVersion}
                    onChange={(e) => setFormData({ ...formData, isoVersion: e.target.value })}
                    placeholder="ISO version (e.g., 1987/1993/2003)"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Encoding *</label>
                  <Input
                    value={formData.encoding}
                    onChange={(e) => setFormData({ ...formData, encoding: e.target.value })}
                    placeholder="Encoding (e.g., ASCII/EBCDIC)"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Bitmap Type *</label>
                  <Input
                    value={formData.bitmapType}
                    onChange={(e) => setFormData({ ...formData, bitmapType: e.target.value })}
                    placeholder="Bitmap type (e.g., Primary/Secondary)"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <select
                    value={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                  >
                    <option value="Y">Active</option>
                    <option value="N">Inactive</option>
                  </select>
                </div>
              </div>

              <input
                id="create-client-xml-upload"
                type="file"
                accept=".xml,application/xml,text/xml"
                onChange={handleXmlFileChange}
                className="hidden"
              />

              <div className="flex gap-2 pt-4 items-center">
                <Button
                  onClick={showEditForm ? handleUpdateClient : handleCreateClient}
                  className="bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {showEditForm ? 'Update Client' : 'Create Client'}
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateForm(false)
                    setShowEditForm(false)
                    setEditingClientName(null)
                    setUploadedXmlFileName('')
                    setFormData({ clientId: '', clientName: '', isoVersion: '', encoding: '', bitmapType: '', active: 'Y' })
                  }}
                  variant="outline"
                  className="bg-transparent"
                >
                  Cancel
                </Button>
                {!showEditForm && (
                  <label htmlFor="create-client-xml-upload">
                    <Button type="button" variant="outline" className="bg-transparent" asChild>
                      <span>Upload XML</span>
                    </Button>
                  </label>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showConfigModal}
          onOpenChange={(open) => {
            setShowConfigModal(open)
            if (!open) {
              handleCancelStandardEdit()
              setStandardsError(null)
            }
          }}
        >
          <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[95vw] lg:max-w-6xl h-[85vh] p-0 overflow-hidden">
            <div className="flex h-full min-h-0 flex-col">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Update Client Configuration</DialogTitle>
              <DialogDescription>
                Select a client, edit client field/field length, then update that client configuration.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 px-6 pb-6 flex-1 min-h-0 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-sm font-medium text-foreground">Client ID *</label>
                  <select
                    value={selectedConfigClientId}
                    onChange={(e) => {
                      const nextClientId = e.target.value
                      setSelectedConfigClientId(nextClientId)
                      if (editingStandardRecId !== null && /^\d+$/.test(nextClientId)) {
                        setStandardEditForm((prev) => ({ ...prev, clientId: nextClientId }))
                      }
                      void fetchStandards(nextClientId)
                    }}
                    className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                  >
                    <option value="">Select client</option>
                    {clients
                      .filter((client): client is Client & { clientId: number } => typeof client.clientId === 'number')
                      .sort((a, b) => a.clientId - b.clientId)
                      .map((client) => (
                        <option key={client.clientId} value={String(client.clientId)}>
                          {client.clientId} - {client.clientName}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button
                    onClick={() => void fetchStandards(selectedConfigClientId)}
                    variant="outline"
                    size="icon"
                    className="bg-transparent"
                    disabled={standardsLoading}
                    aria-label="Reload standards"
                    title="Reload standards"
                  >
                    <RefreshCw className={standardsLoading ? 'animate-spin' : ''} />
                  </Button>
                </div>
              </div>

              {standardsError && (
                <Card className="p-4 border-destructive/30 bg-destructive/10 text-destructive text-sm">
                  {standardsError}
                </Card>
              )}

              <Card className="overflow-hidden flex-1 min-h-0">
                <div className="overflow-auto h-full">
                  <table className="w-full text-sm">
                    <thead className="bg-card/50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">RECID</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">ISOFIELD</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">CLIENTFIELD</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">FIELDLENGTH</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">FIELDNAME</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">CLASSNAME</th>
                        <th className="px-4 py-3 text-center font-semibold text-foreground">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standardsLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <tr key={`standards-skeleton-${index}`} className="border-b border-border">
                            <td className="px-4 py-3"><Skeleton className="h-4 w-16 bg-muted/60" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-16 bg-muted/60" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-16 bg-muted/60" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-20 bg-muted/60" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-32 bg-muted/60" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-28 bg-muted/60" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-8 w-28 bg-muted/60 mx-auto" /></td>
                          </tr>
                        ))
                      ) : standards.length > 0 ? (
                        standards.map((standard) => {
                          const isEditing = editingStandardRecId === standard.recId
                          return (
                            <tr key={standard.recId} className="border-b border-border hover:bg-card/50 transition-colors">
                              <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{standard.recId}</td>
                              <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{standard.fieldId}</td>
                              <td className="px-4 py-3 text-foreground">
                                {isEditing ? (
                                  <Input
                                    value={standardEditForm.clientId}
                                    onChange={(e) => setStandardEditForm({ ...standardEditForm, clientId: e.target.value.replace(/\D/g, '') })}
                                    className="h-8"
                                    inputMode="numeric"
                                  />
                                ) : (
                                  <span className="text-muted-foreground font-mono text-xs">{standard.fieldId}</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-foreground">
                                {isEditing ? (
                                  <Input
                                    value={standardEditForm.fieldLength}
                                    onChange={(e) => setStandardEditForm({ ...standardEditForm, fieldLength: e.target.value.replace(/\D/g, '') })}
                                    className="h-8"
                                    inputMode="numeric"
                                  />
                                ) : (
                                  <span className="text-muted-foreground font-mono text-xs">{standard.fieldLength}</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-foreground">
                                {isEditing ? (
                                  <span className="text-muted-foreground text-xs">{standard.fieldName}</span>
                                ) : (
                                  standard.fieldName
                                )}
                              </td>
                              <td className="px-4 py-3 text-foreground">
                                {isEditing ? (
                                  <span className="text-muted-foreground text-xs">{standard.className}</span>
                                ) : (
                                  standard.className
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex gap-2 justify-center">
                                  {isEditing ? (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => handleSaveStandardConfig(standard)}
                                        disabled={isSavingStandardConfig}
                                        className="text-xs"
                                      >
                                        Update
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCancelStandardEdit}
                                        className="bg-transparent text-xs"
                                        disabled={isSavingStandardConfig}
                                      >
                                        Cancel
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditStandard(standard)}
                                      className="bg-transparent text-xs"
                                      disabled={isSavingStandardConfig}
                                    >
                                      Edit
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                            No standards found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Search by client name, bitmap type, encoding, or ISO version..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-2 bg-input border border-border rounded-md text-foreground text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {loading ? 'Loading clients...' : `Total: ${filteredClients.length} / ${clients.length}`}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Per page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {error && (
          <Card className="p-4 border-destructive/30 bg-destructive/10 text-destructive text-sm">
            {error}
          </Card>
        )}

        {/* Services Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-card/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">CLIENT NAME</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">BITMAP TYPE</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">ENCODING</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">ISO VERSION</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">STATUS</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="border-b border-border">
                      <td className="px-6 py-4"><Skeleton className="h-4 w-40 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-28 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-20 bg-muted/60" /></td>
                    </tr>
                  ))
                ) : currentClients.length > 0 ? (
                  currentClients.map((client, index) => (
                    <tr
                      key={index}
                      className="border-b border-border hover:bg-muted/60 hover:shadow-[inset_0_0_0_1px_hsl(var(--border))] transition-all duration-150 cursor-pointer"
                      onClick={() => {
                        if (typeof client.clientId === 'number') {
                          void handleOpenConfigurationModal(client.clientId)
                        }
                      }}
                    >
                      <td className="px-6 py-4 font-medium text-foreground">{client.clientName}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{client.bitmapType}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{client.encoding}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{client.isoVersion}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.active)}`}>
                          {getStatusLabel(client.active)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => { e.stopPropagation(); handleEditClient(client) }}
                            className="bg-transparent text-xs"
                            disabled={isSubmitting}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => { e.stopPropagation(); handleDeleteClient(client) }}
                            className="bg-transparent text-xs text-destructive hover:bg-destructive/10"
                            disabled={isSubmitting}
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
                      {loading ? 'Loading clients...' : (searchTerm || statusFilter !== 'all' ? 'No matching clients found' : 'No clients found')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {renderPageNumbers()}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}