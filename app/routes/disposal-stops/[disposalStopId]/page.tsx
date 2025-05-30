"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { MapPin } from "lucide-react"

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
    // Add detailed timing information
    timing: {
      arrivalTime: "2024-06-01T10:15:32Z",
      dumpStartTime: "2024-06-01T10:18:45Z",
      dumpEndTime: "2024-06-01T10:42:12Z",
      departureTime: "2024-06-01T10:45:18Z",
      totalDuration: "29m 46s",
      dumpDuration: "23m 27s",
      idleTime: "6m 19s",
    },
    // Add geofence and tracking data
    geofence: {
      center: { lat: 32.7157, lng: -117.1611 },
      radius: 100, // meters
      entryPoint: { lat: 32.7155, lng: -117.1615, time: "2024-06-01T10:15:32Z" },
      exitPoint: { lat: 32.7159, lng: -117.1608, time: "2024-06-01T10:45:18Z" },
      dumpLocation: { lat: 32.7157, lng: -117.1611 },
    },
    driverPath: [
      { lat: 32.715, lng: -117.162, time: "2024-06-01T10:14:00Z", status: "approaching" },
      { lat: 32.7153, lng: -117.1617, time: "2024-06-01T10:15:00Z", status: "approaching" },
      { lat: 32.7155, lng: -117.1615, time: "2024-06-01T10:15:32Z", status: "arrived" },
      { lat: 32.7156, lng: -117.1613, time: "2024-06-01T10:16:30Z", status: "positioning" },
      { lat: 32.7157, lng: -117.1611, time: "2024-06-01T10:18:45Z", status: "dumping" },
      { lat: 32.7157, lng: -117.1611, time: "2024-06-01T10:42:12Z", status: "dump_complete" },
      { lat: 32.7158, lng: -117.161, time: "2024-06-01T10:44:00Z", status: "departing" },
      { lat: 32.7159, lng: -117.1608, time: "2024-06-01T10:45:18Z", status: "departed" },
      { lat: 32.7162, lng: -117.1605, time: "2024-06-01T10:46:00Z", status: "departed" },
    ],
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
      { time: "2024-06-01 10:15:32", action: "Vehicle entered geofence - Arrival detected", type: "geofence" },
      { time: "2024-06-01 10:18:45", action: "Dump operation started", type: "operation" },
      { time: "2024-06-01 10:42:12", action: "Dump operation completed", type: "operation" },
      { time: "2024-06-01 10:45:18", action: "Vehicle exited geofence - Departure detected", type: "geofence" },
      { time: "2024-06-01 11:00", action: "Work order added from Tablet", type: "manual" },
      { time: "2024-06-01 12:00", action: "Ticket reconciled via Disposal Ticket Tool", type: "manual" },
      { time: "2024-06-01 12:30", action: "Material quantity updated by Route Manager", type: "manual" },
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
  // Update other stops with similar timing data...
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
    timing: {
      arrivalTime: "2024-05-28T08:12:15Z",
      dumpStartTime: "2024-05-28T08:15:30Z",
      dumpEndTime: null,
      departureTime: null,
      totalDuration: "In Progress",
      dumpDuration: "In Progress",
      idleTime: "3m 15s",
    },
    geofence: {
      center: { lat: 32.7457, lng: -117.1611 },
      radius: 100,
      entryPoint: { lat: 32.7455, lng: -117.1615, time: "2024-05-28T08:12:15Z" },
      exitPoint: null,
      dumpLocation: { lat: 32.7457, lng: -117.1611 },
    },
    driverPath: [
      { lat: 32.745, lng: -117.162, time: "2024-05-28T08:10:00Z", status: "approaching" },
      { lat: 32.7455, lng: -117.1615, time: "2024-05-28T08:12:15Z", status: "arrived" },
      { lat: 32.7457, lng: -117.1611, time: "2024-05-28T08:15:30Z", status: "dumping" },
    ],
    materials: [{ name: "Construction Debris", units: "3.2 tons", price: "$192.00" }],
    workOrders: [{ id: "WO-003", label: "Work Order #WO-003", status: "Pending", date: "05/28/2024" }],
    routes: [{ id: "R-03", label: "Route #3", recurrence: "Weekly" }],
    auditTrail: [
      { time: "2024-05-28 08:12:15", action: "Vehicle entered geofence - Arrival detected", type: "geofence" },
      { time: "2024-05-28 08:15:30", action: "Dump operation started", type: "operation" },
    ],
    materialAudit: [{ time: "2024-05-28 08:20", change: "Construction Debris: 0.0 → 3.2 tons by Scale Operator" }],
    driver: "Maria Garcia",
    vehicle: "Truck #T-456",
    totalWeight: "3.2 tons",
    totalCost: "$192.00",
  },
  // Add similar data for other stops...
}

