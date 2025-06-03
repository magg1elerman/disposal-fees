import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Truck, FileText, Clock, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const dummyStops = {
  "1001": {
    name: "Disposal Stop 1001",
    address: "123 Main St, San Diego, CA 92101",
    ticketNumber: "DT-20240601-1001",
    photoUrl: "/public/disposal-ticket-example.png",
    mapUrl:
      "https://maps.googleapis.com/maps/api/staticmap?center=32.7157,-117.1611&zoom=15&size=400x150&key=YOUR_API_KEY",
    date: "June 1, 2024",
    time: "10:30 AM",
    status: "Completed",
    materials: [
      { name: "Mixed Waste", units: "2.5 tons", price: "$150.00" },
      { name: "Recyclables", units: "1.0 ton", price: "$40.00" },
    ],
    workOrders: [
      { id: "WO-001", label: "Work Order #WO-001", status: "Completed", date: "06/01/2024" },
      { id: "WO-002", label: "Work Order #WO-002", status: "In Progress", date: "06/01/2024" },
    ],
    routes: [
      { id: "R-01", label: "Route #1", recurrence: "Daily" },
      { id: "R-02", label: "Route #2", recurrence: "Weekly" },
    ],
    auditTrail: [
      { time: "2024-06-01 10:00", action: "Route assignment changed by Route Manager" },
      { time: "2024-06-01 11:00", action: "Work order added from Tablet" },
      { time: "2024-06-01 12:00", action: "Ticket reconciled via Disposal Ticket Tool" },
      { time: "2024-06-01 12:30", action: "Material quantity updated by Route Manager" },
    ],
    materialAudit: [
      { time: "2024-06-01 12:30", change: "Mixed Waste: 2.0 → 2.5 tons by Route Manager" },
      { time: "2024-06-01 12:35", change: "Recyclables: price updated from $35.00 to $40.00 by Disposal Ticket Tool" },
    ],
    driver: "John Smith",
    vehicle: "Truck #T-123",
    totalWeight: "3.5 tons",
    totalCost: "$190.00",
  },
  "1002": {
    name: "Disposal Stop 1002",
    address: "456 Oak Ave, San Diego, CA 92103",
    ticketNumber: "DT-20240528-1002",
    photoUrl: "/public/disposal-ticket-example.png",
    mapUrl:
      "https://maps.googleapis.com/maps/api/staticmap?center=32.7457,-117.1611&zoom=15&size=400x150&key=YOUR_API_KEY",
    date: "May 28, 2024",
    time: "08:15 AM",
    status: "Pending",
    materials: [{ name: "Construction Debris", units: "3.2 tons", price: "$192.00" }],
    workOrders: [{ id: "WO-003", label: "Work Order #WO-003", status: "Pending", date: "05/28/2024" }],
    routes: [{ id: "R-03", label: "Route #3", recurrence: "Weekly" }],
    auditTrail: [
      { time: "2024-05-28 08:00", action: "Disposal stop created by Dispatch" },
      { time: "2024-05-28 08:10", action: "Driver assigned by Route Manager" },
      { time: "2024-05-28 08:15", action: "Arrival at disposal site recorded" },
    ],
    materialAudit: [{ time: "2024-05-28 08:20", change: "Construction Debris: 0.0 → 3.2 tons by Scale Operator" }],
    driver: "Maria Garcia",
    vehicle: "Truck #T-456",
    totalWeight: "3.2 tons",
    totalCost: "$192.00",
  },
  "1003": {
    name: "Disposal Stop 1003",
    address: "789 Pine Rd, San Diego, CA 92104",
    ticketNumber: "DT-20240602-1003",
    photoUrl: "/public/disposal-ticket-example.png",
    mapUrl:
      "https://maps.googleapis.com/maps/api/staticmap?center=32.7257,-117.1811&zoom=15&size=400x150&key=YOUR_API_KEY",
    date: "June 2, 2024",
    time: "14:45 PM",
    status: "Completed",
    materials: [
      { name: "Green Waste", units: "1.8 tons", price: "$90.00" },
      { name: "Mixed Waste", units: "2.2 tons", price: "$132.00" },
      { name: "Hazardous Materials", units: "0.5 tons", price: "$75.00" },
    ],
    workOrders: [
      { id: "WO-004", label: "Work Order #WO-004", status: "Completed", date: "06/02/2024" },
      { id: "WO-005", label: "Work Order #WO-005", status: "Completed", date: "06/02/2024" },
      { id: "WO-006", label: "Work Order #WO-006", status: "Completed", date: "06/02/2024" },
    ],
    routes: [{ id: "R-04", label: "Route #4", recurrence: "Daily" }],
    auditTrail: [
      { time: "2024-06-02 14:00", action: "Arrival at disposal site recorded" },
      { time: "2024-06-02 14:30", action: "Multiple materials recorded by Scale Operator" },
      { time: "2024-06-02 14:45", action: "Departure from disposal site recorded" },
      { time: "2024-06-02 15:00", action: "Tickets reconciled via Disposal Ticket Tool" },
      { time: "2024-06-02 15:15", action: "Work orders marked as completed by Supervisor" },
    ],
    materialAudit: [
      { time: "2024-06-02 14:30", change: "Green Waste: 0.0 → 1.8 tons by Scale Operator" },
      { time: "2024-06-02 14:35", change: "Mixed Waste: 0.0 → 2.2 tons by Scale Operator" },
      { time: "2024-06-02 14:40", change: "Hazardous Materials: 0.0 → 0.5 tons by Scale Operator" },
    ],
    driver: "David Johnson",
    vehicle: "Truck #T-789",
    totalWeight: "4.5 tons",
    totalCost: "$297.00",
  },
  "1004": {
    name: "Disposal Stop 1004",
    address: "321 Maple Blvd, San Diego, CA 92105",
    ticketNumber: "DT-20240530-1004",
    photoUrl: "/public/disposal-ticket-example.png",
    mapUrl:
      "https://maps.googleapis.com/maps/api/staticmap?center=32.7357,-117.1711&zoom=15&size=400x150&key=YOUR_API_KEY",
    date: "May 30, 2024",
    time: "11:20 AM",
    status: "In Progress",
    materials: [{ name: "Recyclables", units: "1.5 tons", price: "$60.00" }],
    workOrders: [
      { id: "WO-007", label: "Work Order #WO-007", status: "In Progress", date: "05/30/2024" },
      { id: "WO-008", label: "Work Order #WO-008", status: "Pending", date: "05/30/2024" },
    ],
    routes: [{ id: "R-05", label: "Route #5", recurrence: "Weekly" }],
    auditTrail: [
      { time: "2024-05-30 11:00", action: "Arrival at disposal site recorded" },
      { time: "2024-05-30 11:20", action: "Initial weight recorded by Scale Operator" },
      { time: "2024-05-30 11:30", action: "Processing delay reported by Driver" },
    ],
    materialAudit: [{ time: "2024-05-30 11:20", change: "Recyclables: 0.0 → 1.5 tons by Scale Operator" }],
    driver: "Sarah Williams",
    vehicle: "Truck #T-321",
    totalWeight: "1.5 tons",
    totalCost: "$60.00",
  },
  // Add more stops if needed
}

