"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MoreVertical, Plus, Filter, Download, Edit, Trash2, Copy, Link, ChevronDown, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DisposalFees() {
  const [activeTab, setActiveTab] = useState("all")
  const [activeView, setActiveView] = useState("list")
  const [showAddTierDialog, setShowAddTierDialog] = useState(false)
  const [selectedFee, setSelectedFee] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const disposalFees = [
    {
      id: 1,
      name: "MSW Disposal Fee",
      description: "Municipal Solid Waste disposal fee for all business lines",
      type: "Per Ton",
      defaultRate: "$65.00",
      minCharge: "$25.00",
      businessLine: "All",
      status: "Active",
      locations: 5,
      material: "MSW",
      materials: ["MSW"],
      freeTonnage: 0.5,
      glCode: "4100-DISP",
      linkedServices: 3,
      tiers: [
        { id: 1, from: 0, to: 2, rate: 65.0 },
        { id: 2, from: 2, to: 5, rate: 55.0 },
        { id: 3, from: 5, to: null, rate: 45.0 },
      ],
    },
    {
      id: 2,
      name: "C&D Disposal Fee",
      description: "Construction & Demolition disposal fee for commercial customers",
      type: "Per Ton",
      defaultRate: "$75.00",
      minCharge: "$30.00",
      businessLine: "Commercial",
      status: "Active",
      locations: 3,
      material: "C&D",
      freeTonnage: 0,
      glCode: "4100-DISP-CD",
      linkedServices: 2,
      tiers: [
        { id: 1, from: 0, to: 3, rate: 75.0 },
        { id: 2, from: 3, to: null, rate: 65.0 },
      ],
    },
    {
      id: 3,
      name: "Recycling Processing Fee",
      description: "Recycling processing fee for residential customers",
      type: "Per Ton",
      defaultRate: "$45.00",
      minCharge: "$20.00",
      businessLine: "Residential",
      status: "Active",
      locations: 4,
      material: "Recycling",
      freeTonnage: 0.25,
      glCode: "4100-DISP-REC",
      linkedServices: 1,
      tiers: [{ id: 1, from: 0, to: null, rate: 45.0 }],
    },
    {
      id: 4,
      name: "Yard Waste Disposal",
      description: "Yard waste disposal fee for residential customers",
      type: "Per Cubic Yard",
      defaultRate: "$15.00",
      minCharge: "$10.00",
      businessLine: "Residential",
      status: "Active",
      locations: 2,
      material: "Yard Waste",
      freeTonnage: 0.1,
      glCode: "4100-DISP-YW",
      linkedServices: 1,
      tiers: [{ id: 1, from: 0, to: null, rate: 15.0 }],
    },
    {
      id: 5,
      name: "Hazardous Waste Surcharge",
      description: "Hazardous waste surcharge for all business lines",
      type: "Per Item",
      defaultRate: "$25.00",
      minCharge: "$25.00",
      businessLine: "All",
      status: "Active",
      locations: 1,
      material: "Hazardous",
      freeTonnage: 0,
      glCode: "4100-DISP-HZ",
      linkedServices: 0,
      tiers: [{ id: 1, from: 0, to: null, rate: 25.0 }],
    },
    // New Roll-off specific fees
    {
      id: 6,
      name: "Roll-off Delivery Fee",
      description: "Fee for delivering roll-off containers to customer locations",
      type: "Per Container",
      defaultRate: "$85.00",
      minCharge: "$85.00",
      businessLine: "Roll-off",
      status: "Active",
      locations: 8,
      material: "All",
      materials: ["MSW", "C&D", "Recycling", "Yard Waste"],
      freeTonnage: 0,
      glCode: "4200-ROLL-DEL",
      linkedServices: 12,
      tiers: [{ id: 1, from: 0, to: null, rate: 85.0 }],
    },
    {
      id: 7,
      name: "Roll-off Pickup Fee",
      description: "Fee for picking up roll-off containers from customer locations",
      type: "Per Container",
      defaultRate: "$85.00",
      minCharge: "$85.00",
      businessLine: "Roll-off",
      status: "Active",
      locations: 8,
      material: "All",
      materials: ["MSW", "C&D", "Recycling", "Yard Waste"],
      freeTonnage: 0,
      glCode: "4200-ROLL-PU",
      linkedServices: 12,
      tiers: [{ id: 1, from: 0, to: null, rate: 85.0 }],
    },
    {
      id: 8,
      name: "Roll-off Daily Rental",
      description: "Daily rental fee for roll-off containers",
      type: "Per Day",
      defaultRate: "$15.00",
      minCharge: "$15.00",
      businessLine: "Roll-off",
      status: "Active",
      locations: 8,
      material: "All",
      freeTonnage: 0,
      glCode: "4200-ROLL-RENT",
      linkedServices: 10,
      tiers: [
        { id: 1, from: 1, to: 7, rate: 15.0 },
        { id: 2, from: 8, to: 14, rate: 12.0 },
        { id: 3, from: 15, to: null, rate: 10.0 },
      ],
    },
    {
      id: 9,
      name: "Roll-off Overweight Fee",
      description: "Fee for roll-off containers exceeding weight limits",
      type: "Per Ton",
      defaultRate: "$95.00",
      minCharge: "$50.00",
      businessLine: "Roll-off",
      status: "Active",
      locations: 8,
      material: "All",
      freeTonnage: 0,
      glCode: "4200-ROLL-OW",
      linkedServices: 8,
      tiers: [
        { id: 1, from: 0, to: 1, rate: 95.0 },
        { id: 2, from: 1, to: 3, rate: 120.0 },
        { id: 3, from: 3, to: null, rate: 150.0 },
      ],
    },
    {
      id: 10,
      name: "Roll-off Relocation Fee",
      description: "Fee for relocating roll-off containers at customer request",
      type: "Per Move",
      defaultRate: "$75.00",
      minCharge: "$75.00",
      businessLine: "Roll-off",
      status: "Active",
      locations: 8,
      material: "All",
      freeTonnage: 0,
      glCode: "4200-ROLL-RELOC",
      linkedServices: 6,
      tiers: [{ id: 1, from: 0, to: null, rate: 75.0 }],
    },
    {
      id: 11,
      name: "Roll-off Contamination Fee",
      description: "Fee for contaminated materials in roll-off containers",
      type: "Per Incident",
      defaultRate: "$150.00",
      minCharge: "$150.00",
      businessLine: "Roll-off",
      status: "Active",
      locations: 8,
      material: "All",
      freeTonnage: 0,
      glCode: "4200-ROLL-CONT",
      linkedServices: 5,
      tiers: [
        { id: 1, from: 0, to: 1, rate: 150.0 },
        { id: 2, from: 1, to: null, rate: 250.0 },
      ],
    },
  ]

  const materials = [
    { id: 1, name: "MSW", description: "Municipal Solid Waste" },
    { id: 2, name: "C&D", description: "Construction & Demolition" },
    { id: 3, name: "Recycling", description: "Recyclable Materials" },
    { id: 4, name: "Yard Waste", description: "Yard Waste and Organics" },
    { id: 5, name: "Hazardous", description: "Hazardous Waste" },
    { id: 6, name: "All", description: "All Material Types" },
  ]

  const descriptionTemplates = [
    { id: 1, text: "Standard disposal fee for [material] waste" },
    { id: 2, text: "Processing fee for [material] materials" },
    { id: 3, text: "[material] disposal fee for [business] customers" },
    { id: 4, text: "Regulatory compliance fee for [material] disposal" },
    { id: 5, text: "Environmental fee for [material] processing" },
    { id: 6, text: "Handling fee for [material] materials" },
    { id: 7, text: "Transportation and disposal fee for [material]" },
  ]

  const pricingZones = [
    { id: 1, name: "Zone A", description: "Metropolitan Area" },
    { id: 2, name: "Zone B", description: "Suburban Area" },
    { id: 3, name: "Zone C", description: "Rural Area" },
  ]

  const serviceMeasures = [
    { id: 1, name: "Per Ton", description: "Charged per ton of material" },
    { id: 2, name: "Per Cubic Yard", description: "Charged per cubic yard of material" },
    { id: 3, name: "Per Item", description: "Charged per item" },
    { id: 4, name: "Per Container", description: "Charged per container" },
    { id: 5, name: "Per Day", description: "Charged per day" },
    { id: 6, name: "Per Move", description: "Charged per move or relocation" },
    { id: 7, name: "Per Incident", description: "Charged per incident" },
  ]

  const glCodes = [
    { id: 1, code: "4100-DISP", description: "Disposal Revenue" },
    { id: 2, code: "4100-DISP-CD", description: "C&D Disposal Revenue" },
    { id: 3, code: "4100-DISP-REC", description: "Recycling Revenue" },
    { id: 4, code: "4100-DISP-YW", description: "Yard Waste Revenue" },
    { id: 5, code: "4100-DISP-HZ", description: "Hazardous Waste Revenue" },
    { id: 6, code: "4200-ROLL-DEL", description: "Roll-off Delivery Revenue" },
    { id: 7, code: "4200-ROLL-PU", description: "Roll-off Pickup Revenue" },
    { id: 8, code: "4200-ROLL-RENT", description: "Roll-off Rental Revenue" },
    { id: 9, code: "4200-ROLL-OW", description: "Roll-off Overweight Revenue" },
    { id: 10, code: "4200-ROLL-RELOC", description: "Roll-off Relocation Revenue" },
    { id: 11, code: "4200-ROLL-CONT", description: "Roll-off Contamination Revenue" },
  ]

  const linkedFees = [
    { id: 1, name: "Environmental Fee", type: "Fee", amount: "$5.00" },
    { id: 2, name: "Fuel Surcharge", type: "Fee", amount: "3%" },
    { id: 3, name: "State Disposal Tax", type: "Tax", amount: "$2.50" },
    { id: 4, name: "County Waste Fee", type: "Fee", amount: "$1.75" },
    { id: 5, name: "Regulatory Compliance Fee", type: "Fee", amount: "$3.50" },
  ]

  const handleViewFee = (fee: any) => {
    setSelectedFee(fee)
    setActiveView("detail")
  }

  const handleEditFee = (fee: any) => {
    setSelectedFee(fee)
    setShowEditDialog(true)
  }

  const renderTierTable = (tiers: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>From (tons)</TableHead>
          <TableHead>To (tons)</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tiers.map((tier) => (
          <TableRow key={tier.id}>
            <TableCell>{tier.from}</TableCell>
            <TableCell>{tier.to === null ? "∞" : tier.to}</TableCell>
            <TableCell>${tier.rate.toFixed(2)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderListView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All business lines</TabsTrigger>
            <TabsTrigger value="residential">Residential</TabsTrigger>
            <TabsTrigger value="commercial">Commercial</TabsTrigger>
            <TabsTrigger value="roll-off">Roll-off</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => setShowEditDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Disposal Fee
          </Button>
        </div>
      </div>

      <div className="p-4 border rounded-md bg-background">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">Quick Filter</div>
          <div className="flex gap-2">
            <div className="w-[200px]">
              <Select defaultValue="all">
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Business Line" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Business Lines</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="roll-off">Roll-off</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[200px]">
              <Select defaultValue="all">
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Materials</SelectItem>
                  {materials.map((material) => (
                    <SelectItem key={material.id} value={material.name.toLowerCase()}>
                      {material.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-[200px]">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search fees..." className="h-8 text-xs pl-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {disposalFees
          .filter((fee) => activeTab === "all" || fee.businessLine.toLowerCase() === activeTab)
          .map((fee) => (
            <div key={fee.id} className="border rounded-md overflow-hidden">
              <div className="p-4 bg-muted/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{fee.name}</h3>
                    <Badge variant="outline">{fee.businessLine}</Badge>
                    {fee.materials ? (
                      fee.materials.map((material, idx) => (
                        <Badge key={idx} variant="outline">
                          {material}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">{fee.material}</Badge>
                    )}
                    <Badge variant="success" className="bg-green-100 text-green-800">
                      {fee.status}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold mr-2">{fee.defaultRate}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewFee(fee)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditFee(fee)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                <div>
                  <div className="text-sm font-medium">{fee.type}</div>
                  <div className="text-xs text-muted-foreground">Fee Type</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{fee.minCharge}</div>
                  <div className="text-xs text-muted-foreground">Minimum Charge</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{fee.freeTonnage} tons</div>
                  <div className="text-xs text-muted-foreground">Free Tonnage</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{fee.tiers.length}</div>
                  <div className="text-xs text-muted-foreground">Pricing Tiers</div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <Button variant="outline" size="sm" onClick={() => handleViewFee(fee)}>
                  View Details
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )

  const renderDetailView = () => {
    if (!selectedFee) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setActiveView("list")}>
            <ChevronDown className="h-4 w-4 mr-2 rotate-90" />
            Back to List
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEditFee(selectedFee)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Disposal Fee Details</CardTitle>
                <CardDescription>Basic information about this disposal fee</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Name</h3>
                    <p>{selectedFee.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Status</h3>
                    <Badge variant="success" className="bg-green-100 text-green-800">
                      {selectedFee.status}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Description</h3>
                    <p className="text-sm text-muted-foreground">{selectedFee.description}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">GL Code</h3>
                    <p>{selectedFee.glCode}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Business Line</h3>
                    <p>{selectedFee.businessLine}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Materials</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedFee.materials ? (
                        selectedFee.materials.map((material, idx) => (
                          <Badge key={idx} variant="outline">
                            {material}
                          </Badge>
                        ))
                      ) : (
                        <p>{selectedFee.material}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Fee Type</h3>
                    <p>{selectedFee.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Default Rate</h3>
                    <p className="font-bold">{selectedFee.defaultRate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Minimum Charge</h3>
                    <p>{selectedFee.minCharge}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Free Tonnage</h3>
                    <p>{selectedFee.freeTonnage} tons</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tiered Pricing</CardTitle>
                    <CardDescription>Pricing tiers for this disposal fee</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tier
                  </Button>
                </div>
              </CardHeader>
              <CardContent>{renderTierTable(selectedFee.tiers)}</CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <p>
                  Tiered pricing allows for different rates based on tonnage. For example, the first 2 tons might be
                  charged at $65/ton, while tonnage between 2-5 tons is charged at $55/ton, and anything over 5 tons is
                  charged at $45/ton.
                </p>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Linked Services</CardTitle>
                    <CardDescription>Services using this disposal fee</CardDescription>
                  </div>
                  <Button size="sm">
                    <Link className="h-4 w-4 mr-2" />
                    Link Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedFee.linkedServices > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Business Line</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Custom Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: selectedFee.linkedServices }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>Service {index + 1}</TableCell>
                          <TableCell>{selectedFee.businessLine}</TableCell>
                          <TableCell>{selectedFee.material}</TableCell>
                          <TableCell>
                            {Math.random() > 0.5 ? "Default" : `$${(Math.random() * 20 + 50).toFixed(2)}`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground mb-4">No services are currently linked to this disposal fee.</p>
                    <Button size="sm">
                      <Link className="h-4 w-4 mr-2" />
                      Link Service
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Associated Fees & Taxes</CardTitle>
                <CardDescription>Additional fees and taxes applied with this disposal fee</CardDescription>
              </CardHeader>
              <CardContent>
                {linkedFees.length > 0 ? (
                  <div className="space-y-2">
                    {linkedFees.map((fee) => (
                      <div key={fee.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <div className="font-medium">{fee.name}</div>
                          <div className="text-xs text-muted-foreground">{fee.type}</div>
                        </div>
                        <div className="font-medium">{fee.amount}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No associated fees or taxes</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fee or Tax
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing Zones</CardTitle>
                <CardDescription>Zones where this disposal fee applies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pricingZones.map((zone) => (
                    <div key={zone.id} className="flex items-center space-x-2">
                      <Checkbox id={`zone-${zone.id}`} defaultChecked={zone.id === 1} />
                      <label
                        htmlFor={`zone-${zone.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {zone.name}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calculation Example</CardTitle>
                <CardDescription>Example of how this disposal fee is calculated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-md bg-muted/20">
                  <h4 className="font-medium mb-2">Example Scenario:</h4>
                  <p className="text-sm mb-2">
                    {selectedFee.businessLine === "Roll-off"
                      ? `Customer uses a ${selectedFee.name.includes("Rental") ? "roll-off container for 10 days" : "roll-off service"}`
                      : `Customer disposes of 6 tons of ${selectedFee.material}`}
                  </p>

                  <h4 className="font-medium mb-2">Calculation:</h4>
                  <div className="space-y-1 text-sm">
                    {selectedFee.businessLine === "Roll-off" && selectedFee.name.includes("Rental") ? (
                      <>
                        <p>Rental period: 10 days</p>
                        <p>
                          Tier 1 (1-7 days): 7 days × ${selectedFee.tiers[0].rate.toFixed(2)}/day = $
                          {(7 * selectedFee.tiers[0].rate).toFixed(2)}
                        </p>
                        <p>
                          Tier 2 (8-14 days): 3 days × $
                          {selectedFee.tiers[1]?.rate.toFixed(2) || selectedFee.tiers[0].rate.toFixed(2)}/day = $
                          {(3 * (selectedFee.tiers[1]?.rate || selectedFee.tiers[0].rate)).toFixed(2)}
                        </p>
                      </>
                    ) : selectedFee.businessLine === "Roll-off" ? (
                      <>
                        <p>Base fee: {selectedFee.defaultRate}</p>
                        {selectedFee.name.includes("Overweight") && (
                          <>
                            <p>Overweight amount: 2 tons</p>
                            <p>
                              Tier 2 rate: $
                              {selectedFee.tiers[1]?.rate.toFixed(2) || selectedFee.tiers[0].rate.toFixed(2)}/ton
                            </p>
                            <p>
                              Overweight charge: 2 tons × $
                              {selectedFee.tiers[1]?.rate.toFixed(2) || selectedFee.tiers[0].rate.toFixed(2)} = $
                              {(2 * (selectedFee.tiers[1]?.rate || selectedFee.tiers[0].rate)).toFixed(2)}
                            </p>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <p>Free tonnage: {selectedFee.freeTonnage} tons</p>
                        <p>
                          Chargeable tonnage: 6 - {selectedFee.freeTonnage} = {6 - selectedFee.freeTonnage} tons
                        </p>

                        {selectedFee.tiers.map((tier, index) => {
                          if (
                            tier.from <= 6 - selectedFee.freeTonnage &&
                            (tier.to === null || tier.to > 6 - selectedFee.freeTonnage)
                          ) {
                            return (
                              <p key={index} className="font-medium">
                                Rate: ${tier.rate.toFixed(2)}/ton (Tier {index + 1})
                              </p>
                            )
                          }
                          return null
                        })}
                      </>
                    )}

                    <p className="mt-2 font-bold">
                      Total charge: $
                      {selectedFee.businessLine === "Roll-off" && selectedFee.name.includes("Rental")
                        ? (
                            7 * selectedFee.tiers[0].rate +
                            3 * (selectedFee.tiers[1]?.rate || selectedFee.tiers[0].rate)
                          ).toFixed(2)
                        : selectedFee.businessLine === "Roll-off" && selectedFee.name.includes("Overweight")
                          ? (
                              Number.parseFloat(selectedFee.defaultRate.replace("$", "")) +
                              2 * (selectedFee.tiers[1]?.rate || selectedFee.tiers[0].rate)
                            ).toFixed(2)
                          : selectedFee.businessLine === "Roll-off"
                            ? selectedFee.defaultRate.replace("$", "")
                            : (
                                (6 - selectedFee.freeTonnage) *
                                selectedFee.tiers[selectedFee.tiers.length - 1].rate
                              ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const renderEditDialog = () => (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{selectedFee ? "Edit Disposal Fee" : "Add Disposal Fee"}</DialogTitle>
          <DialogDescription>
            {selectedFee
              ? "Update the details for this disposal fee"
              : "Create a new disposal fee with tiered pricing and free tonnage"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="tiers">Tiers</TabsTrigger>
            <TabsTrigger value="associations">Associations</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fee-name">Fee Name</Label>
                <Input id="fee-name" defaultValue={selectedFee?.name || ""} placeholder="Enter fee name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee-status">Status</Label>
                <Select defaultValue={selectedFee?.status?.toLowerCase() || "active"}>
                  <SelectTrigger id="fee-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fee-description">Description</Label>
                  <Select
                    onValueChange={(value) => {
                      const template = descriptionTemplates.find((t) => t.id.toString() === value)
                      if (template) {
                        const descriptionEl = document.getElementById("fee-description") as HTMLTextAreaElement
                        if (descriptionEl) {
                          descriptionEl.value = template.text
                        }
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Template" />
                    </SelectTrigger>
                    <SelectContent>
                      {descriptionTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          Template {template.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  id="fee-description"
                  defaultValue={selectedFee?.description || ""}
                  placeholder="Enter fee description"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Use [material] and [business] placeholders to be replaced with selected materials and business line
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee-business-line">Business Line</Label>
                <Select defaultValue={selectedFee?.businessLine?.toLowerCase() || "all"}>
                  <SelectTrigger id="fee-business-line">
                    <SelectValue placeholder="Select business line" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="roll-off">Roll-off</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee-material">Materials</Label>
                <div className="border rounded-md p-3 space-y-2">
                  {materials.map((material) => (
                    <div key={material.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`material-${material.id}`}
                        defaultChecked={
                          selectedFee?.materials?.includes(material.name) || selectedFee?.material === material.name
                        }
                      />
                      <label
                        htmlFor={`material-${material.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {material.name}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Select all materials this fee applies to</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee-type">Fee Type</Label>
                <Select defaultValue={selectedFee?.type?.toLowerCase().replace(/\s+/g, "-") || "per-ton"}>
                  <SelectTrigger id="fee-type">
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceMeasures.map((measure) => (
                      <SelectItem key={measure.id} value={measure.name.toLowerCase().replace(/\s+/g, "-")}>
                        {measure.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee-gl-code">GL Code</Label>
                <Select defaultValue={selectedFee?.glCode || ""}>
                  <SelectTrigger id="fee-gl-code">
                    <SelectValue placeholder="Select GL code" />
                  </SelectTrigger>
                  <SelectContent>
                    {glCodes.map((code) => (
                      <SelectItem key={code.id} value={code.code}>
                        {code.code} - {code.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fee-default-rate">Default Rate</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    id="fee-default-rate"
                    defaultValue={selectedFee?.defaultRate?.replace("$", "") || ""}
                    className="pl-7"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee-min-charge">Minimum Charge</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    id="fee-min-charge"
                    defaultValue={selectedFee?.minCharge?.replace("$", "") || ""}
                    className="pl-7"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee-free-tonnage">Free Tonnage</Label>
                <div className="relative">
                  <Input id="fee-free-tonnage" defaultValue={selectedFee?.freeTonnage || "0"} placeholder="0.00" />
                  <span className="absolute right-3 top-2.5 text-muted-foreground">tons</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  For tonnage less than or equal to this value, the customer is not charged.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fee-use-tiers">Use Tiered Pricing</Label>
                  <Switch id="fee-use-tiers" defaultChecked={selectedFee?.tiers?.length > 1} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enable tiered pricing to charge different rates based on tonnage ranges.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Pricing Tiers</h3>
                <Button size="sm" onClick={() => setShowAddTierDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tier
                </Button>
              </div>

              {selectedFee ? (
                renderTierTable(selectedFee.tiers)
              ) : (
                <div className="border rounded-md p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No tiers defined yet. Add your first tier to get started.
                  </p>
                  <Button size="sm" onClick={() => setShowAddTierDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Tier
                  </Button>
                </div>
              )}

              <div className="bg-muted/20 p-4 rounded-md">
                <h4 className="font-medium mb-2">How Tiered Pricing Works</h4>
                <p className="text-sm text-muted-foreground">
                  Tiered pricing allows you to charge different rates based on tonnage ranges. For example:
                </p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2 space-y-1">
                  <li>From 0-2 tons: $65.00/ton</li>
                  <li>From 2-5 tons: $55.00/ton</li>
                  <li>Over 5 tons: $45.00/ton</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Each tier applies to the tonnage that falls within its range, after free tonnage is subtracted.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="associations" className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Associated Fees & Taxes</h3>
                <div className="border rounded-md p-4">
                  {linkedFees.map((fee) => (
                    <div key={fee.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center gap-2">
                        <Checkbox id={`fee-${fee.id}`} />
                        <div>
                          <Label htmlFor={`fee-${fee.id}`} className="font-medium">
                            {fee.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">{fee.type}</p>
                        </div>
                      </div>
                      <div className="font-medium">{fee.amount}</div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fee or Tax
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Pricing Zones</h3>
                <div className="border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {pricingZones.map((zone) => (
                      <div key={zone.id} className="flex items-center space-x-2">
                        <Checkbox id={`edit-zone-${zone.id}`} defaultChecked={zone.id === 1} />
                        <label
                          htmlFor={`edit-zone-${zone.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {zone.name} - {zone.description}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowEditDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowEditDialog(false)}>
            {selectedFee ? "Save Changes" : "Create Disposal Fee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const renderAddTierDialog = () => (
    <Dialog open={showAddTierDialog} onOpenChange={setShowAddTierDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Pricing Tier</DialogTitle>
          <DialogDescription>Define a new pricing tier for this disposal fee</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tier-from">From (tons)</Label>
            <Input id="tier-from" placeholder="0.00" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier-to">To (tons)</Label>
            <Input id="tier-to" placeholder="0.00" />
            <p className="text-xs text-muted-foreground">Leave empty for unlimited</p>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="tier-rate">Rate per Ton</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input id="tier-rate" className="pl-7" placeholder="0.00" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddTierDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowAddTierDialog(false)}>Add Tier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      {activeView === "list" ? renderListView() : renderDetailView()}
      {renderEditDialog()}
      {renderAddTierDialog()}
    </>
  )
}