// Mock clock component
const Clock = () => <svg />

const Page = ({ params }: { params: { disposalStopId: string } }) => {
  const stopId = params.disposalStopId
  const stop = dummyStops[stopId]

  if (!stop) {
    return <div>Disposal Stop not found.</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">{stop.name}</h1>
        <p className="text-gray-500">{stop.address}</p>
        <Badge variant="secondary" className="mt-2">
          {stop.status}
        </Badge>
      </div>

      {/* Timing and Productivity Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Arrival Time</p>
                <p className="text-lg font-semibold text-green-600">
                  {stop.timing?.arrivalTime ? new Date(stop.timing.arrivalTime).toLocaleTimeString() : "N/A"}
                </p>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dump Duration</p>
                <p className="text-lg font-semibold text-blue-600">{stop.timing?.dumpDuration || "N/A"}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Departure Time</p>
                <p className="text-lg font-semibold text-red-600">
                  {stop.timing?.departureTime
                    ? new Date(stop.timing.departureTime).toLocaleTimeString()
                    : "In Progress"}
                </p>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${stop.timing?.departureTime ? "bg-red-500" : "bg-yellow-500"}`}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Duration</p>
                <p className="text-lg font-semibold text-gray-900">{stop.timing?.totalDuration || "N/A"}</p>
              </div>
              <Clock className="h-5 w-5 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {/* Ticket Information Card */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Ticket Information</CardTitle>
              <CardDescription>Details about the disposal ticket</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Ticket Number</p>
                  <p className="text-lg">{stop.ticketNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-lg">{stop.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="text-lg">{stop.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Driver</p>
                  <p className="text-lg">{stop.driver}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Vehicle</p>
                  <p className="text-lg">{stop.vehicle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Weight</p>
                  <p className="text-lg">{stop.totalWeight}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Cost</p>
                  <p className="text-lg">{stop.totalCost}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Materials Table Card */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Materials</CardTitle>
              <CardDescription>List of disposed materials</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stop.materials.map((material, i) => (
                    <TableRow key={i}>
                      <TableCell>{material.name}</TableCell>
                      <TableCell>{material.units}</TableCell>
                      <TableCell>{material.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Work Orders Card */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Work Orders</CardTitle>
              <CardDescription>Associated work orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stop.workOrders.map((workOrder, i) => (
                    <TableRow key={i}>
                      <TableCell>{workOrder.id}</TableCell>
                      <TableCell>{workOrder.label}</TableCell>
                      <TableCell>{workOrder.status}</TableCell>
                      <TableCell>{workOrder.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Routes Card */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Routes</CardTitle>
              <CardDescription>Associated routes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Recurrence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stop.routes.map((route, i) => (
                    <TableRow key={i}>
                      <TableCell>{route.id}</TableCell>
                      <TableCell>{route.label}</TableCell>
                      <TableCell>{route.recurrence}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Material Audit Card */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Material Audit</CardTitle>
              <CardDescription>Changes to material quantities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {stop.materialAudit.map((audit, i) => (
                  <div key={i} className="py-2 border-b last:border-none">
                    {audit.time} - {audit.change}
                  </div>
                ))}
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
                    <div
                      className={`absolute left-0 top-0 -translate-x-1/2 w-2 h-2 rounded-full ${
                        entry.type === "geofence"
                          ? "bg-blue-500"
                          : entry.type === "operation"
                            ? "bg-green-500"
                            : "bg-gray-500"
                      }`}
                    ></div>
                    <div className="text-xs text-gray-500">{entry.time}</div>
                    <div
                      className={`mt-1 ${
                        entry.type === "geofence"
                          ? "text-blue-700 font-medium"
                          : entry.type === "operation"
                            ? "text-green-700 font-medium"
                            : ""
                      }`}
                    >
                      {entry.action}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div>
          {/* Geofence Tracking Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Geofence Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden mb-4 border relative">
                <div className="w-full h-[300px] bg-gray-100 relative">
                  {/* Simulated map with geofence */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
                    {/* Geofence circle */}
                    <div
                      className="absolute border-2 border-dashed border-blue-400 rounded-full bg-blue-100 bg-opacity-30"
                      style={{
                        width: "120px",
                        height: "120px",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {/* Dump location */}
                      <div className="absolute w-4 h-4 bg-blue-600 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="absolute w-2 h-2 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                    </div>

                    {/* Driver path */}
                    <svg className="absolute inset-0 w-full h-full">
                      {/* Approach path */}
                      <path
                        d="M 50 250 Q 100 200 140 150"
                        stroke="#10b981"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="5,5"
                      />
                      {/* Inside geofence path */}
                      <path d="M 140 150 L 150 150" stroke="#3b82f6" strokeWidth="4" fill="none" />
                      {/* Exit path */}
                      <path
                        d="M 150 150 Q 200 120 250 100"
                        stroke="#ef4444"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="5,5"
                      />
                    </svg>

                    {/* Entry point */}
                    <div className="absolute w-3 h-3 bg-green-500 rounded-full" style={{ left: "140px", top: "150px" }}>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-700 whitespace-nowrap">
                        Entry
                      </div>
                    </div>

                    {/* Exit point */}
                    {stop.timing?.departureTime && (
                      <div className="absolute w-3 h-3 bg-red-500 rounded-full" style={{ left: "160px", top: "150px" }}>
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-red-700 whitespace-nowrap">
                          Exit
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded p-2 text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Arrival</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Dumping</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Departure</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Geofence Details</div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Radius:</span>
                      <span>{stop.geofence?.radius}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Entry Time:</span>
                      <span className="text-green-600">
                        {stop.geofence?.entryPoint?.time
                          ? new Date(stop.geofence.entryPoint.time).toLocaleTimeString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exit Time:</span>
                      <span className="text-red-600">
                        {stop.geofence?.exitPoint?.time
                          ? new Date(stop.geofence.exitPoint.time).toLocaleTimeString()
                          : "In Progress"}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm text-gray-500 mb-2">Productivity Metrics</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-500">Idle Time</div>
                      <div className="font-medium">{stop.timing?.idleTime || "N/A"}</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-500">Efficiency</div>
                      <div className="font-medium text-green-600">
                        {stop.timing?.dumpDuration && stop.timing?.totalDuration ? "78%" : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  View Full Tracking
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Photo Card */}
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Photo</CardTitle>
              <CardDescription>Disposal ticket photo</CardDescription>
            </CardHeader>
            <CardContent>
              <img src={stop.photoUrl || "/placeholder.svg"} alt="Disposal Ticket" className="rounded-md" />
            </CardContent>
          </Card>

          {/* Map Card */}
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Location</CardTitle>
              <CardDescription>Disposal stop location</CardDescription>
            </CardHeader>
            <CardContent>
              <img src={stop.mapUrl || "/placeholder.svg"} alt="Map" className="rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page
