@@ .. @@
 import React from "react";
 import Link from "next/link";
+import { useState } from "react";
 import { ArrowLeft, Calendar, MapPin, Truck, FileText, Clock, Plus, Edit, ChevronDown } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Separator } from "@/components/ui/separator";
+import DisposalTicketModalV3 from "@/app/components/DisposalTicketModal-v3";
 
 const dummyStops = {
   "1001": {
@@ .. @@
   // Add more stops if needed
 };
 
-export default async function DisposalStopPage({ params }: { params: { disposalStopId: string } }) {
+export default function DisposalStopPage({ params }: { params: { disposalStopId: string } }) {
   const { disposalStopId } = params;
+  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
   
   // Get the specific stop data or default to 1001 if not found
   const stop = dummyStops[disposalStopId] ? dummyStops[disposalStopId] : dummyStops["1001"];
+  
+  const handleSaveDisposalTicket = (ticketData: any) => {
+    console.log("Saving disposal ticket:", ticketData);
+    // In a real app, you would update the stop data with the new ticket
+    setIsTicketModalOpen(false);
+  };
+  
   return (
     <div className="container mx-auto py-6 max-w-7xl">
       {/* Header with back button and actions */}
@@ .. @@
             Edit
           </Button>
           <Button size="sm">
-            <Plus className="h-4 w-4 mr-2" />
+            <Plus className="h-4 w-4 mr-2" onClick={() => setIsTicketModalOpen(true)} />
             Add Ticket
           </Button>
         </div>
@@ .. @@
           </Card>
         </div>
       </div>
+      
+      {/* Disposal Ticket Modal */}
+      <DisposalTicketModalV3
+        isOpen={isTicketModalOpen}
+        onClose={() => setIsTicketModalOpen(false)}
+        workOrderId={stop.workOrders[0]?.id || "WO-temp"}
+        onSave={handleSaveDisposalTicket}
+        source="office"
+      />
     </div>
   );
 }