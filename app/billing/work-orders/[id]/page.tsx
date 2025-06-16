"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import DisposalTicketModalV3 from '@/app/components/DisposalTicketModal-v3';
import DisposalTicketModalV4a from '@/app/components/DisposalTicketModal-v4a';
import DisposalTicketModalV4b from '@/app/components/DisposalTicketModal-v4b';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DisposalTicket {
  isPricingPerTon: boolean;
  pricing: {
    rate: number;
    includedTonnage?: number;
    overageThreshold?: number;
    overageFee?: number;
    containerRate?: number;
  };
  calculatedPrice: number;
  ticketImage: string | null;
  actualTonnage?: number;
}

const mockWorkOrders = [
  { 
    id: 'WO-05478926',
    account: 'HH-9134',
    customer: 'Samantha264Long675',
    billingProfile: 'Test-Astro [M-J-S-D]',
    serviceDate: '04/28/2025',
    status: 'Scheduled',
    serviceType: 'Recurring',
    serviceName: 'West Side Residential',
    address: '334 Main Street, Vista, CA 92084',
    disposalTicket: null as DisposalTicket | null
  },
  {
    id: 'WO-05488226',
    account: 'HH-19640',
    customer: 'Stest 20250218/01',
    billingProfile: '51 RO Monthly',
    serviceDate: '04/30/2025',
    status: 'Scheduled',
    serviceType: 'Recurring',
    serviceName: 'Commercial Daily',
    address: '123 Oak Ave, Vista, CA 92084',
    disposalTicket: null as DisposalTicket | null
  }
];

