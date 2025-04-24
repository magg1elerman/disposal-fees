"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Copy,
  Link,
  ChevronDown,
  LayoutGrid,
  List,
  LinkIcon,
  Settings,
  AlertCircle,
} from "lucide-react"
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
import { DisposalFeesTable } from "./disposal-fees-table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchServiceData, type ServiceData } from "@/utils/csv-service-parser"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Interface for autolinked services
interface AutolinkedService {
  id: string
  name: string
  businessLine: string
  material?: string
  price: string
  status: string
  address: string
  city: string
  state: string
  accountName: string
  accountNumber: string
  containerName: string
}

export function DisposalFees() {
  const [activeTab, setActiveTab] = useState("all")
  const [activeView, setActiveView] = useState("list")
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [showAddTierDialog, setShowAddTierDialog] = useState(false)
  const [selectedFee, setSelectedFee] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAutolinkSettingsDialog, setShowAutolinkSettingsDialog] = useState(false)

  const [useTieredPricing, setUseTieredPricing] = useState(false)
  const [currentTiers, setCurrentTiers] = useState<any[]>([])
  const [newTier, setNewTier] = useState({ from: 0, to: null, rate: 0 })

  // Autolinking states
  const [autolinkEnabled, setAutolinkEnabled] = useState(true)
  const [autolinkByMaterial, setAutolinkByMaterial] = useState(true)
  const [autolinkByLocation, setAutolinkByLocation] = useState(false)
  const [services, setServices] = useState<ServiceData[]>([])
  const [autolinkedServices, setAutolinkedServices] = useState<AutolinkedService[]>([])
  const [isLoadingServices, setIsLoadingServices] = useState(false)

  const componentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleAddDisposalFee = () => {
      setSelectedFee(null)
      setShowEditDialog(true)
    }

    const currentRef = componentRef.current
    if (currentRef) {
      currentRef.addEventListener("add-disposal-fee", handleAddDisposalFee)
      return () => {
        currentRef.removeEventListener("add-disposal-fee", handleAddDisposalFee)
      }
    }
  }, [])

  // Fetch services data for autolinking
  useEffect(() => {
    const loadServices = async () => {
      setIsLoadingServices(true)
      try {
        const data = await fetchServiceData()
        setServices(data)
      } catch (error) {
        console.error("Error loading services:", error)
      } finally {
        setIsLoadingServices(false)
      }
    }

    loadServices()
  }, [])

  // Update autolinked services when selected fee changes
  useEffect(() => {
    if (selectedFee && autolinkEnabled && services.length > 0) {
      findAutolinkedServices(selectedFee)
    } else {
      setAutolinkedServices([])
    }
  }, [selectedFee, autolinkEnabled, autolinkByMaterial, autolinkByLocation, services])

  useEffect(() => {
    if (selectedFee) {
      setCurrentTiers(selectedFee.tiers || [])
      setUseTieredPricing(selectedFee.tiers?.length > 1)
    } else {
      setCurrentTiers([])
      setUseTieredPricing(false)
    }
  }, [selectedFee])

  // Function to find services that can be autolinked to the selected fee
  const findAutolinkedServices = (fee: any) => {
    if (!fee || !services.length) return

    // Map business line names to match service data
    const businessLineMap: Record<string, string> = {
      Residential: "Residential",
      Commercial: "Commercial",
      "Roll-off": "Roll Off",
      All: "", // Special case, will match any
    }

    // Filter services based on business line and optionally material
    const matchedServices = services.filter((service) => {
      // Skip already linked services
      const isAlreadyLinked = fee.linkedServices > 0 && Math.random() < 0.7 // Simulate already linked services
      if (isAlreadyLinked) return false

      // Match by business line
      const businessLineMatches =
        fee.businessLine === "All" || service["Service name"]?.includes(businessLineMap[fee.businessLine] || "")

      // Match by material if enabled
      let materialMatches = true
      if (autolinkByMaterial && fee.material && fee.material !== "Multiple") {
        materialMatches = service["Service name"]?.includes(fee.material)
      }

      // Match by location if enabled
      let locationMatches = true
      if (autolinkByLocation) {
        // This is a simplified example - in a real app, you'd have location data to compare
        locationMatches = service.City === "Metro" || service.ST === "CA"
      }

      return businessLineMatches && materialMatches && locationMatches
    })

    // Convert to autolinked service format
    const linked = matchedServices.slice(0, 5).map((service) => ({
      id: service["Account #"] || Math.random().toString(36).substring(2, 10),
      name: service["Service name"] || "Unknown Service",
      businessLine: fee.businessLine,
      material: fee.material,
      price: service.Price || "$0.00",
      status: service.Status || "Active",
      address: service["Service address"] || "",
      city: service.City || "",
      state: service.ST || "",
      accountName: service["Account name"] || "",
      accountNumber: service["Account #"] || "",
      containerName: service["Container name"] || "",
    }))

    setAutolinkedServices(linked)
  }

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
      material: "Multiple",
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
      material: "Multiple",
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
      material: "Multiple",
      materials: ["MSW", "C&D", "Recycling", "Yard Waste"],
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
      material: "Multiple",
      materials: ["MSW", "C&D", "Recycling", "Yard Waste"],
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
      material: "Multiple",
      materials: ["MSW", "C&D", "Recycling", "Yard Waste"],
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
      material: "Multiple",
      materials: ["MSW", "C&D", "Recycling", "Yard Waste"],
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

  const handleLinkService = (service: AutolinkedService) => {
    // In a real app, this would update the database
    // For now, we'll just remove it from the autolinked services list
    setAutolinkedServices((prev) => prev.filter((s) => s.id !== service.id))
  }

  const handleLinkAllServices = () => {
    // In a real app, this would update the database with all autolinked services
    // For now, we'll just clear the autolinked services list
    setAutolinkedServices([])
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => {
                    setCurrentTiers(currentTiers.filter((t) => t.id !== tier.id))
                  }}
                >
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
    <div className="space-y-6" ref={componentRef} data-disposal-fees>
      <div className="flex justify-between items-center mb-6">
        <div className="border-b border-slate-200 w-full">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All business lines
            </button>
            <button
              onClick={() => setActiveTab("residential")}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === "residential"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Residential
            </button>
            <button
              onClick={() => setActiveTab("commercial")}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === "commercial"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Commercial
            </button>
            <button
              onClick={() => setActiveTab("roll-off")}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === "roll-off"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Roll-off
            </button>
          </div>
        </div>

        <div className="flex gap-2 ml-auto">
          <div className="flex border rounded-md overflow-hidden shadow-sm">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              className={viewMode === "card" ? "" : "bg-white"}
              onClick={() => setViewMode("card")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className={viewMode === "table" ? "" : "bg-white"}
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "table" ? (
        <DisposalFeesTable
          data={disposalFees}
          onViewFee={handleViewFee}
          onEditFee={handleEditFee}
          activeTab={activeTab}
          onEditFee={handleEditFee}
          activeTab={activeTab}
        />
      ) : (
        <div className="space-y-4">
          {disposalFees
            .filter((fee) => activeTab === "all" || fee.businessLine.toLowerCase() === activeTab)
            .map((fee) => (
              <div
                key={fee.id}
                className="border border-slate-300 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-4 bg-slate-100 border-b border-slate-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">{fee.name}</h3>
                      <Badge variant="outline" className="bg-slate-100">
                        {fee.businessLine}
                      </Badge>
                      {fee.materials ? (
                        fee.materials.map((material, idx) => (
                          <Badge key={idx} variant="outline" className="bg-slate-100">
                            {material}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="bg-slate-100">
                          {fee.material}
                        </Badge>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white">
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
                    <div className="text-sm font-medium">{fee.type}</div>
                    <div className="text-xs text-muted-foreground">Fee Type</div>
                  </div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
                    <div className="text-sm font-medium">{fee.minCharge}</div>
                    <div className="text-xs text-muted-foreground">Minimum Charge</div>
                  </div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
                    <div className="text-sm font-medium">{fee.freeTonnage} tons</div>
                    <div className="text-xs text-muted-foreground">Free Tonnage</div>
                  </div>
                  <div className="p-2 rounded-md bg-slate-50 border border-slate-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
                    <div className="text-sm font-medium">{fee.tiers.length}</div>
                    <div className="text-xs text-muted-foreground">Pricing Tiers</div>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-2 bg-white">
                  <Button variant="outline" size="sm" onClick={() => handleViewFee(fee)}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )

  const renderDetailView = () => {
    if (!selectedFee) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => setActiveView("list")} className="bg-white">
            <ChevronDown className="h-4 w-4 mr-2 rotate-90" />
            Back to List
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEditFee(selectedFee)} className="bg-white">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="bg-white">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-md border-slate-300 overflow-hidden">
              <CardHeader className="bg-slate-100 border-b border-slate-300">
                <CardTitle>{selectedFee.name} Details</CardTitle>
                <CardDescription>{selectedFee.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
                    <h3 className="text-sm font-medium mb-1">Status</h3>
                    <Badge variant="success" className="bg-green-100 text-green-800">
                      {selectedFee.status}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
                    <h3 className="text-sm font-medium mb-1">General Ledger</h3>
                    <p>{selectedFee.glCode}</p>
                  </div>
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
                    <h3 className="text-sm font-medium mb-1">Business Line</h3>
                    <p>{selectedFee.businessLine}</p>
                  </div>
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
                    <h3 className="text-sm font-medium mb-1">Materials</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedFee.materials && selectedFee.materials.length > 0 ? (
                        selectedFee.materials.map((material, idx) => (
                          <Badge key={idx} variant="outline" className="bg-white">
                            {material}
                          </Badge>
                        ))
                      ) : (
                        <p>{selectedFee.material}</p>
                      )}
                    </div>
                  </div>
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
                    <h3 className="text-sm font-medium mb-1">Fee Type</h3>
                    <p>{selectedFee.type}</p>
                  </div>
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
                    <h3 className="text-sm font-medium mb-1">Default Rate</h3>
                    <p className="font-bold">{selectedFee.defaultRate}</p>
                  </div>
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
                    <h3 className="text-sm font-medium mb-1">Free Tonnage</h3>
                    <p>{selectedFee.freeTonnage} tons</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-slate-300 overflow-hidden">
              <CardHeader className="bg-slate-100 border-b border-slate-300">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tiered Pricing</CardTitle>
                    <CardDescription>Pricing tiers for this disposal fee</CardDescription>
                  </div>
                  <Button size="sm" className="bg-slate-200 hover:bg-slate-300 text-slate-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tier
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="rounded-md border border-slate-300 shadow-inner overflow-hidden">
                  {renderTierTable(selectedFee.tiers)}
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground bg-slate-50 border-t">
                <p>
                  Tiered pricing allows for different rates based on tonnage. For example, the first 2 tons might be
                  charged at $65/ton, while tonnage between 2-5 tons is charged at $55/ton, and anything over 5 tons is
                  charged at $45/ton.
                </p>
              </CardFooter>
            </Card>

            <Card className="shadow-md border-slate-300 overflow-hidden">
              <CardHeader className="bg-slate-100 border-b border-slate-300">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Linked Services</CardTitle>
                    <CardDescription>Services using this disposal fee</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setShowAutolinkSettingsDialog(true)}>
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Autolinking Settings</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button size="sm" className="bg-slate-200 hover:bg-slate-300 text-slate-800">
                      <Link className="h-4 w-4 mr-2" />
                      Link Service
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="rounded-md border border-slate-300 shadow-inner overflow-hidden">
                  {selectedFee.linkedServices > 0 ? (
                    <Table>
                      <TableHeader className="bg-slate-200">
                        <TableRow>
                          <TableHead>Service Name</TableHead>
                          <TableHead>Business Line</TableHead>
                          <TableHead>Material</TableHead>
                          <TableHead>Custom Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: selectedFee.linkedServices }).map((_, index) => (
                          <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
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
                    <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50">
                      <p className="text-muted-foreground mb-4">
                        No services are currently linked to this disposal fee.
                      </p>
                      <Button size="sm" className="bg-slate-200 hover:bg-slate-300 text-slate-800">
                        <Link className="h-4 w-4 mr-2" />
                        Link Service
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Autolinked Services Card */}
            {autolinkEnabled && (
              <Card className="shadow-md border-slate-300 overflow-hidden">
                <CardHeader className="bg-blue-100 border-b border-blue-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-blue-800">Autolinked Services</CardTitle>
                      <CardDescription className="text-blue-700">
                        Services that can be automatically linked to this fee
                      </CardDescription>
                    </div>
                    {autolinkedServices.length > 0 && (
                      <Button
                        size="sm"
                        onClick={handleLinkAllServices}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Link All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoadingServices ? (
                    <div className="flex justify-center items-center py-8">
                      <p>Loading services...</p>
                    </div>
                  ) : autolinkedServices.length > 0 ? (
                    <div className="rounded-md border border-blue-300 shadow-inner overflow-hidden">
                      <Table>
                        <TableHeader className="bg-blue-200">
                          <TableRow>
                            <TableHead>Service Name</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead>Container</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {autolinkedServices.map((service, index) => (
                            <TableRow key={service.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-100/50"}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{service.name}</div>
                                  <div className="text-xs text-muted-foreground">{service.address}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div>{service.accountName}</div>
                                  <div className="text-xs text-muted-foreground">{service.accountNumber}</div>
                                </div>
                              </TableCell>
                              <TableCell>{service.containerName}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleLinkService(service)}
                                  className="bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
                                >
                                  <LinkIcon className="h-4 w-4 mr-1" />
                                  Link
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-muted-foreground mb-4">No autolinked services found for this disposal fee.</p>
                      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Autolinking is enabled</AlertTitle>
                        <AlertDescription>
                          Services with matching business line{autolinkByMaterial ? " and material type" : ""} will be
                          automatically linked to this fee.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="shadow-md border-slate-300 overflow-hidden">
              <CardHeader className="bg-slate-100 border-b border-slate-300">
                <CardTitle>Associated Fees & Taxes</CardTitle>
                <CardDescription>Additional fees and taxes applied with this disposal fee</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {linkedFees.length > 0 ? (
                  <div className="space-y-2">
                    {linkedFees.map((fee) => (
                      <div
                        key={fee.id}
                        className="flex items-center justify-between p-3 border border-slate-300 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors shadow-sm"
                      >
                        <div>
                          <div className="font-medium">{fee.name}</div>
                          <div className="text-xs text-muted-foreground">{fee.type}</div>
                        </div>
                        <div className="font-medium">{fee.amount}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-slate-50 rounded-md">
                    <p className="text-muted-foreground">No associated fees or taxes</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 border-t">
                <Button size="sm" variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fee or Tax
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-md border-slate-300 overflow-hidden">
              <CardHeader className="bg-slate-100 border-b border-slate-300">
                <CardTitle>Pricing Zones</CardTitle>
                <CardDescription>Zones where this disposal fee applies</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {pricingZones.map((zone) => (
                    <div
                      key={zone.id}
                      className="flex items-center space-x-2 p-3 rounded-md bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm"
                    >
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

            <Card className="shadow-md border-slate-300 overflow-hidden">
              <CardHeader className="bg-slate-100 border-b border-slate-300">
                <CardTitle>Calculation Example</CardTitle>
                <CardDescription>Example of how this disposal fee is calculated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="p-4 border border-slate-300 rounded-md bg-gradient-to-r from-slate-100 to-white shadow-inner">
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

                    <p className="mt-4 p-2 font-bold bg-slate-200 border border-slate-300 rounded-md text-center shadow-sm">
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

            {/* Autolinking Settings Card */}
            <Card className="shadow-md border-slate-300 overflow-hidden">
              <CardHeader className="bg-blue-100 border-b border-blue-300">
                <CardTitle className="text-blue-800">Autolinking</CardTitle>
                <CardDescription className="text-blue-700">Configure automatic service linking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6 bg-gradient-to-b from-blue-50/50 to-white">
                <div className="flex items-center justify-between p-3 rounded-md bg-white border border-blue-300 shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-medium">Enable Autolinking</div>
                    <div className="text-xs text-muted-foreground">Automatically link services to this fee</div>
                  </div>
                  <Switch checked={autolinkEnabled} onCheckedChange={setAutolinkEnabled} />
                </div>

                <div className={`space-y-2 ${!autolinkEnabled ? "opacity-50 pointer-events-none" : ""}`}>
                  <div className="flex items-center justify-between p-3 rounded-md bg-white border border-blue-300 shadow-sm">
                    <div className="space-y-0.5">
                      <div className="font-medium">Match by Material Type</div>
                      <div className="text-xs text-muted-foreground">
                        Only link services with matching material type
                      </div>
                    </div>
                    <Switch checked={autolinkByMaterial} onCheckedChange={setAutolinkByMaterial} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-md bg-white border border-blue-300 shadow-sm">
                    <div className="space-y-0.5">
                      <div className="font-medium">Match by Location</div>
                      <div className="text-xs text-muted-foreground">Only link services in the same location</div>
                    </div>
                    <Switch checked={autolinkByLocation} onCheckedChange={setAutolinkByLocation} />
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedFee ? "Edit Disposal Fee" : "Create Disposal Fee"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="fee-name">Name</Label>
            <Input id="fee-name" defaultValue={selectedFee?.name || ""} placeholder="Enter fee name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fee-gl-code">General Ledger Account</Label>
            <Select defaultValue={selectedFee?.glCode || ""}>
              <SelectTrigger id="fee-gl-code">
                <SelectValue placeholder="Select general ledger account" />
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
            <Label htmlFor="fee-material">Material Type</Label>
            <Select defaultValue={selectedFee?.material?.toLowerCase() || ""}>
              <SelectTrigger id="fee-material">
                <SelectValue placeholder="Select material type" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material.id} value={material.name.toLowerCase()}>
                    {material.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Label htmlFor="fee-free-tonnage">Free Tonnage</Label>
            <div className="relative">
              <Input id="fee-free-tonnage" defaultValue={selectedFee?.freeTonnage || "0"} placeholder="0.00" />
              <span className="absolute right-3 top-2.5 text-muted-foreground">tons</span>
            </div>
          </div>

          <div className="col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="fee-use-tiers">Use Tiered Pricing</Label>
              <Switch id="fee-use-tiers" checked={useTieredPricing} onCheckedChange={setUseTieredPricing} />
            </div>
            <p className="text-xs text-muted-foreground">
              Enable tiered pricing to charge different rates based on tonnage ranges.
            </p>
          </div>

          <div
            id="tiered-pricing-section"
            className={`col-span-2 space-y-4 border rounded-md p-4 mt-2 ${!useTieredPricing ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Tiered Pricing</h3>
              <Button size="sm" variant="outline" onClick={() => setShowAddTierDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Tier
              </Button>
            </div>

            {currentTiers.length > 0 ? (
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
                  {currentTiers.map((tier, index) => (
                    <TableRow key={index}>
                      <TableCell>{tier.from}</TableCell>
                      <TableCell>{tier.to === null ? "∞" : tier.to}</TableCell>
                      <TableCell>${tier.rate.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              setCurrentTiers(currentTiers.filter((t) => t.id !== tier.id))
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No tiers defined. Click "Add Tier" to create your first pricing tier.
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              <p>Tiered pricing allows you to set different rates based on quantity ranges.</p>
              <p>For example: $65/ton for 0-2 tons, $55/ton for 2-5 tons, and $45/ton for over 5 tons.</p>
            </div>
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="fee-description">Description</Label>
            <Textarea
              id="fee-description"
              defaultValue={selectedFee?.description || ""}
              placeholder="Enter fee description"
              rows={3}
            />
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

          {/* Autolinking settings in edit dialog */}
          <div className="col-span-2 space-y-2 border-t pt-4 mt-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="fee-autolink">Enable Autolinking</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically link services with matching business line to this fee
                </p>
              </div>
              <Switch id="fee-autolink" checked={autolinkEnabled} onCheckedChange={setAutolinkEnabled} />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setShowEditDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowEditDialog(false)}>{selectedFee ? "Save Changes" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const renderAutolinkSettingsDialog = () => (
    <Dialog open={showAutolinkSettingsDialog} onOpenChange={setShowAutolinkSettingsDialog}>
      <DialogContent className="bg-gradient-to-b from-blue-50/30 to-white">
        <DialogHeader className="bg-blue-100 -mx-6 -mt-6 px-6 pt-6 pb-4 border-b border-blue-300">
          <DialogTitle>Autolinking Settings</DialogTitle>
          <DialogDescription>Configure how services are automatically linked to fees</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between p-3 rounded-md bg-white border border-blue-300 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="settings-autolink-enabled">Enable Autolinking</Label>
              <p className="text-xs text-muted-foreground">Automatically link services to fees</p>
            </div>
            <Switch id="settings-autolink-enabled" checked={autolinkEnabled} onCheckedChange={setAutolinkEnabled} />
          </div>

          <div className={!autolinkEnabled ? "opacity-50 pointer-events-none" : ""}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-white border border-blue-300 shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="settings-autolink-material">Match by Material Type</Label>
                  <p className="text-xs text-muted-foreground">Only link services with matching material type</p>
                </div>
                <Switch
                  id="settings-autolink-material"
                  checked={autolinkByMaterial}
                  onCheckedChange={setAutolinkByMaterial}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-md bg-white border border-blue-300 shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="settings-autolink-location">Match by Location</Label>
                  <p className="text-xs text-muted-foreground">Only link services in the same location</p>
                </div>
                <Switch
                  id="settings-autolink-location"
                  checked={autolinkByLocation}
                  onCheckedChange={setAutolinkByLocation}
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h4 className="font-medium mb-2">How Autolinking Works</h4>
              <p className="text-sm text-muted-foreground">
                Autolinking automatically finds services that match the business line of this fee. When enabled, the
                system will suggest services that can be linked to this fee based on your matching criteria.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You can review suggested services and link them individually or all at once.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-slate-100 -mx-6 -mb-6 px-6 py-4 border-t border-slate-300">
          <Button variant="outline" onClick={() => setShowAutolinkSettingsDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowAutolinkSettingsDialog(false)} className="bg-blue-600 hover:bg-blue-700">
            Save Settings
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
            <Input
              id="tier-from"
              placeholder="0.00"
              value={newTier.from}
              onChange={(e) => setNewTier({ ...newTier, from: Number.parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier-to">To (tons)</Label>
            <Input
              id="tier-to"
              placeholder="0.00"
              value={newTier.to === null ? "" : newTier.to}
              onChange={(e) => {
                const value = e.target.value.trim() === "" ? null : Number.parseFloat(e.target.value) || 0
                setNewTier({ ...newTier, to: value })
              }}
            />
            <p className="text-xs text-muted-foreground">Leave empty for unlimited</p>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="tier-rate">Rate per Ton</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input
                id="tier-rate"
                className="pl-7"
                placeholder="0.00"
                value={newTier.rate}
                onChange={(e) => setNewTier({ ...newTier, rate: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddTierDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Add the new tier with a generated ID
              const newTierWithId = {
                ...newTier,
                id: currentTiers.length > 0 ? Math.max(...currentTiers.map((t) => t.id)) + 1 : 1,
              }

              setCurrentTiers([...currentTiers, newTierWithId])
              setNewTier({ from: 0, to: null, rate: 0 }) // Reset for next time
              setShowAddTierDialog(false)
            }}
          >
            Add Tier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      {activeView === "list" ? renderListView() : renderDetailView()}
      {renderEditDialog()}
      {renderAddTierDialog()}
      {renderAutolinkSettingsDialog()}
    </>
  )
}
