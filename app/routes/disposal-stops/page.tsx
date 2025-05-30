import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Truck, Search, Plus, Filter, ArrowUpDown } from "lucide-react";

export default function DisposalStopsListPage() {
  // Dummy data with unique IDs
  const stops = [
    { 
      id: "1001", 
      name: "Disposal Stop 1001", 
      address: "123 Main St, San Diego, CA", 
      tickets: 3, 
      lastActivity: "2024-06-01",
      status: "Completed",
      driver: "John Smith",
      site: "Metro Waste Facility"
    },
    { 
      id: "1002", 
      name: "Disposal Stop 1002", 
      address: "456 Oak Ave, San Diego, CA", 
      tickets: 1, 
      lastActivity: "2024-05-28",
      status: "Pending",
      driver: "Maria Garcia",
      site: "Miramar Landfill"
    },
    { 
      id: "1003", 
      name: "Disposal Stop 1003", 
      address: "789 Pine Rd, San Diego, CA", 
      tickets: 5, 
      lastActivity: "2024-06-02",
      status: "Completed",
      driver: "David Johnson",
      site: "EDCO Recycling"
    },
    { 
      id: "1004", 
      name: "Disposal Stop 1004", 
      address: "321 Maple Blvd, San Diego, CA", 
      tickets: 2, 
      lastActivity: "2024-05-30",
      status: "In Progress",
      driver: "Sarah Williams",
      site: "Metro Waste Facility"
    },
  ];
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Header with title and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Disposal Stops</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all disposal site visits</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Disposal Stop
          </Button>
        </div>
      </div>
      
      {/* Search and filter bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search disposal stops..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Disposal stops list */}
      <div className="space-y-4">
        {stops.map((stop) => (
          <Card key={`stop-${stop.id}`} className="hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <Link 
                href={`/routes/disposal-stops/${stop.id}`} 
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-blue-600">{stop.name}</h3>
                      <Badge 
                        className={`${
                          stop.status === "Completed" ? "bg-green-100 text-green-800" : 
                          stop.status === "In Progress" ? "bg-blue-100 text-blue-800" : 
                          "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {stop.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 md:gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        {stop.address}
                      </div>
                      <div className="flex items-center">
                        <Truck className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        {stop.driver}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-sm">
                    <div className="flex flex-col items-start md:items-end">
                      <div className="text-gray-500">Disposal Site</div>
                      <div className="font-medium">{stop.site}</div>
                    </div>
                    <div className="flex flex-col items-start md:items-end">
                      <div className="text-gray-500">Tickets</div>
                      <div className="font-medium">{stop.tickets}</div>
                    </div>
                    <div className="flex flex-col items-start md:items-end">
                      <div className="text-gray-500">Last Activity</div>
                      <div className="font-medium">{stop.lastActivity}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
