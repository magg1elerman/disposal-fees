"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchServiceData, type ServiceData } from "@/utils/csv-service-parser"
import { Checkbox } from "@/components/ui/checkbox"

// Filter options
const filterOptions = [
  { name: "Service name", key: "Service name" },
  { name: "Status", key: "Status" },
  { name: "City", key: "City" },
  { name: "State", key: "ST" },
  { name: "Account", key: "Account name" },
  { name: "Container", key: "Container name" },
]

export function Services() {
  const [services, setServices] = useState<ServiceData[]>([])
  const [loading, setLoading] = useState(true)
  const [rowsPerPage, setRowsPerPage] = useState("20")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({})
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    "Service name": true,
    Price: true,
    Status: true,
    "Service address": true,
    City: true,
    ST: true,
    "Account name": true,
    "Account #": true,
    "Container name": true,
    "Service notes": false,
    "Last updater": false,
    "Last update": true,
  })

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const data = await fetchServiceData()
      setServices(data)
      setLoading(false)
    }

    loadData()
  }, [])

  // Filter services based on search term
  const filteredServices = services.filter((service) => {
    if (!searchTerm) return true

    // Search across all visible columns
    return Object.keys(visibleColumns).some((column) => {
      if (!visibleColumns[column]) return false
      const value = service[column as keyof ServiceData]
      if (!value) return false
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    })
  })

  // Calculate pagination
  const totalItems = filteredServices.length
  const totalPages = Math.ceil(totalItems / Number.parseInt(rowsPerPage))
  const startIndex = (currentPage - 1) * Number.parseInt(rowsPerPage)
  const endIndex = Math.min(startIndex + Number.parseInt(rowsPerPage), totalItems)
  const currentItems = filteredServices.slice(startIndex, endIndex)

  // Get selected services
  const selectedServices = currentItems.filter((_, index) => selectedRows[startIndex + index])
  const selectedCount = Object.values(selectedRows).filter(Boolean).length

  // Check if all current page items are selected
  const isAllSelected = currentItems.length > 0 && currentItems.every((_, index) => selectedRows[startIndex + index])

  // Toggle select all for current page
  const toggleSelectAll = () => {
    const newSelectedRows = { ...selectedRows }

    if (isAllSelected) {
      // Unselect all on current page
      currentItems.forEach((_, index) => {
        newSelectedRows[startIndex + index] = false
      })
    } else {
      // Select all on current page
      currentItems.forEach((_, index) => {
        newSelectedRows[startIndex + index] = true
      })
    }

    setSelectedRows(newSelectedRows)
  }

  // Toggle single row selection
  const toggleRowSelection = (index: number) => {
    setSelectedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Calculate metrics based on selected rows
  const selectedPriceValues =
    selectedServices.length > 0
      ? selectedServices
          .map((service) => Number.parseFloat(service.Price.replace(/[^0-9.-]+/g, "") || "0"))
          .filter((price) => !isNaN(price))
      : services
          .map((service) => Number.parseFloat(service.Price.replace(/[^0-9.-]+/g, "") || "0"))
          .filter((price) => !isNaN(price))

  const minPrice = selectedPriceValues.length ? `$${Math.min(...selectedPriceValues).toFixed(2)}` : "$0.00"
  const maxPrice = selectedPriceValues.length ? `$${Math.max(...selectedPriceValues).toFixed(2)}` : "$0.00"
  const avgPrice = selectedPriceValues.length
    ? `$${(selectedPriceValues.reduce((sum, price) => sum + price, 0) / selectedPriceValues.length).toFixed(2)}`
    : "$0.00"

  // Get unique locations (cities) from selected services
  const selectedLocations =
    selectedServices.length > 0
      ? new Set(selectedServices.map((service) => service.City))
      : new Set(services.map((service) => service.City))
  const locationCount = selectedLocations.size

  // Calculate revenue from selected services
  const revenue = selectedPriceValues.length
    ? selectedPriceValues.reduce((sum, price) => sum + price, 0).toFixed(2)
    : "0.00"

  // Toggle column visibility
  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with metrics */}
      <div className="p-4 bg-white border-b">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 p-2 border rounded-md">
            <span className="text-sm text-muted-foreground">Min.</span>
            <span className="font-medium">{minPrice}</span>
          </div>
          <div className="flex items-center gap-2 p-2 border rounded-md">
            <span className="text-sm text-muted-foreground">Max.</span>
            <span className="font-medium">{maxPrice}</span>
          </div>
          <div className="flex items-center gap-2 p-2 border rounded-md">
            <span className="text-sm text-muted-foreground">Avg.</span>
            <span className="font-medium">{avgPrice}</span>
          </div>
          <div className="flex items-center gap-2 p-2 border rounded-md">
            <span className="text-sm text-muted-foreground">Locations</span>
            <span className="font-medium">{locationCount}</span>
          </div>
          <div className="flex items-center gap-2 p-2 border rounded-md">
            <span className="text-sm text-muted-foreground">Revenue</span>
            <span className="font-medium">${revenue}</span>
          </div>
          {selectedCount > 0 && (
            <div className="flex items-center gap-2 p-2 border rounded-md bg-primary/10">
              <span className="text-sm font-medium">{selectedCount} selected</span>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading services data...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0">
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} aria-label="Select all" />
                </TableHead>
                {visibleColumns["Service name"] && <TableHead className="min-w-[200px]">Service name</TableHead>}
                {visibleColumns["Price"] && <TableHead>Price</TableHead>}
                {visibleColumns["Status"] && <TableHead>Status</TableHead>}
                {visibleColumns["Service address"] && <TableHead className="min-w-[200px]">Service address</TableHead>}
                {visibleColumns["City"] && <TableHead>City</TableHead>}
                {visibleColumns["ST"] && <TableHead>State</TableHead>}
                {visibleColumns["Account name"] && <TableHead className="min-w-[150px]">Account name</TableHead>}
                {visibleColumns["Account #"] && <TableHead>Account #</TableHead>}
                {visibleColumns["Container name"] && <TableHead>Container</TableHead>}
                {visibleColumns["Service notes"] && <TableHead className="min-w-[200px]">Service notes</TableHead>}
                {visibleColumns["Last updater"] && <TableHead>Last updater</TableHead>}
                {visibleColumns["Last update"] && <TableHead>Last update</TableHead>}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((service, index) => {
                const rowIndex = startIndex + index
                return (
                  <TableRow key={index} className={selectedRows[rowIndex] ? "bg-muted/20" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows[rowIndex]}
                        onCheckedChange={() => toggleRowSelection(rowIndex)}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </TableCell>
                    {visibleColumns["Service name"] && (
                      <TableCell className="font-medium">{service["Service name"]}</TableCell>
                    )}
                    {visibleColumns["Price"] && <TableCell>{service.Price || "$0.00"}</TableCell>}
                    {visibleColumns["Status"] && (
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            service.Status === "Active"
                              ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                              : "bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700"
                          }
                        >
                          {service.Status}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns["Service address"] && <TableCell>{service["Service address"]}</TableCell>}
                    {visibleColumns["City"] && <TableCell>{service.City}</TableCell>}
                    {visibleColumns["ST"] && <TableCell>{service.ST}</TableCell>}
                    {visibleColumns["Account name"] && <TableCell>{service["Account name"]}</TableCell>}
                    {visibleColumns["Account #"] && <TableCell>{service["Account #"]}</TableCell>}
                    {visibleColumns["Container name"] && <TableCell>{service["Container name"]}</TableCell>}
                    {visibleColumns["Service notes"] && (
                      <TableCell className="max-w-[300px] truncate" title={service["Service notes"]}>
                        {service["Service notes"]}
                      </TableCell>
                    )}
                    {visibleColumns["Last updater"] && <TableCell>{service["Last updater"]}</TableCell>}
                    {visibleColumns["Last update"] && <TableCell>{service["Last update"]}</TableCell>}
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Actions</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t flex items-center justify-between bg-white">
        <div className="text-sm text-muted-foreground">
          {startIndex + 1}-{endIndex} of {totalItems}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue placeholder="20" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 rounded-full">
              {currentPage}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
