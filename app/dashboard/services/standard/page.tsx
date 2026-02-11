'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
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

interface StandardField {
  recId: number
  fieldId: number
  fieldLength: number
  fieldName: string
  className: string
}

export default function StandardServicesPage() {
  const [services, setServices] = useState<StandardField[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const fetchStandards = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/v1/standards', { cache: 'no-store' })
      const payload = await res.json()
      if (!res.ok || payload?.success === false) {
        const message = payload?.message || 'Failed to load standards'
        throw new Error(message)
      }
      setServices(Array.isArray(payload?.data) ? payload.data : [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load standards'
      setError(message)
      setServices([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStandards()
  }, [])

  const filteredServices = services.filter(service => 
    service.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.className.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination calculations
  const totalItems = filteredServices.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentServices = filteredServices.slice(startIndex, endIndex)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

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
      // Show all pages if total is small
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
      // Show ellipsis logic for many pages
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

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Standard Services</h1>
            <p className="text-muted-foreground">Manage standard ATM services and APIs</p>
          </div>
          <Button onClick={fetchStandards} variant="outline" className="bg-transparent">
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="p-4 border-destructive/30 bg-destructive/10 text-destructive text-sm">
            {error}
          </Card>
        )}

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Search by field name or class name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {isLoading ? 'Loading standards...' : `Total: ${filteredServices.length} / ${services.length}`}
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
        <Card className="overflow-hidden transition-none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm transition-none">
              <thead className="bg-card/50 border-b border-border transition-none">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">recId</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">fieldId</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">fieldLength</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">fieldName</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">className</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="border-b border-border transition-none">
                      <td className="px-6 py-4"><Skeleton className="h-4 w-28 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-32 bg-muted/60" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-28 bg-muted/60" /></td>
                    </tr>
                  ))
                ) : currentServices.length > 0 ? (
                  currentServices.map((service) => (
                    <tr key={service.recId} className="border-b border-border hover:bg-card/50 transition-none">
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{service.recId}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{service.fieldId}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{service.fieldLength}</td>
                      <td className="px-6 py-4 text-foreground">{service.fieldName}</td>
                      <td className="px-6 py-4 text-foreground">{service.className}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      {isLoading ? 'Loading standards...' : (searchTerm ? 'No matching services found' : 'No services found')}
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