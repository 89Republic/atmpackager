'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
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

interface MappingClient {
  clientId: number
  clientName: string
  isoVersion: string
  encoding: string
  bitmapType: string
  active: string
  createdAt: string
  modifiedAt: string
}

interface IsoMeaning {
  recId: number
  fieldId: number
  fieldLength: number
  fieldName: string
  className: string
  createdAt: string
  modifiedAt: string
}

interface MappingRecord {
  mappingId: number
  client: MappingClient | null
  isoMeaning: IsoMeaning | null
  clientFieldNo: number
  direction: string
  transformation: string
  defaultValue: string
  active: string
  createdAt: string
  modifiedAt: string
}

export default function MappingServicesPage() {
  const [mappings, setMappings] = useState<MappingRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [clientId, setClientId] = useState('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [formData, setFormData] = useState({
    mappingId: '',
    clientId: '',
    clientName: '',
    isoFieldId: '',
    isoFieldName: '',
    isoClassName: '',
    clientFieldNo: '',
    direction: '',
    transformation: '',
    defaultValue: '',
    active: 'true',
  })

  const filteredMappings = mappings.filter(mapping =>
    mapping.mappingId.toString().includes(searchTerm) ||
    mapping.client?.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.isoMeaning?.fieldName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.isoMeaning?.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.direction?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination calculations
  const totalItems = filteredMappings.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMappings = filteredMappings.slice(startIndex, endIndex)

  // Reset to first page when search changes
  const resetToFirstPage = () => {
    setCurrentPage(1)
  }

  // Reset pagination when search term or items per page changes
  useState(() => {
    resetToFirstPage()
  }, [searchTerm, itemsPerPage])

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

  const fetchMappings = async (id: string) => {
    const trimmedId = id.trim()
    const normalizedId = trimmedId.replace(/\D/g, '')
    if (!normalizedId) {
      setError('Please enter a client ID')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      setClientId(normalizedId)
      const res = await fetch(`/api/v1/mappings/client/${normalizedId}`, { cache: 'no-store' })
      const payload = await res.json()
      if (!res.ok || payload?.success === false) {
        const message = payload?.message || 'Failed to load mappings'
        throw new Error(message)
      }
      const rows = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : []

      setMappings(rows)
      if (rows.length === 0) {
        setError('No mappings found for this client ID')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load mappings'
      setError(message)
      setMappings([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateService = async () => {
    try {
      setError(null)
      const payload = {
        clientId: formData.clientId ? Number(formData.clientId) : undefined,
        isoRecId: formData.isoFieldId ? Number(formData.isoFieldId) : undefined,
        clientFieldNo: formData.clientFieldNo ? Number(formData.clientFieldNo) : undefined,
        direction: formData.direction || undefined,
        transformation: formData.transformation || undefined,
        defaultValue: formData.defaultValue || undefined,
      }

      const res = await fetch('/api/v1/mappings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      })
      const responsePayload = await res.json().catch(() => null)
      if (!res.ok || responsePayload?.success === false) {
        const message = responsePayload?.message || 'Failed to create mapping'
        throw new Error(message)
      }

      await fetchMappings(formData.clientId)
      setFormData({
        mappingId: '',
        clientId: '',
        clientName: '',
        isoFieldId: '',
        isoFieldName: '',
        isoClassName: '',
        clientFieldNo: '',
        direction: '',
        transformation: '',
        defaultValue: '',
        active: 'true',
      })
      setShowCreateForm(false)

      await Swal.fire({
        icon: 'success',
        title: 'Mapping created',
        text: 'The mapping was added successfully.',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create mapping'
      setError(message)
      await Swal.fire({
        icon: 'error',
        title: 'Create failed',
        text: message,
      })
    }
  }

  const handleEditService = (mapping: MappingRecord) => {
    setFormData({
      mappingId: String(mapping.mappingId),
      clientId: String(mapping.client?.clientId ?? ''),
      clientName: mapping.client?.clientName ?? '',
      isoFieldId: String(mapping.isoMeaning?.fieldId ?? ''),
      isoFieldName: mapping.isoMeaning?.fieldName ?? '',
      isoClassName: mapping.isoMeaning?.className ?? '',
      clientFieldNo: String(mapping.clientFieldNo ?? ''),
      direction: mapping.direction ?? '',
      transformation: mapping.transformation ?? '',
      defaultValue: mapping.defaultValue ?? '',
      active: mapping.active ?? 'true',
    })
    setEditingId(mapping.mappingId)
    setShowEditForm(true)
  }

  const handleUpdateService = () => {
    if (editingId === null) return

    setMappings(mappings.map(mapping =>
      mapping.mappingId === editingId
        ? {
            ...mapping,
            mappingId: Number(formData.mappingId),
            client: {
              ...mapping.client,
              clientId: Number(formData.clientId),
              clientName: formData.clientName,
              active: formData.active,
              modifiedAt: new Date().toISOString(),
            },
            isoMeaning: {
              ...mapping.isoMeaning,
              fieldId: Number(formData.isoFieldId),
              fieldName: formData.isoFieldName,
              className: formData.isoClassName,
              modifiedAt: new Date().toISOString(),
            },
            clientFieldNo: Number(formData.clientFieldNo || 0),
            direction: formData.direction,
            transformation: formData.transformation,
            defaultValue: formData.defaultValue,
            active: formData.active,
            modifiedAt: new Date().toISOString(),
          }
        : mapping
    ))

    setFormData({
      mappingId: '',
      clientId: '',
      clientName: '',
      isoFieldId: '',
      isoFieldName: '',
      isoClassName: '',
      clientFieldNo: '',
      direction: '',
      transformation: '',
      defaultValue: '',
      active: 'true',
    })
    setEditingId(null)
    setShowEditForm(false)
  }

  const handleDeleteService = async (mappingId: number) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete mapping?',
      text: 'This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    })
    if (!result.isConfirmed) return

    try {
      setError(null)
      const res = await fetch(`/api/v1/mappings/${mappingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })
      const payload = await res.json().catch(() => null)
      if (!res.ok || payload?.success === false) {
        const message = payload?.message || 'Failed to delete mapping'
        throw new Error(message)
      }

      setMappings(mappings.filter(mapping => mapping.mappingId !== mappingId))
      await Swal.fire({
        icon: 'success',
        title: 'Mapping deleted',
        text: 'The mapping was removed successfully.',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete mapping'
      setError(message)
      await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: message,
      })
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

        {error && (
          <Card className="p-4 border-destructive/30 bg-destructive/10 text-destructive text-sm">
            {error}
          </Card>
        )}

        {/* Create/Edit Form */}
        {(showCreateForm || showEditForm) && (
          <Card className="p-6 bg-card/50 border-primary/30">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                {showEditForm ? 'Edit Mapping Route' : 'Create New Mapping Route'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {showEditForm ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground">Mapping ID *</label>
                      <Input
                        value={formData.mappingId}
                        onChange={(e) => setFormData({ ...formData, mappingId: e.target.value })}
                        placeholder="9007199254740991"
                        className="mt-1"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Client ID *</label>
                      <Input
                        value={formData.clientId}
                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                        placeholder="9007199254740991"
                        className="mt-1"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Client Name *</label>
                      <Input
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="Client Name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">ISO Field ID *</label>
                      <Input
                        value={formData.isoFieldId}
                        onChange={(e) => setFormData({ ...formData, isoFieldId: e.target.value })}
                        placeholder="1073741824"
                        className="mt-1"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">ISO Field Name *</label>
                      <Input
                        value={formData.isoFieldName}
                        onChange={(e) => setFormData({ ...formData, isoFieldName: e.target.value })}
                        placeholder="Field Name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">ISO Class Name</label>
                      <Input
                        value={formData.isoClassName}
                        onChange={(e) => setFormData({ ...formData, isoClassName: e.target.value })}
                        placeholder="ClassName"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Client Field No</label>
                      <Input
                        value={formData.clientFieldNo}
                        onChange={(e) => setFormData({ ...formData, clientFieldNo: e.target.value })}
                        placeholder="39"
                        className="mt-1"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Direction</label>
                      <Input
                        value={formData.direction}
                        onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                        placeholder="Inbound"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Transformation</label>
                      <Input
                        value={formData.transformation}
                        onChange={(e) => setFormData({ ...formData, transformation: e.target.value })}
                        placeholder="padding zero"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Default Value</label>
                      <Input
                        value={formData.defaultValue}
                        onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Active</label>
                      <select
                        value={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground">Client ID *</label>
                      <Input
                        value={formData.clientId}
                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                        placeholder="11"
                        className="mt-1"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">ISO Rec ID *</label>
                      <Input
                        value={formData.isoFieldId}
                        onChange={(e) => setFormData({ ...formData, isoFieldId: e.target.value })}
                        placeholder="1"
                        className="mt-1"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Client Field No *</label>
                      <Input
                        value={formData.clientFieldNo}
                        onChange={(e) => setFormData({ ...formData, clientFieldNo: e.target.value })}
                        placeholder="39"
                        className="mt-1"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Direction *</label>
                      <Input
                        value={formData.direction}
                        onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                        placeholder="Inbound"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Transformation</label>
                      <Input
                        value={formData.transformation}
                        onChange={(e) => setFormData({ ...formData, transformation: e.target.value })}
                        placeholder="padding zero"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Default Value</label>
                      <Input
                        value={formData.defaultValue}
                        onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                  </>
                )}
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
                    setFormData({
                      mappingId: '',
                      clientId: '',
                      clientName: '',
                      isoFieldId: '',
                      isoFieldName: '',
                      isoClassName: '',
                      clientFieldNo: '',
                      direction: '',
                      transformation: '',
                      defaultValue: '',
                      active: 'true',
                    })
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

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex flex-1 gap-2">
            <Input
              placeholder="Client ID to load mappings..."
              value={clientId}
              onChange={(e) => setClientId(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading && clientId.trim().length > 0) {
                  fetchMappings(clientId)
                }
              }}
              className="flex-1"
              inputMode="numeric"
            />
            <Button
              onClick={() => fetchMappings(clientId)}
              className="bg-primary hover:bg-primary/90"
              disabled={isLoading || clientId.trim().length === 0}
            >
              {isLoading ? 'Loading...' : 'Load Mappings'}
            </Button>
          </div>
          <Input
            placeholder="Search by client, field, or direction..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="flex-1"
          />
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {isLoading ? 'Loading mappings...' : `Total: ${filteredMappings.length} / ${mappings.length}`}
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
        {/* Services Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-card/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">mappingId</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">client</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">isoMeaning.recId</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">isoMeaning.fieldId</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">isoMeaning.fieldLength</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">isoMeaning.fieldName</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">isoMeaning.className</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">isoMeaning.createdAt</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">isoMeaning.modifiedAt</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">clientFieldNo</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">direction</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">transformation</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">defaultValue</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">active</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">createdAt</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">modifiedAt</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="border-b border-border">
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-48 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-56 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-12 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-8 w-20 bg-muted/60 mx-auto" /></td>
                    </tr>
                  ))
                ) : currentMappings.length > 0 ? (
                  currentMappings.map((mapping) => (
                    <tr key={mapping.mappingId} className="border-b border-border hover:bg-card/50 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{mapping.mappingId}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{mapping.client ? JSON.stringify(mapping.client) : 'null'}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{mapping.isoMeaning?.recId ?? '-'}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{mapping.isoMeaning?.fieldId ?? '-'}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{mapping.isoMeaning?.fieldLength ?? '-'}</td>
                      <td className="px-6 py-4 text-foreground">{mapping.isoMeaning?.fieldName ?? '-'}</td>
                      <td className="px-6 py-4 text-foreground">{mapping.isoMeaning?.className ?? '-'}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{mapping.isoMeaning?.createdAt ?? 'null'}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{mapping.isoMeaning?.modifiedAt ?? 'null'}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{mapping.clientFieldNo}</td>
                      <td className="px-6 py-4 text-foreground">{mapping.direction || '-'}</td>
                      <td className="px-6 py-4 text-foreground">{mapping.transformation ?? 'null'}</td>
                      <td className="px-6 py-4 text-foreground">{mapping.defaultValue ?? 'null'}</td>
                      <td className="px-6 py-4 text-foreground">{mapping.active || '-'}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{mapping.createdAt ?? 'null'}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{mapping.modifiedAt ?? 'null'}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditService(mapping)}
                            className="bg-transparent text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteService(mapping.mappingId)}
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
                    <td colSpan={17} className="px-6 py-8 text-center text-muted-foreground">
                      {isLoading ? 'Loading mappings...' : (searchTerm ? 'No matching mappings found' : 'No mappings found')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
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