export default async function DisposalStopPage({ params }: { params: { disposalStopId: string } }) {
  const { disposalStopId } = params

  // Get the specific stop data or default to 1001 if not found
  const stop = dummyStops[disposalStopId] ? dummyStops[disposalStopId] : dummyStops["1001"]
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Header with back button and actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link
            href="/routes/disposal-stops"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Disposal Stops
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Ticket
          </Button>
        </div>
      </div>

      {/* Main header with title and status */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{stop.name}</h1>
          <Badge className="px-3 py-1 bg-green-100 text-green-800 text-sm">{stop.status}</Badge>
        </div>
        <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {stop.date}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {stop.time}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {stop.address}
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Disposal Ticket Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Disposal Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-1">Ticket Number</div>
                    <div className="font-mono font-medium">{stop.ticketNumber}</div>
                  </div>
                    <Accordion type="single" collapsible className="w-full mt-4">
                      <AccordionItem value="material-audit-trail">
                        <AccordionTrigger>Materials</AccordionTrigger>
                        <AccordionContent>
                          <div className="mb-4">
                              <div className="text-sm text-gray-500 mb-1">Materials</div>
                              <div className="space-y-2 text-xs">
                                {stop.materials.map((mat, i) => (
                                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="color-red ">{mat.name}</div>
                                    <div className="flex items-center gap-4">
                                      <span className="text-gray-600">{mat.units}</span>
                                      <span className="font-semibold">{mat.price}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="pt-4">
                                <Button variant="outline" size="sm">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Material
                                </Button>
                              </div>
                          </div>
                          </AccordionContent>   
                      </AccordionItem>
            
                    </Accordion>                 
                 
                  <Accordion type="single" collapsible className="w-full mt-4">
                    <AccordionItem value="material-audit-trail">
                      <AccordionTrigger>Material Audit Trail</AccordionTrigger>
                      <AccordionContent>
                        <div className="text-xs space-y-1 pt-2">
                          {stop.materialAudit.map((entry, i) => (
                            <div key={i} className="flex gap-2 p-2 bg-gray-50 rounded">
                              <Clock className="h-3 w-3 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="text-gray-400">{entry.time}:</span> {entry.change}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div>
                    <div className="pt-4 flex justify-between items-center py-3 bg-blue-50 rounded-md">
                      <div className="font-medium">Total Weight</div>
                      <div className="font-semibold">{stop.totalWeight}</div>
                    </div>
                    <div className="flex justify-between items-center p-3 mt-2 bg-blue-50 rounded-md">
                      <div className="font-medium">Tipping Fee</div>
                      <div className="font-semibold text-lg">{stop.totalCost}</div>
                    </div>
                  </div>
                
                </div>

                <div className="flex-1">
                  <div className="border rounded-lg overflow-hidden">
                    <img src="/disposal-ticket-example.png" alt="Disposal Ticket" className="w-full object-contain" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Orders Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Associated Work Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stop.workOrders.map((wo) => (
                  <div
                    key={wo.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <Link
                          href={`/billing/work-orders/${wo.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {wo.label}
                        </Link>
                        <div className="text-xs text-gray-500">{wo.date}</div>
                      </div>
                    </div>
                    <Badge variant={wo.status === "Completed" ? "outline" : "secondary"}>{wo.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Routes Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Associated Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stop.routes.map((route) => (
                  <div
                    key={route.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">{route.label}</div>
                        <div className="text-xs text-gray-500">Recurrence: {route.recurrence}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Location Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden mb-4 border">
                <img src="/map-screenshot.png" alt="Map of disposal site" className="w-full h-[200px] object-cover" />
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Address</div>
                  <div className="font-medium">{stop.address}</div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">Driver</div>
                    <div className="font-medium">{stop.driver}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">Vehicle</div>
                    <div className="font-medium">{stop.vehicle}</div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Trail Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {stop.auditTrail.map((entry, i) => (
                  <div key={i} className="relative pl-5 pb-3 border-l border-gray-200 last:pb-0">
                    <div className="absolute left-0 top-0 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="text-xs text-gray-500">{entry.time}</div>
                    <div className="mt-1">{entry.action}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