export default function WorkOrderDetailPage() {
  const params = useParams();
  const { id } = params;
  const [workOrders, setWorkOrders] = useState(mockWorkOrders);
  const [isModal2bOpen, setIsModal2bOpen] = useState(false);
  const [isMobileModal2bOpen, setIsMobileModal2bOpen] = useState(false);
  const [isScaleModal2bOpen, setIsScaleModal2bOpen] = useState(false);
  const [isModal4aOpen, setIsModal4aOpen] = useState(false);
  const [isMobileModal4aOpen, setIsMobileModal4aOpen] = useState(false);
  const [isScaleModal4aOpen, setIsScaleModal4aOpen] = useState(false);
  const [isModal4bOpen, setIsModal4bOpen] = useState(false);
  const [isMobileModal4bOpen, setIsMobileModal4bOpen] = useState(false);
  const [isScaleModal4bOpen, setIsScaleModal4bOpen] = useState(false);
  const [isVersion3Open, setIsVersion3Open] = useState(false);
  
  const workOrder = workOrders.find((wo) => wo.id === id);

  if (!workOrder) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Work Order Not Found</h1>
          <Link href="/billing" className="text-blue-600 hover:underline">
            Back to Work Orders
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveDisposalTicket = (ticketData: DisposalTicket) => {
    const updatedWorkOrders = workOrders.map(wo => 
      wo.id === id ? { ...wo, disposalTicket: ticketData } : wo
    );
    setWorkOrders(updatedWorkOrders);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Work Order Details: {workOrder.id}</h1>
          <Link href="/billing" className="text-blue-600 hover:underline">
            Back to Work Orders
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-600 text-sm">Customer</label>
                <div className="text-blue-600">{workOrder.customer}</div>
              </div>
              <div>
                <label className="block text-gray-600 text-sm">Account #</label>
                <div>{workOrder.account}</div>
              </div>
              <div>
                <label className="block text-gray-600 text-sm">Address</label>
                <div>{workOrder.address}</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Service Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-600 text-sm">Service Type</label>
                <div>{workOrder.serviceType}</div>
              </div>
              <div>
                <label className="block text-gray-600 text-sm">Service Name</label>
                <div>{workOrder.serviceName}</div>
              </div>
              <div>
                <label className="block text-gray-600 text-sm">Service Date</label>
                <div>{workOrder.serviceDate}</div>
              </div>
              <div>
                <label className="block text-gray-600 text-sm">Status</label>
                <div>{workOrder.status}</div>
              </div>
              <div>
                <label className="block text-gray-600 text-sm">Billing Profile</label>
                <div>{workOrder.billingProfile}</div>
              </div>
            </div>
          </div>
        </div>

        {workOrder.disposalTicket ? (
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Disposal Ticket Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 text-sm">Pricing Type</label>
                  <div>{workOrder.disposalTicket.isPricingPerTon ? 'Per Ton' : 'Per Container'}</div>
                </div>
                
                {workOrder.disposalTicket.isPricingPerTon ? (
                  <>
                    <div>
                      <label className="block text-gray-600 text-sm">Rate</label>
                      <div>${workOrder.disposalTicket.pricing.rate}/ton</div>
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm">Included Tonnage</label>
                      <div>{workOrder.disposalTicket.pricing.includedTonnage} tons</div>
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm">Overage Threshold</label>
                      <div>{workOrder.disposalTicket.pricing.overageThreshold} tons</div>
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm">Overage Fee</label>
                      <div>${workOrder.disposalTicket.pricing.overageFee}/ton</div>
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm">Actual Tonnage</label>
                      <div>{workOrder.disposalTicket.actualTonnage} tons</div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-gray-600 text-sm">Container Rate</label>
                    <div>${workOrder.disposalTicket.pricing.containerRate}</div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-600 text-sm">Total Price</label>
                  <div className="text-xl font-semibold text-blue-600">
                    ${workOrder.disposalTicket.calculatedPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              {workOrder.disposalTicket.ticketImage && (
                <div>
                  <label className="block text-gray-600 text-sm mb-2">Ticket Image</label>
                  <img
                    src={workOrder.disposalTicket.ticketImage}
                    alt="Disposal Ticket"
                    className="max-w-full h-auto rounded border"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <button
                onClick={() => setIsModal2bOpen(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                Edit Disposal Ticket
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Disposal Ticket</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-3">Version 4 (Current)</h3>
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-600">v04a</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => setIsModal4aOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Disposal Ticket - Office
                          </button>
                          <button
                            onClick={() => setIsMobileModal4aOpen(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Disposal Ticket - Mobile
                          </button>
                          <button
                            onClick={() => setIsScaleModal4aOpen(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            Disposal Ticket - Scale
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-600">v04b</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => setIsModal4bOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Disposal Ticket - Office
                          </button>
                          <button
                            onClick={() => setIsMobileModal4bOpen(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Disposal Ticket - Mobile
                          </button>
                          <button
                            onClick={() => setIsScaleModal4bOpen(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            Disposal Ticket - Scale
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Collapsible
                  open={isVersion3Open}
                  onOpenChange={setIsVersion3Open}
                  className="border rounded-lg"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50">
                    <h3 className="text-md font-medium">Version 3</h3>
                    <ChevronDown className={`h-5 w-5 transition-transform ${isVersion3Open ? 'transform rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4">
                    <div className="flex gap-4">
                      <button
                        onClick={() => setIsModal2bOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Disposal Ticket - Office
                      </button>
                      <button
                        onClick={() => setIsMobileModal2bOpen(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Disposal Ticket - Mobile
                      </button>
                      <button
                        onClick={() => setIsScaleModal2bOpen(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        Disposal Ticket - Scale
                      </button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        )}
      </div>

      <>
        <DisposalTicketModalV3
          isOpen={isModal2bOpen}
          onClose={() => setIsModal2bOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="office"
        />

        <DisposalTicketModalV3
          isOpen={isMobileModal2bOpen}
          onClose={() => setIsMobileModal2bOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="mobile"
        />

        <DisposalTicketModalV3
          isOpen={isScaleModal2bOpen}
          onClose={() => setIsScaleModal2bOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="scale"
        />

        <DisposalTicketModalV4a
          isOpen={isModal4aOpen}
          onClose={() => setIsModal4aOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="office"
        />

        <DisposalTicketModalV4a
          isOpen={isMobileModal4aOpen}
          onClose={() => setIsMobileModal4aOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="mobile"
        />

        <DisposalTicketModalV4a
          isOpen={isScaleModal4aOpen}
          onClose={() => setIsScaleModal4aOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="scale"
        />

        <DisposalTicketModalV4b
          isOpen={isModal4bOpen}
          onClose={() => setIsModal4bOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="office"
        />

        <DisposalTicketModalV4b
          isOpen={isMobileModal4bOpen}
          onClose={() => setIsMobileModal4bOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="mobile"
        />

        <DisposalTicketModalV4b
          isOpen={isScaleModal4bOpen}
          onClose={() => setIsScaleModal4bOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="scale"
        />
      </>
    </div>

    
  );
}
