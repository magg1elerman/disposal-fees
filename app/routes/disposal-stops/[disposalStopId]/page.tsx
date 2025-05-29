import React from "react";

const dummyStops = {
  "1001": {
    name: "Disposal Stop 1001",
    address: "123 Main St, San Diego, CA 92101",
    ticketNumber: "DT-20240601-1001",
    photoUrl: "/public/disposal-ticket-example.png",
    mapUrl: "https://maps.googleapis.com/maps/api/staticmap?center=32.7157,-117.1611&zoom=15&size=400x150&key=YOUR_API_KEY",
    materials: [
      { name: "Mixed Waste", units: "2.5 tons", price: "$150.00" },
      { name: "Recyclables", units: "1.0 ton", price: "$40.00" },
    ],
    workOrders: [
      { id: "WO-001", label: "Work Order #WO-001" },
      { id: "WO-002", label: "Work Order #WO-002" },
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
  },
  // Add more stops if needed
};

export default function DisposalStopPage({ params }: { params: { disposalStopId: string } }) {
  const stop = dummyStops[params.disposalStopId] || dummyStops["1001"];
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{stop.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Disposal site and map */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Disposal Site</h2>
            <div className="mb-2 text-gray-700">
              <span className="block font-medium">Address:</span>
              <span>{stop.address}</span>
            </div>
           <div className="my-2">
              {/* Use the provided map screenshot as the map image */}
              <img
                src="/map-screenshot.png"
                alt="Map of disposal site"
                className="object-cover w-full h-full"
                style={{ minHeight: 120 }}
              />
            </div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Disposal Ticket</h2>
            <div className="mb-2">Ticket #: <span className="font-mono">{stop.ticketNumber}</span></div>
            <div className="my-2">
            <img
                src="/disposal-ticket-example.png"
                alt="Map of disposal site"
                className="object-cover w-full h-full"
                style={{ minHeight: 120 }}
              />
            </div>
            <div>
              <h3 className="font-semibold mt-2 mb-1">Materials</h3>
              <ul className="list-disc pl-5">
                {stop.materials.map((mat, i) => (
                  <li key={i}>{mat.name} - {mat.units} - {mat.price}</li>
                ))}
              </ul>
              <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">Add Material</button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <span className="font-semibold">Audit trail:</span>
              <ul className="list-disc pl-5 mt-1">
                {stop.materialAudit.map((entry, i) => (
                  <li key={i}>{entry.time}: {entry.change}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Right column: Work orders, routes, audit trail */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Associated Work Orders</h2>
            <ul className="list-disc pl-5">
              {stop.workOrders.map((wo) => (
                <li key={wo.id}>
                  <a href="#" className="text-blue-600 underline">{wo.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Associated Routes</h2>
            <ul className="list-disc pl-5">
              {stop.routes.map((route) => (
                <li key={route.id}>{route.label} (Recurrence: {route.recurrence})</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Audit Trail</h2>
            <ul className="list-disc pl-5 text-xs">
              {stop.auditTrail.map((entry, i) => (
                <li key={i}>[{entry.time}] {entry.action}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 