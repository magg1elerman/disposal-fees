"use client";

import { useState, useEffect, useRef } from 'react';
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
  source: 'route' | 'office' | 'scale';
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

export default function DisposalTicketModalV1({ 
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
  const [tippingFeePricing, setTippingFeePricing] = useState<MaterialPricing['disposalTicket']>({
    rate: 65.00,
    includedTonnage: 1,
    overageThreshold: 1.5,
    overageFee: 20.00
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
      gross: 0.00,
      vehicleTare: 0.00,
      netWeight: 0.00,
      netTons: 0.00
    }
  });
  const [disposalSites] = useState(['Disposal site 1', 'Disposal site 2', 'Disposal site 3']);
  const [routes] = useState(['Route 1', 'Route 2', 'Route 3']);
  const [kiosks] = useState(['Kiosk 1', 'Kiosk 2', 'Kiosk 3']);
  const [isEditingFee, setIsEditingFee] = useState(false);
  const [editedFee, setEditedFee] = useState<{
    rate: number;
    includedTonnage: number;
    overageThreshold: number;
    overageFee: number;
    containerRate: number;
  } | null>(null);
  const [isEditingNetWeight, setIsEditingNetWeight] = useState(false);
  const [editedNetWeight, setEditedNetWeight] = useState<number | null>(null);
  const [isEditingField, setIsEditingField] = useState<string | null>(null);
  const [isEditingDisposalSite, setIsEditingDisposalSite] = useState(false);
  const [isEditingMaterial, setIsEditingMaterial] = useState(false);
  const disposalSiteRef = useRef<HTMLSelectElement>(null);
  const materialRef = useRef<HTMLSelectElement>(null);
  const [useGrossTare, setUseGrossTare] = useState(false);

  // Add effect to focus disposal site dropdown when editing
  useEffect(() => {
    if (isEditingDisposalSite && disposalSiteRef.current) {
      disposalSiteRef.current.focus();
    }
  }, [isEditingDisposalSite]);

  // Add effect to focus material dropdown when editing
  useEffect(() => {
    if (isEditingMaterial && materialRef.current) {
      materialRef.current.focus();
    }
  }, [isEditingMaterial]);

  // Update pricing when material is selected
  useEffect(() => {
    if (currentMaterial) {
      // Set tipping fee rate (Hauler Charge)
      // Customer Charge uses the material's disposal fee base rate
      setTicketPricing({ ...currentMaterial.pricing.disposalFee });

      // Hauler Charge (tipping fee) is 15% below the base rate
      setTippingFeePricing({
        rate: currentMaterial.pricing.disposalFee.rate * 0.85,
        includedTonnage: currentMaterial.pricing.disposalTicket.includedTonnage,
        overageThreshold: currentMaterial.pricing.disposalTicket.overageThreshold,
        overageFee: currentMaterial.pricing.disposalTicket.overageFee
      });

      if (currentMaterial.pricing.disposalTicket.containerRate) {
        setContainerRate(currentMaterial.pricing.disposalTicket.containerRate);
      }
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
    if (useGrossTare) {
      const netWeight = ticketDetails.weights.gross - ticketDetails.weights.vehicleTare;
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
    }
  }, [ticketDetails.weights.gross, ticketDetails.weights.vehicleTare, useGrossTare]);

  // Update edited fee when current material changes
  useEffect(() => {
    if (currentMaterial) {
      setEditedFee({
        rate: currentMaterial.pricing.disposalTicket.rate,
        includedTonnage: currentMaterial.pricing.disposalTicket.includedTonnage,
        overageThreshold: currentMaterial.pricing.disposalTicket.overageThreshold,
        overageFee: currentMaterial.pricing.disposalTicket.overageFee,
        containerRate: currentMaterial.pricing.disposalTicket.containerRate || 0
      });
    }
  }, [currentMaterial]);

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

  // Simplify tipping fee calculation to just rate × net weight
  const calculateTippingFee = () => {
    if (!currentMaterial) return 0;

    if (isPricingPerTon) {
      return tippingFeePricing.rate * actualTonnage; // Simple rate × net weight
    } else {
      return containerRate;
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

  const handleEditFee = (material: Material) => {
    setEditedFee({
      rate: material.pricing.disposalTicket.rate,
      includedTonnage: material.pricing.disposalTicket.includedTonnage || 0,
      overageThreshold: material.pricing.disposalTicket.overageThreshold || 0,
      overageFee: material.pricing.disposalTicket.overageFee || 0,
      containerRate: material.pricing.disposalTicket.containerRate || 0
    });
    setIsEditingFee(true);
  };

  const handleSaveFee = () => {
    if (currentMaterial && editedFee) {
      currentMaterial.pricing.disposalTicket = {
        ...currentMaterial.pricing.disposalTicket,
        ...editedFee
      };
      setIsEditingFee(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingFee(false);
    setEditedFee(null);
  };

  const handleInputChange = (field: 'rate' | 'includedTonnage' | 'overageThreshold' | 'overageFee' | 'containerRate', value: number) => {
    if (editedFee) {
      setEditedFee({
        ...editedFee,
        [field]: value
      });
    }
  };

  const handleEditNetWeight = () => {
    setEditedNetWeight(ticketDetails.weights.netTons);
    setIsEditingNetWeight(true);
  };

  const handleSaveNetWeight = () => {
    if (editedNetWeight !== null) {
      setTicketDetails(prev => ({
        ...prev,
        weights: {
          ...prev.weights,
          netTons: editedNetWeight,
          netWeight: editedNetWeight * 2000 // Convert tons to pounds
        }
      }));
      setIsEditingNetWeight(false);
      setEditedNetWeight(null);
    }
  };

  const handleCancelNetWeight = () => {
    setIsEditingNetWeight(false);
    setEditedNetWeight(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-[80vw] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Create Disposal Ticket</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Source Selector and Disposal Site */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Source
                </label>
                <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50 h-[42px]">
                  <span className="text-gray-700">Office</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Disposal site
                </label>
                <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50 h-[42px]">
                  {isEditingDisposalSite ? (
                    <select
                      ref={disposalSiteRef}
                      className="w-full rounded-lg px-4 py-2 text-gray-700 bg-gray-50 focus:outline-none"
                      value={ticketDetails.disposalSite}
                      onChange={(e) => {
                        setTicketDetails(prev => ({
                          ...prev,
                          disposalSite: e.target.value
                        }));
                        setIsEditingDisposalSite(false);
                      }}
                    >
                      <option value="">Disposal site</option>
                      {disposalSites.map(site => (
                        <option key={site} value={site}>{site}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-gray-700">{ticketDetails.disposalSite || 'Not set'}</span>
                      <button
                        onClick={() => setIsEditingDisposalSite(!isEditingDisposalSite)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Material Selection */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Material
              </label>
              <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50 h-[42px]">
                {isEditingMaterial ? (
                  <select
                    ref={materialRef}
                    className="w-full bg-transparent border-0 focus:outline-none text-gray-700"
                    value={currentMaterial?.id || ''}
                    onChange={(e) => {
                      const material = materials.find((m: Material) => m.id === e.target.value);
                      setCurrentMaterial(material || null);
                      if (material) {
                        setIsPricingPerTon(!material.allowPerContainer || true);
                        setTicketPricing(material.pricing.disposalTicket);
                        if (material.pricing.disposalTicket.containerRate) {
                          setContainerRate(material.pricing.disposalTicket.containerRate);
                        }
                      }
                      setIsEditingMaterial(false);
                    }}
                  >
                    <option value="">Material</option>
                    {materials.map((material: Material) => (
                      <option key={material.id} value={material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-gray-700">{currentMaterial?.name || 'Select a material...'}</span>
                    <button
                      onClick={() => setIsEditingMaterial(true)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Net weight
                </label>
                <div className={`flex items-top justify-between border rounded-lg px-4 py-2 ${useGrossTare ? 'bg-gray-50' : 'bg-white'}`}>
                  <input
                    type="number"
                    className={`w-full focus:outline-none ${useGrossTare ? 'bg-gray-50' : ''}`}
                    value={ticketDetails.weights.netTons}
                    step="0.01"
                    onChange={(e) => {
                      const netTons = parseFloat(e.target.value);
                      setTicketDetails(prev => ({
                        ...prev,
                        weights: {
                          ...prev.weights,
                          netTons,
                          netWeight: netTons * 2000
                        }
                      }));
                      setActualTonnage(netTons);
                    }}
                    disabled={useGrossTare}
                    readOnly={useGrossTare}
                  />
                  <div className="flex items-center">
                    <span className="text-gray-500 ml-2">Tons</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <label className="text-sm font-medium text-gray-600">Calculate using gross/tare:</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={useGrossTare}
                  onChange={(e) => setUseGrossTare(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {useGrossTare && (
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Gross weight
                  </label>
                  <div className="flex items-center border rounded-lg px-4 py-2 bg-white">
                    <input
                      type="number"
                      className="w-full focus:outline-none"
                      value={ticketDetails.weights.gross / 2000}
                      step="0.01"
                      onChange={(e) => setTicketDetails(prev => ({
                        ...prev,
                        weights: {
                          ...prev.weights,
                          gross: Number(e.target.value) * 2000
                        }
                      }))}
                    />
                    <span className="text-gray-500 ml-2">Tons</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Tare Weight
                  </label>
                  <div className="flex items-top border rounded-lg px-4 py-2 bg-white">
                    <input
                      type="number"
                      className="w-full focus:outline-none"
                      value={ticketDetails.weights.vehicleTare / 2000}
                      step="0.01"
                      onChange={(e) => setTicketDetails(prev => ({
                        ...prev,
                        weights: {
                          ...prev.weights,
                          vehicleTare: Number(e.target.value) * 2000
                        }
                      }))}
                    />
                    <div className="flex items-center">
                      <span className="text-gray-500 ml-2">Tons</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tipping Fee Section */}
            <div className="mt-4">
              <div className="text-gray-600 text-sm font-semibold mb-2">Tipping Fee</div>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white rounded shadow-sm border border-gray-200">
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Net Weight:</span>
                      <span>{actualTonnage.toFixed(2)} tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disposal Site Rate:</span>
                      <span>${tippingFeePricing.rate.toFixed(2)}/ton</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between font-medium">
                      <span>Total Cost:</span>
                      <span>${calculateTippingFee().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload and Disposal Fee */}
          <div className="h-full">
            <div className="flex items-center justify-between mb-4">
              {ticketImage && (
                <button
                  onClick={() => setTicketImage(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove Image
                </button>
              )}
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-1/2 bg-gray-50">
              {ticketImage ? (
                <div className="relative h-full flex items-center justify-center">
                  <img
                    src={ticketImage}
                    alt="Disposal Ticket"
                    className="max-w-full max-h-[90%] rounded object-contain"
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

            {/* Disposal Fee Section */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-semibold">Disposal Fee</div>
              </div>
              {(() => {
                if (isEditingFee && editedFee && currentMaterial) {
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700">Rate</label>
                          <input
                            type="number"
                            value={editedFee.rate}
                            onChange={(e) => handleInputChange('rate', parseFloat(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      {isPricingPerTon ? (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700">Included Tonnage</label>
                              <input
                                type="number"
                                value={editedFee.includedTonnage}
                                onChange={(e) => handleInputChange('includedTonnage', parseFloat(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700">Overage Threshold</label>
                              <input
                                type="number"
                                value={editedFee.overageThreshold}
                                onChange={(e) => handleInputChange('overageThreshold', parseFloat(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700">Overage Fee</label>
                              <input
                                type="number"
                                value={editedFee.overageFee}
                                onChange={(e) => handleInputChange('overageFee', parseFloat(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Container Rate</label>
                            <input
                              type="number"
                              value={editedFee.containerRate}
                              onChange={(e) => handleInputChange('containerRate', parseFloat(e.target.value))}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
                        >
                          Cancel Edit
                        </button>
                        <button
                          onClick={handleSaveFee}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save Edit
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-white rounded shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-700">Price Breakdown</h4>
                          <div className="relative group">
                            <button 
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => {
                                if (currentMaterial) {
                                  setEditedFee({
                                    rate: currentMaterial.pricing.disposalTicket.rate,
                                    includedTonnage: currentMaterial.pricing.disposalTicket.includedTonnage,
                                    overageThreshold: currentMaterial.pricing.disposalTicket.overageThreshold,
                                    overageFee: currentMaterial.pricing.disposalTicket.overageFee,
                                    containerRate: currentMaterial.pricing.disposalTicket.containerRate || 0
                                  });
                                  setIsEditingFee(true);
                                }
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <div className="absolute right-0 top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              Override disposal fee
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1 text-gray-600">
                          <div className="flex justify-between">
                            <span>Rate:</span>
                            <span>${currentMaterial ? currentMaterial.pricing.disposalTicket.rate.toFixed(2) : '0.00'}/ton</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Tonnage:</span>
                            <span>{actualTonnage} tons</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Included Tonnage:</span>
                            <span>{currentMaterial ? currentMaterial.pricing.disposalTicket.includedTonnage : '0'} tons</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Chargeable Tonnage:</span>
                            <span>{Math.max(0, actualTonnage - (currentMaterial ? currentMaterial.pricing.disposalTicket.includedTonnage : 0))} tons</span>
                          </div>
                          {currentMaterial && actualTonnage > currentMaterial.pricing.disposalTicket.overageThreshold && (
                            <>
                              <div className="flex justify-between text-orange-600">
                                <span>Overage Fee:</span>
                                <span>+${currentMaterial.pricing.disposalTicket.overageFee.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs">
                                  (Applied when tonnage exceeds {currentMaterial.pricing.disposalTicket.overageThreshold} tons)
                                </span>
                              </div>
                            </>
                          )}
                          <div className="border-t border-gray-200 my-2"></div>
                          <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>${calculatedFeePrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-12 flex justify-end gap-4">
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
