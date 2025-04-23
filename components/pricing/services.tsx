"use client"

import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Filter, MoreVertical, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for services
const serviceData = [
  { id: 1, type: "Commercial", measure: "4 Yard", status: "Active", price: "$100.00" },
  { id: 2, type: "Roll-off", measure: "30 Yard", status: "Active", price: "$50.23" },
  { id: 3, type: "Roll-off", measure: "30 Yard", status: "Active", price: "$10.00" },
  { id: 4, type: "Residential", measure: "96 Gallon", status: "Active", price: "$60.00" },
  { id: 5, type: "Residential", measure: "96 Gallon", status: "Active", price: "$20.00" },
  { id: 6, type: "Residential", measure: "96 Gallon", status: "Active", price: "$20.00" },
  { id: 7, type: "Residential", measure: "96 Gallon", status: "Active", price: "$50.00" },
  { id: 8, type: "Residential", measure: "96 Gallon", status: "Active", price: "$15.00" },
]

// Filter options
const filterOptions = [
  { name: "Business line", icon: <Filter className="h-4 w-4" /> },
  { name: "Action", icon: <Filter className="h-4 w-4" /> },
  { name: "Method", icon: <Filter className="h-4 w-4" /> },
  { name: "Measure", icon: <Filter className="h-4 w-4" /> },
  { name: "Pricing zone", icon: <Filter className="h-4 w-4" /> },
  { name: "Period", icon: <Filter className="h-4 w-4" /> },
  { name: "Status", icon: <Filter className="h-4 w-4" /> },
  { name: "Rental fees", icon: <Filter className="h-4 w-4" /> },
  { name: "Value", icon: <Filter className="h-4 w-4" /> },
]

export function Services() {
  const [rowsPerPage, setRowsPerPage] = useState("200")
  const totalItems = 197

  return (
    <div className="flex flex-col h-full">
      {/* Header with metrics */}
      <div className="p-4 bg-white border-b">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 p-2 border rounded-md">
            <span className="text-sm text-muted-foreground">Min.</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="flex items-center gap-2 p-2 border rounded-md">
            <span className="text-sm text-muted-foreground">Max.</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="flex items-center gap-2 p-2 border rounded-md">
            <span className="text-sm text-muted-foreground">Avg.</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="flex items-center gap-2 p-2 border rounded-md">
            <span className="text-sm text-muted-foreground">Locations</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex items-center gap-2 p-2 border rounded-md">
            <span className="text-sm text-muted-foreground">Revenue</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="ml-auto">
            <Button variant="outline" size="icon">
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filterOptions.map((filter) => (
            <Button key={filter.name} variant="outline" size="sm" className="h-8">
              {filter.icon}
              <span className="ml-2">{filter.name}</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-muted/30 sticky top-0">
            <TableRow>
              <TableHead className="w-[250px]">Type</TableHead>
              <TableHead>Measure</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serviceData.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.type}</TableCell>
                <TableCell>{service.measure}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                  >
                    {service.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{service.price}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t flex items-center justify-between bg-white">
        <div className="text-sm text-muted-foreground">
          1-{Math.min(totalItems, Number.parseInt(rowsPerPage))} of {totalItems}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue placeholder="200" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 rounded-full">
              1
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
