"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, ChevronDown, Filter, Plus, LayoutGrid } from "lucide-react"

export function Fees() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const fees = [
    {
      id: "1",
      name: "Commercial recurring 1x daily Fee",
      subItem: <Check className="h-4 w-4" />,
      material: "MSW",
      recurrence: "Daily",
      businessLine: "Commercial",
      measure: "4 Yard",
      pricing: "Metro",
    },
    {
      id: "2",
      name: "Commercial recurring 1x daily Fee",
      subItem: <Check className="h-4 w-4" />,
      material: "MSW",
      recurrence: "",
      businessLine: "Roll-off",
      measure: "30 Yard",
      pricing: "Metro",
    },
    {
      id: "3",
      name: "Roll-off ---on re",
      subItem: <Check className="h-4 w-4" />,
      material: "",
      recurrence: "",
      businessLine: "Roll-off",
      measure: "30 Yard",
      pricing: "Metro",
    },
    {
      id: "4",
      name: "Residential Weekly 96 Gallon MSW Metro",
      subItem: <Check className="h-4 w-4" />,
      material: "MSW",
      recurrence: "Weekly",
      businessLine: "Residential",
      measure: "96 Gallon",
      pricing: "Metro",
    },
    {
      id: "5",
      name: "Residential Metro 96 Gallon MSW",
      subItem: <Check className="h-4 w-4" />,
      material: "MSW",
      recurrence: "Weekly",
      businessLine: "Residential",
      measure: "96 Gallon",
      pricing: "Metro",
    },
    {
      id: "6",
      name: "Residential Metro 96 Gallon C&D G.Fee ---NNXX",
      subItem: <Check className="h-4 w-4" />,
      material: "C&D",
      recurrence: "Weekly",
      businessLine: "Residential",
      measure: "96 Gallon",
      pricing: "Metro",
    },
    {
      id: "7",
      name: "Residential Metro 96 Gallon MSW",
      subItem: <Check className="h-4 w-4" />,
      material: "MSW",
      recurrence: "",
      businessLine: "Residential",
      measure: "96 Gallon",
      pricing: "Metro",
    },
  ]

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const toggleAllRows = () => {
    if (selectedRows.length === fees.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(fees.map((fee) => fee.id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-md bg-background">
        <div className="grid grid-cols-5 gap-4">
          <div>
            <div className="text-xs font-medium mb-1">Min.</div>
            <Input value="$0.00" className="h-8 text-sm" />
          </div>
          <div>
            <div className="text-xs font-medium mb-1">Max.</div>
            <Input value="$0.00" className="h-8 text-sm" />
          </div>
          <div>
            <div className="text-xs font-medium mb-1">Avg.</div>
            <Input value="$0.00" className="h-8 text-sm" />
          </div>
          <div>
            <div className="text-xs font-medium mb-1">Locations</div>
            <Input value="0" className="h-8 text-sm" />
          </div>
          <div>
            <div className="text-xs font-medium mb-1">Revenue</div>
            <Input value="$0.00" className="h-8 text-sm" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Fee
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">
                <Checkbox
                  checked={selectedRows.length === fees.length && fees.length > 0}
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Fee <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Sub-Item <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Material <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Recurrence <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Business Line <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Measure <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Pricing <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees.map((fee) => (
              <TableRow key={fee.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox checked={selectedRows.includes(fee.id)} onCheckedChange={() => toggleRow(fee.id)} />
                </TableCell>
                <TableCell>{fee.name}</TableCell>
                <TableCell>{fee.subItem}</TableCell>
                <TableCell>{fee.material}</TableCell>
                <TableCell>{fee.recurrence}</TableCell>
                <TableCell>{fee.businessLine}</TableCell>
                <TableCell>{fee.measure}</TableCell>
                <TableCell>{fee.pricing}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm">1-7 of 7</div>
          <div className="flex items-center">
            <div className="text-sm mr-2">Rows per page:</div>
            <Button variant="outline" size="sm" className="h-8">
              200 <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
