"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { materials, Material, MaterialPricing } from '@/app/config/materials';

// Update the DisposalFee interface to match the pricing section
interface DisposalFee {
  id: number;
  name: string;
  description: string;
  rateStructure: string;
  rate: string;
  minCharge: string;
  businessLine: string;
  status: string;
  material: string;
  includedTonnage: number;
  glCode: string;
  overageCharge: string;
  overageThreshold: number;
  tiers?: { id: number; from: number; to: number | null; rate: number }[];
}

interface DisposalTicket {
  source: 'route' | 'office' | 'scale kiosk';
  transactionNumber: string;
  dateTime: string;
  disposalSite: string;
  route?: string;
  kiosk?: string;
  vehicleId: string;
  containerType: string;
  product: string;
  company: string;
  driver: string;
  memo: string;
  weights: {
    gross: number;
    vehicleTare: number;
    containerTare: number;
    netWeight: number;
    netTons: number;
  };
}

interface DisposalTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  onSave: (ticketData: any) => void;
  disposalFees?: DisposalFee[];
}

export default function DisposalTicketModal({ 
  isOpen, 
  onClose, 
  workOrderId, 
  onSave,
  disposalFees = [
    {
      id: 1,
      name: "Standard MSW Disposal",
      description: "Standard municipal solid waste disposal fee",
      rateStructure: "Per Ton",
      rate: "$95.00",
      minCharge: "$95.00",
      businessLine: "Residential",
      status: "Active",
      material: "Municipal Solid Waste",
      includedTonnage: 1,
      glCode: "4000",
      overageCharge: "$35.00",
      overageThreshold: 1.5
    },
    {
      id: 2,
      name: "MSW Container Rate",
      description: "Municipal solid waste container fee",
      rateStructure: "Per Container",
      rate: "$185.00",
      minCharge: "$185.00",
      businessLine: "Commercial",
      status: "Active",
      material: "Municipal Solid Waste",
      includedTonnage: 0,
      glCode: "4001",
      overageCharge: "$0.00",
      overageThreshold: 0
    },
    {
      id: 3,
      name: "Standard Green Waste",
      description: "Yard waste and organic material disposal",
      rateStructure: "Per Ton",
      rate: "$65.00",
      minCharge: "$65.00",
      businessLine: "Residential",
      status: "Active",
      material: "Green Waste",
      includedTonnage: 2,
      glCode: "4002",
      overageCharge: "$25.00",
      overageThreshold: 2.5
    },
    {
      id: 4,
      name: "Green Waste Container",
      description: "Container rate for yard waste",
      rateStructure: "Per Container",
      rate: "$125.00",
      minCharge: "$125.00",
      businessLine: "Commercial",
      status: "Active",
      material: "Green Waste",
      includedTonnage: 0,
      glCode: "4003",
      overageCharge: "$0.00",
      overageThreshold: 0
    },
    {
      id: 5,
      name: "C&D Disposal",
      description: "Construction and demolition waste disposal",
      rateStructure: "Per Ton",
      rate: "$110.00",
      minCharge: "$110.00",
      businessLine: "Construction",
      status: "Active",
      material: "Construction & Demolition",
      includedTonnage: 1,
      glCode: "4004",
      overageCharge: "$50.00",
      overageThreshold: 1.25
    },
    {
      id: 6,
      name: "Standard Recycling",
      description: "Mixed recyclables processing fee",
      rateStructure: "Per Ton",
      rate: "$50.00",
      minCharge: "$50.00",
      businessLine: "Residential",
      status: "Active",
      material: "Recyclables",
      includedTonnage: 1.5,
      glCode: "4005",
      overageCharge: "$20.00",
      overageThreshold: 2
    },
    {
      id: 7,
      name: "Recycling Container",
      description: "Container rate for recyclables",
      rateStructure: "Per Container",
      rate: "$95.00",
      minCharge: "$95.00",
      businessLine: "Commercial",
      status: "Active",
      material: "Recyclables",
      includedTonnage: 0,
      glCode: "4006",
      overageCharge: "$0.00",
      overageThreshold: 0
    },
    {
      id: 8,
      name: "Hazardous Waste Disposal",
      description: "Special handling for hazardous materials",
      rateStructure: "Per Ton",
      rate: "$195.00",
      minCharge: "$195.00",
      businessLine: "Industrial",
      status: "Active",
      material: "Hazardous Waste",
      includedTonnage: 0.5,
      glCode: "4007",
      overageCharge: "$100.00",
      overageThreshold: 0.75
    }
  ]
}: DisposalTicketModalProps) {
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [isPricingPerTon, setIsPricingPerTon] = useState(true);
  const [ticketImage, setTicketImage] = useState<string | null>(null);
  const [ticketPricing, setTicketPricing] = useState<MaterialPricing['disposalTicket']>({
    rate: 75.00,
    includedTonnage: 1,
    overageThreshold: 1.5,
    overageFee: 25.00
  });
  const [containerRate, setContainerRate] = useState(150.00);
  const [actualTonnage, setActualTonnage] = useState(0);
  const [calculatedTicketPrice, setCalculatedTicketPrice] = useState(0);
  const [calculatedFeePrice, setCalculatedFeePrice] = useState(0);
  const [selectedDisposalFee, setSelectedDisposalFee] = useState<DisposalFee | null>(null);
  const [ticketDetails, setTicketDetails] = useState<DisposalTicket>({
    source: 'route',
    transactionNumber: '',
    dateTime: new Date().toISOString(),
    disposalSite: '',
    vehicleId: '',
    containerType: '',
    product: '',
    company: '',
    driver: '',
    memo: '',
    weights: {
      gross: 0,
      vehicleTare: 0,
      containerTare: 0,
      netWeight: 0,
      netTons: 0
    }
  });
  const [disposalSites] = useState(['Disposal site 1', 'Disposal site 2', 'Disposal site 3']);
  const [routes] = useState(['Route 1', 'Route 2', 'Route 3']);
  const [kiosks] = useState(['Kiosk 1', 'Kiosk 2', 'Kiosk 3']);

  // Update pricing when material is selected
  useEffect(() => {
    if (currentMaterial) {
      setTicketPricing(currentMaterial.pricing.disposalTicket);
      if (currentMaterial.pricing.disposalTicket.containerRate) {
        setContainerRate(currentMaterial.pricing.disposalTicket.containerRate);
      }
      // If material doesn't allow per container pricing, force per ton
      if (!currentMaterial.allowPerContainer) {
        setIsPricingPerTon(true);
      }
    }
  }, [currentMaterial]);

  useEffect(() => {
    if (currentMaterial) {
      if (isPricingPerTon) {
        calculatePrices();
      } else {
        setCalculatedTicketPrice(containerRate);
        setCalculatedFeePrice(currentMaterial.pricing.disposalFee.containerRate || 0);
      }
    }
  }, [isPricingPerTon, ticketPricing, containerRate, actualTonnage, currentMaterial]);

  // Update the useEffect for disposal fee selection
  useEffect(() => {
    if (selectedDisposalFee && currentMaterial) {
      // When a disposal fee is selected, update the fee price but keep the ticket price calculation
      const baseRate = parseFloat(selectedDisposalFee.rate.replace('$', ''));
      const ticketPrice = calculateTicketPrice();
      setCalculatedTicketPrice(ticketPrice);
      
      if (selectedDisposalFee.rateStructure === 'Per Ton') {
        const chargeableTonnage = Math.max(0, actualTonnage - selectedDisposalFee.includedTonnage);
        let feePrice = baseRate * chargeableTonnage;
        if (actualTonnage > selectedDisposalFee.overageThreshold) {
          feePrice += parseFloat(selectedDisposalFee.overageCharge.replace('$', ''));
        }
        setCalculatedFeePrice(feePrice);
      } else {
        setCalculatedFeePrice(baseRate);
      }
    } else {
      // When no disposal fee is selected, calculate both prices normally
      calculatePrices();
    }
  }, [selectedDisposalFee, actualTonnage]);

  // Add effect to calculate net weight and tons
  useEffect(() => {
    const netWeight = ticketDetails.weights.gross - ticketDetails.weights.vehicleTare - ticketDetails.weights.containerTare;
    const netTons = netWeight / 2000; // Convert lbs to tons
    setTicketDetails(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        netWeight,
        netTons
      }
    }));
    setActualTonnage(netTons);
  }, [ticketDetails.weights.gross, ticketDetails.weights.vehicleTare, ticketDetails.weights.containerTare]);

  // Separate ticket price calculation
  const calculateTicketPrice = () => {
    if (!currentMaterial) return 0;

    if (isPricingPerTon) {
      const chargeableTonnage = Math.max(0, actualTonnage - ticketPricing.includedTonnage);
      let price = ticketPricing.rate * chargeableTonnage;
      if (actualTonnage > ticketPricing.overageThreshold) {
        price += ticketPricing.overageFee;
      }
      return price;
    } else {
      return containerRate;
    }
  };

  // Update the main price calculation function
  const calculatePrices = () => {
    if (!currentMaterial) return;

    // Calculate ticket price (what we're charged)
    const ticketPrice = calculateTicketPrice();
    setCalculatedTicketPrice(ticketPrice);

    // If no disposal fee is selected, calculate fee price based on material pricing
    if (!selectedDisposalFee) {
      if (isPricingPerTon) {
        const feePricing = currentMaterial.pricing.disposalFee;
        const feeChargeableTonnage = Math.max(0, actualTonnage - feePricing.includedTonnage);
        let feePrice = feePricing.rate * feeChargeableTonnage;
        if (actualTonnage > feePricing.overageThreshold) {
          feePrice += feePricing.overageFee;
        }
        setCalculatedFeePrice(feePrice);
      } else {
        setCalculatedFeePrice(currentMaterial.pricing.disposalFee.containerRate || 0);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTicketImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Create Disposal Ticket</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        {/* Two Column Layout for Ticket Info and Image */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left Column - Ticket Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Ticket information</h3>
            
            {/* Source Selection with Conditional Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <select
                  className="w-full border rounded-lg px-4 py-2 text-gray-700"
                  value={ticketDetails.source}
                  onChange={(e) => setTicketDetails(prev => ({
                    ...prev,
                    source: e.target.value as DisposalTicket['source']
                  }))}
                >
                  <option value="">Select a source</option>
                  <option value="route">Route</option>
                  <option value="office">Office</option>
                  <option value="scale kiosk">Scale Kiosk</option>
                </select>
              </div>

              {ticketDetails.source === 'route' && (
                <div>
                  <select
                    className="w-full border rounded-lg px-4 py-2 text-gray-700"
                    value={ticketDetails.route}
                    onChange={(e) => setTicketDetails(prev => ({
                      ...prev,
                      route: e.target.value
                    }))}
                  >
                    <option value="">Select a route</option>
                    {routes.map(route => (
                      <option key={route} value={route}>{route}</option>
                    ))}
                  </select>
                </div>
              )}

              {ticketDetails.source === 'scale kiosk' && (
                <div>
                  <select
                    className="w-full border rounded-lg px-4 py-2 text-gray-700"
                    value={ticketDetails.kiosk}
                    onChange={(e) => setTicketDetails(prev => ({
                      ...prev,
                      kiosk: e.target.value
                    }))}
                  >
                    <option value="">Select a kiosk</option>
                    {kiosks.map(kiosk => (
                      <option key={kiosk} value={kiosk}>{kiosk}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Ticket #
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2"
                  value={ticketDetails.transactionNumber}
                  onChange={(e) => setTicketDetails(prev => ({
                    ...prev,
                    transactionNumber: e.target.value
                  }))}
                  placeholder="Enter ticket number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Disposal site
                </label>
                <select
                  className="w-full border rounded-lg px-4 py-2 text-gray-700"
                  value={ticketDetails.disposalSite}
                  onChange={(e) => setTicketDetails(prev => ({
                    ...prev,
                    disposalSite: e.target.value
                  }))}
                >
                  <option value="">Select a disposal site</option>
                  {disposalSites.map(site => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Date/Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full border rounded-lg px-4 py-2"
                  value={ticketDetails.dateTime.slice(0, 16)}
                  onChange={(e) => setTicketDetails(prev => ({
                    ...prev,
                    dateTime: new Date(e.target.value).toISOString()
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Memo
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2"
                  value={ticketDetails.memo}
                  onChange={(e) => setTicketDetails(prev => ({
                    ...prev,
                    memo: e.target.value
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Disposal Ticket Image</h3>
              {ticketImage && (
                <button
                  onClick={() => setTicketImage(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove Image
                </button>
              )}
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-[calc(100%-4rem)]">
              {ticketImage ? (
                <div className="relative h-full flex items-center justify-center">
                  <img
                    src={ticketImage}
                    alt="Disposal Ticket"
                    className="max-w-full max-h-full rounded object-contain"
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="ticket-image-upload"
                  />
                  <label
                    htmlFor="ticket-image-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-700"
                  >
                    Upload Image
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Click to upload or drag and drop
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Material & Fee Selection Section */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4">Material & Fee Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Material
              </label>
              <select
                className="w-full border rounded-lg px-4 py-2 text-gray-700"
                value={currentMaterial?.id || ''}
                onChange={(e) => {
                  const material = materials.find(m => m.id === e.target.value);
                  setCurrentMaterial(material || null);
                  setSelectedDisposalFee(null);
                }}
              >
                <option value="">Select a material...</option>
                {materials.map(material => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Connect to Existing Fee
              </label>
              <select
                className="w-full border rounded-lg px-4 py-2 text-gray-700"
                value={selectedDisposalFee?.id || ''}
                onChange={(e) => {
                  const fee = disposalFees.find(f => f.id === Number(e.target.value));
                  setSelectedDisposalFee(fee || null);
                }}
                disabled={!currentMaterial}
              >
                <option value="">Select a fee...</option>
                {disposalFees
                  .filter(fee => fee.status === 'Active' && 
                    (!currentMaterial || fee.material === currentMaterial.name))
                  .map(fee => (
                    <option key={fee.id} value={fee.id}>
                      {fee.name} - {fee.rateStructure === 'Per Ton' 
                        ? `${fee.rate}/ton` 
                        : fee.rate} ({fee.businessLine})
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Weight Fields */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4">Weight Details</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Gross weight
              </label>
              <div className="flex items-center border rounded-lg px-4 py-2 bg-white">
                <span className="text-gray-500 mr-2">Tons</span>
                <input
                  type="number"
                  className="w-full focus:outline-none"
                  value={ticketDetails.weights.gross / 2000}
                  onChange={(e) => setTicketDetails(prev => ({
                    ...prev,
                    weights: {
                      ...prev.weights,
                      gross: Number(e.target.value) * 2000
                    }
                  }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Vehicle Tare
              </label>
              <div className="flex items-center border rounded-lg px-4 py-2 bg-white">
                <span className="text-gray-500 mr-2">Tons</span>
                <input
                  type="number"
                  className="w-full focus:outline-none"
                  value={ticketDetails.weights.vehicleTare / 2000}
                  onChange={(e) => setTicketDetails(prev => ({
                    ...prev,
                    weights: {
                      ...prev.weights,
                      vehicleTare: Number(e.target.value) * 2000
                    }
                  }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Container Tare
              </label>
              <div className="flex items-center border rounded-lg px-4 py-2 bg-white">
                <span className="text-gray-500 mr-2">Tons</span>
                <input
                  type="number"
                  className="w-full focus:outline-none"
                  value={ticketDetails.weights.containerTare / 2000}
                  onChange={(e) => setTicketDetails(prev => ({
                    ...prev,
                    weights: {
                      ...prev.weights,
                      containerTare: Number(e.target.value) * 2000
                    }
                  }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Net weight
              </label>
              <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50">
                <span className="text-gray-500 mr-2">Tons</span>
                <div className="w-full">{ticketDetails.weights.netTons.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Calculations */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold mb-2">Disposal Ticket (Hauler Cost)</div>
            <div className="text-2xl text-blue-600 mb-3">
              ${calculatedTicketPrice.toFixed(2)}
            </div>
            {isPricingPerTon && (
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-white rounded shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Cost Breakdown</h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Facility Base Rate:</span>
                      <span>${ticketPricing.rate}/ton</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Tonnage:</span>
                      <span>{actualTonnage} tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Included Tonnage:</span>
                      <span>{ticketPricing.includedTonnage} tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chargeable Tonnage:</span>
                      <span>{Math.max(0, actualTonnage - ticketPricing.includedTonnage)} tons</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between">
                      <span>Base Charge:</span>
                      <span>
                        ${(ticketPricing.rate * 
                          Math.max(0, actualTonnage - ticketPricing.includedTonnage)).toFixed(2)}
                      </span>
                    </div>
                    {actualTonnage > ticketPricing.overageThreshold && (
                      <>
                        <div className="flex justify-between text-orange-600">
                          <span>Overage Fee:</span>
                          <span>+${ticketPricing.overageFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">
                            (Applied when tonnage exceeds {ticketPricing.overageThreshold} tons)
                          </span>
                        </div>
                      </>
                    )}
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between font-medium">
                      <span>Total Facility Charge:</span>
                      <span>${calculatedTicketPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Profit Analysis</h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Hauler Cost:</span>
                      <span>${calculatedTicketPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Charge:</span>
                      <span>${calculatedFeePrice.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Gross Profit:</span>
                      <span>${(calculatedFeePrice - calculatedTicketPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Margin:</span>
                      <span>
                        {calculatedTicketPrice > 0 
                          ? `${((calculatedFeePrice - calculatedTicketPrice) / calculatedFeePrice * 100).toFixed(1)}%`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Facility charges are based on tonnage beyond included amount, 
                    plus any applicable overage fees
                  </span>
                </div>
              </div>
            )}
            {!isPricingPerTon && (
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-white rounded shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Container Cost Breakdown</h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Facility Container Rate:</span>
                      <span>${containerRate.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between font-medium">
                      <span>Total Facility Charge:</span>
                      <span>${calculatedTicketPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Profit Analysis</h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Hauler Cost:</span>
                      <span>${calculatedTicketPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Charge:</span>
                      <span>${calculatedFeePrice.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Gross Profit:</span>
                      <span>${(calculatedFeePrice - calculatedTicketPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Margin:</span>
                      <span>
                        {calculatedTicketPrice > 0 
                          ? `${((calculatedFeePrice - calculatedTicketPrice) / calculatedFeePrice * 100).toFixed(1)}%`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold mb-2">Disposal Fee (Customer Charge)</div>
            <div className="text-2xl text-blue-600 mb-3">
              ${calculatedFeePrice.toFixed(2)}
            </div>
            {isPricingPerTon && currentMaterial && (
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-white rounded shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Price Breakdown</h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Base Rate:</span>
                      <span>${currentMaterial.pricing.disposalFee.rate}/ton</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Tonnage:</span>
                      <span>{actualTonnage} tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Included Tonnage:</span>
                      <span>{currentMaterial.pricing.disposalFee.includedTonnage} tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chargeable Tonnage:</span>
                      <span>{Math.max(0, actualTonnage - currentMaterial.pricing.disposalFee.includedTonnage)} tons</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between">
                      <span>Base Charge:</span>
                      <span>
                        ${(currentMaterial.pricing.disposalFee.rate * 
                          Math.max(0, actualTonnage - currentMaterial.pricing.disposalFee.includedTonnage)).toFixed(2)}
                      </span>
                    </div>
                    {actualTonnage > currentMaterial.pricing.disposalFee.overageThreshold && (
                      <>
                        <div className="flex justify-between text-orange-600">
                          <span>Overage Fee:</span>
                          <span>+${currentMaterial.pricing.disposalFee.overageFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">
                            (Applied when tonnage exceeds {currentMaterial.pricing.disposalFee.overageThreshold} tons)
                          </span>
                        </div>
                      </>
                    )}
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between font-medium">
                      <span>Total Customer Charge:</span>
                      <span>${calculatedFeePrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Charges are calculated based on tonnage beyond included amount, 
                    plus any applicable overage fees
                  </span>
                </div>
              </div>
            )}
            {!isPricingPerTon && currentMaterial && (
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-white rounded shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-2">Container Price Breakdown</h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Container Rate:</span>
                      <span>${currentMaterial.pricing.disposalFee.containerRate?.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between font-medium">
                      <span>Total Customer Charge:</span>
                      <span>${calculatedFeePrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({
                workOrderId,
                materialId: currentMaterial?.id,
                materialName: currentMaterial?.name,
                ticketPricing: {
                  ...ticketPricing,
                  containerRate: !isPricingPerTon ? containerRate : undefined
                },
                calculatedTicketPrice,
                calculatedFeePrice,
                isPricingPerTon,
                actualTonnage: ticketDetails.weights.netTons,
                connectedDisposalFeeId: selectedDisposalFee?.id,
                connectedDisposalFeeName: selectedDisposalFee?.name,
                weights: ticketDetails.weights,
                ticketImage,
                ticketDetails
              });
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!currentMaterial}
          >
            Save Disposal Ticket
          </button>
        </div>
      </div>
    </div>
  );
} 