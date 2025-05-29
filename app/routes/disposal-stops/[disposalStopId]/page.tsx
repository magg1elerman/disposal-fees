import React from "react";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Calendar, MapPin, Truck, FileText, Clock, Plus, Edit, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DisposalTicketModalV3 from "@/app/components/DisposalTicketModal-v3";

const dummyStops = {
  "1001": {
    id: "1001",
    status: "pending",
    address: "123 Main St, City, State 12345",
    scheduledDate: "2024-01-15",
    scheduledTime: "09:00 AM",
    workOrders: [
      {
        id: "WO-1001",
        type: "Disposal",
        status: "In Progress",
        items: [
          { id: "1", name: "Couch", quantity: 1 },
          { id: "2", name: "Mattress", quantity: 2 }
        ]
      }
    ],
    disposalTickets: [
      {
        id: "DT-1001",
        status: "Completed",
        createdAt: "2024-01-15 09:15 AM",
        weight: "250 lbs"
      }
    ]
  }
  // Add more stops if needed
};

export default function DisposalStopPage({ params }: { params: { disposalStopId: string } }) {
  const { disposalStopId } = params;
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  
  // Get the specific stop data or default to 1001 if not found
  const stop = dummyStops[disposalStopId] ? dummyStops[disposalStopId] : dummyStops["1001"];
  
  const handleSaveDisposalTicket = (ticketData: any) => {
    console.log("Saving disposal ticket:", ticketData);
    // In a real app, you would update the stop data with the new ticket
    setIsTicketModalOpen(false);
  };
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Header with back button and actions */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/disposal-stops" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Disposal Stops
        </Link>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" onClick={() => setIsTicketModalOpen(true)} />
            Add Ticket
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Stop Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Stop Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">{stop.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Scheduled Date</div>
                    <div className="text-sm text-muted-foreground">{stop.scheduledDate}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Scheduled Time</div>
                    <div className="text-sm text-muted-foreground">{stop.scheduledTime}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Work Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {stop.workOrders.map((wo) => (
                <div key={wo.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{wo.id}</div>
                      <div className="text-sm text-muted-foreground">{wo.type}</div>
                    </div>
                    <Badge>{wo.status}</Badge>
                  </div>
                  <div className="space-y-2">
                    {wo.items.map((item) => (
                      <div key={item.id} className="text-sm">
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Middle column - Disposal Tickets */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Disposal Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              {stop.disposalTickets.map((ticket) => (
                <div key={ticket.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{ticket.id}</div>
                      <div className="text-sm text-muted-foreground">{ticket.createdAt}</div>
                    </div>
                    <Badge>{ticket.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Weight: {ticket.weight}
                  </div>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">No activity recorded yet.</div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Disposal Ticket Modal */}
      <DisposalTicketModalV3
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        workOrderId={stop.workOrders[0]?.id || "WO-temp"}
        onSave={handleSaveDisposalTicket}
        source="office"
      />
    </div>
  );
}