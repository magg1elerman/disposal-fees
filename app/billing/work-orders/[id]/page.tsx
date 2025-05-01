"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import DisposalTicketModalV2 from '@/app/components/DisposalTicketModal-v2';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);
  const [isModal2bOpen, setIsModal2bOpen] = useState(false);
  const [isMobileModal2bOpen, setIsMobileModal2bOpen] = useState(false);
  const [isScaleModal2bOpen, setIsScaleModal2bOpen] = useState(false);
  
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
                onClick={() => setIsModalOpen(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                Edit Disposal Ticket
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Disposal Ticket v2</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Disposal Ticket - Office
                </button>
                <button
                  onClick={() => setIsMobileModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Disposal Ticket - Mobile
                </button>
                <button
                  onClick={() => setIsScaleModalOpen(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Disposal Ticket - Scale
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Disposal Ticket v2b</h2>
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
            </div>
          </div>
        )}
      </div>

      <>
        <DisposalTicketModalV2
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="office"
        />

        <DisposalTicketModalV2
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="mobile"
        />

        <DisposalTicketModalV2
          isOpen={isScaleModalOpen}
          onClose={() => setIsScaleModalOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="scale"
        />

        <DisposalTicketModalV2
          isOpen={isModal2bOpen}
          onClose={() => setIsModal2bOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="office"
        />

        <DisposalTicketModalV2
          isOpen={isMobileModal2bOpen}
          onClose={() => setIsMobileModal2bOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="mobile"
        />

        <DisposalTicketModalV2
          isOpen={isScaleModal2bOpen}
          onClose={() => setIsScaleModal2bOpen(false)}
          workOrderId={workOrder.id}
          onSave={handleSaveDisposalTicket}
          source="scale"
        />
      </>
    </div>
  );
} 