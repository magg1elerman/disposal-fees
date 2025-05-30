"use client"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Edit, ChevronDown, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

const dummyStops = {
  "1001": {
    name: "Disposal Stop 1001",
    address: "123 Main St, San Diego, CA 92101",
    ticketNumber: "DT-20240601-1001",
    photoUrl: "/disposal-ticket-example.png",
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
    accountName: "Tracy 250319-2",
    accountNumber: "HH-19675",
    workOrderNumber: "WO-05699355",
    containers: "1",
  },
  // Other stops data remains the same...
}

export default function DisposalStopPage({ params }: { params: { disposalStopId: string } }) {
  const { disposalStopId } = params

  // Get the specific stop data or default to 1001 if not found
  const stop = dummyStops[disposalStopId] ? dummyStops[disposalStopId] : dummyStops["1001"]

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Header section styled like the screenshot */}
      <div className="bg-gray-50 p-4 mb-6 rounded-md">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-gray-500 text-sm">{stop.accountName}</div>
            <h1 className="text-2xl font-bold">{stop.address}</h1>
            <div className="grid grid-cols-4 gap-6 mt-2">
              <div>
                <div className="text-gray-500 text-xs">Account Name</div>
                <div>{stop.accountName}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Account</div>
                <div className="text-blue-600">{stop.accountNumber}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Work Order</div>
                <div>{stop.workOrderNumber}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Containers</div>
                <div>{stop.containers}</div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Printer className="h-4 w-4" />
            </Button>
            <div className="flex items-center border rounded-md bg-white">
              <div className="px-4 py-2">{stop.date}</div>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/routes/disposal-stops"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-md px-3 py-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Return to: Disposal Stops
        </Link>
      </div>

      {/* Collapsible sections like in the screenshot */}
      <div className="space-y-4">
        {/* Timing information section - more compact and styled like the screenshot */}
        <div className="bg-white border rounded-md overflow-hidden">
          <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
            <div className="flex items-center">
              <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
              <h2 className="text-sm font-medium">Timing details</h2>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-gray-500">Arrival Time</div>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-medium">
                    {stop.timing?.arrivalTime
                      ? new Date(stop.timing.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Dump Duration</div>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="font-medium">{stop.timing?.dumpDuration || "N/A"}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Departure Time</div>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <span className="font-medium">
                    {stop.timing?.departureTime
                      ? new Date(stop.timing.departureTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "In Progress"}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Total Duration</div>
                <div className="flex items-center mt-1">
                  <Clock className="h-3 w-3 text-gray-500 mr-2" />
                  <span className="font-medium">{stop.timing?.totalDuration || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Work order details section */}
        <div className="bg-white border rounded-md overflow-hidden">
          <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
            <div className="flex items-center">
              <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
              <h2 className="text-sm font-medium">Work order details</h2>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <div className="text-xs text-gray-500">Service</div>
                <div className="p-2 border rounded-md mt-1 bg-white">Residential Weekly rc</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Recurrence</div>
                <div className="p-2 border rounded-md mt-1 bg-white">5x Weekly</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Billing Period</div>
                <div className="p-2 border rounded-md mt-1 bg-white">1 Month</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Price</div>
                <div className="p-2 border rounded-md mt-1 bg-white">$100.00</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-xs text-gray-500">Materials</div>
                <div className="space-y-2 mt-1">
                  {stop.materials.map((mat, i) => (
                    <div key={i} className="p-2 border rounded-md bg-white">
                      {mat.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">General Fees</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Quantity</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Price</div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>Fee total</div>
                  <div className="font-medium">$0.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geofence tracking section */}
        <div className="bg-white border rounded-md overflow-hidden">
          <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
            <div className="flex items-center">
              <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
              <h2 className="text-sm font-medium">Geofence tracking</h2>
            </div>
          </div>
          <div className="p-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-2">Geofence Details</div>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Radius:</span>
                    <span>{stop.geofence?.radius}m</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Entry Time:</span>
                    <span className="text-green-600">
                      {stop.geofence?.entryPoint?.time
                        ? new Date(stop.geofence.entryPoint.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Exit Time:</span>
                    <span className="text-red-600">
                      {stop.geofence?.exitPoint?.time
                        ? new Date(stop.geofence.exitPoint.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "In Progress"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-2">Productivity Metrics</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-gray-500">Idle Time</div>
                    <div className="font-medium">{stop.timing?.idleTime || "N/A"}</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-gray-500">Efficiency</div>
                    <div className="font-medium text-green-600">
                      {stop.timing?.dumpDuration && stop.timing?.totalDuration ? "78%" : "N/A"}
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-gray-500">Total Weight</div>
                    <div className="font-medium">{stop.totalWeight}</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-gray-500">Total Cost</div>
                    <div className="font-medium">{stop.totalCost}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disposal ticket section */}
        <div className="bg-white border rounded-md overflow-hidden">
          <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
            <div className="flex items-center">
              <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
              <h2 className="text-sm font-medium">Disposal ticket</h2>
            </div>
            <Button variant="outline" size="sm" className="h-8">
              Add disposal ticket
            </Button>
          </div>
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Ticket Number</div>
                  <div className="font-mono font-medium">{stop.ticketNumber}</div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Materials</div>
                  <div className="space-y-2">
                    {stop.materials.map((mat, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div className="font-medium">{mat.name}</div>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">{mat.units}</span>
                          <span className="font-semibold">{mat.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="border rounded-lg overflow-hidden">
                  <img src="/disposal-ticket-example.png" alt="Disposal Ticket" className="w-full object-contain" />
                </div>

                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-1">Material Audit Trail</div>
                  <div className="text-xs space-y-1 mt-2">
                    {stop.materialAudit.map((entry, i) => (
                      <div key={i} className="flex gap-2 p-2 bg-gray-50 rounded">
                        <Clock className="h-3 w-3 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-gray-400">{entry.time}:</span> {entry.change}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit trail section */}
        <div className="bg-white border rounded-md overflow-hidden">
          <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
            <div className="flex items-center">
              <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
              <h2 className="text-sm font-medium">Audit trail</h2>
            </div>
          </div>
          <div className="p-4">
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
          </div>
        </div>
      </div>
    </div>
  )
}
