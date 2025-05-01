"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { materials, Material, MaterialPricing } from '@/app/config/materials';
import { MaterialChip } from "./MaterialChip";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  source: 'route' | 'office' | 'scale' | 'mobile';
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

interface MaterialWeight {
  gross: number;
  tare: number;
  net: number;
}

interface MaterialWithWeights extends Material {
  weights?: MaterialWeight;
  isTaxable?: boolean;
}

interface DisposalTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  onSave: (ticketData: any) => void;
  disposalFees?: DisposalFee[];
  source?: 'route' | 'office' | 'scale' | 'mobile';
}

export default function DisposalTicketModalV2({ 
  isOpen, 
  onClose, 
  workOrderId, 
  onSave,
  disposalFees = [],
  source = 'route'
}: DisposalTicketModalProps) {
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialWithWeights[]>(() => {
    if (source === 'scale') {
      const mswMaterial = materials.find(m => m.name === 'MSW');
      return mswMaterial ? [{
        ...mswMaterial,
        weights: {
          gross: 6000,
          tare: 2000,
          net: 4000
        }
      }] : [];
    } else if (source === 'mobile') {
      const recyclingMaterial = materials.find(m => m.name === 'Recycling');
      return recyclingMaterial ? [{
        ...recyclingMaterial,
        weights: {
          gross: 8000,
          tare: 3000,
          net: 5000
        }
      }] : [];
    }
    return [];
  });
  const [currentMaterial, setCurrentMaterial] = useState<MaterialWithWeights | null>(() => {
    if (source === 'scale') {
      const mswMaterial = materials.find(m => m.name === 'MSW');
      return mswMaterial ? {
        ...mswMaterial,
        weights: {
          gross: 6000,
          tare: 2000,
          net: 4000
        }
      } : null;
    } else if (source === 'mobile') {
      const recyclingMaterial = materials.find(m => m.name === 'Recycling');
      return recyclingMaterial ? {
        ...recyclingMaterial,
        weights: {
          gross: 8000,
          tare: 3000,
          net: 5000
        }
      } : null;
    }
    return null;
  });
  const [isPricingPerTon, setIsPricingPerTon] = useState(true);
  const [ticketImage, setTicketImage] = useState<string | null>(null);
  const [ticketPricing, setTicketPricing] = useState<MaterialPricing['disposalTicket']>({
    rate: 75.00,
    includedTonnage: 1,
    overageThreshold: 5.00,
    overageFee: 25.00
  });
  const [tippingFeePricing, setTippingFeePricing] = useState<MaterialPricing['disposalTicket']>({
    rate: 65.00,
    includedTonnage: 1,
    overageThreshold: 5.00,
    overageFee: 20.00
  });
  const [containerRate, setContainerRate] = useState(150.00);
  const [actualTonnage, setActualTonnage] = useState(source === 'scale' ? 2.00 : 0);
  const [calculatedTicketPrice, setCalculatedTicketPrice] = useState(0);
  const [calculatedFeePrice, setCalculatedFeePrice] = useState(0);
  const [selectedDisposalFee, setSelectedDisposalFee] = useState<DisposalFee | null>(null);
  const [ticketDetails, setTicketDetails] = useState<DisposalTicket>({
    source,
    transactionNumber: source === 'scale' ? '140430097' : source === 'mobile' ? '140430098' : '',
    dateTime: new Date().toISOString(),
    disposalSite: source === 'scale' ? 'Disposal site 1' : source === 'mobile' ? 'Disposal site 2' : '',
    vehicleId: '',
    containerType: '',
    product: '',
    company: '',
    driver: '',
    memo: '',
    weights: {
      gross: source === 'scale' ? 6000 : source === 'mobile' ? 8000 : 0.00, // 4 tons in pounds
      vehicleTare: source === 'scale' ? 2000 : source === 'mobile' ? 3000 : 0.00, // 1.5 tons in pounds
      netWeight: source === 'scale' ? 4000 : source === 'mobile' ? 5000 : 0.00, // 2.5 tons in pounds
      netTons: source === 'scale' ? 2.00 : source === 'mobile' ? 2.50 : 0.00 // 2.5 tons
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
  const [isMobileUnlocked, setIsMobileUnlocked] = useState(false);
  const [isScaleUnlocked, setIsScaleUnlocked] = useState(false);
  const disposalSiteRef = useRef<HTMLSelectElement>(null);
  const materialRef = useRef<HTMLSelectElement>(null);
  const [useGrossTare, setUseGrossTare] = useState(false);
  const [isTaxable, setIsTaxable] = useState(false);

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

  // Add effect to set material when source is scale or mobile
  useEffect(() => {
    if (source === 'scale' || source === 'mobile') {
      const material = materials.find(m => source === 'scale' ? m.name === 'MSW' : m.name === 'Recycling');
      if (material) {
        setCurrentMaterial({
          ...material,
          pricing: {
            ...material.pricing,
            disposalTicket: {
              ...material.pricing.disposalTicket,
              overageThreshold: 5.00
            },
            disposalFee: {
              ...material.pricing.disposalFee,
              overageThreshold: 5.00
            }
          }
        });
        // Set initial pricing for scale/mobile
        setTicketPricing({ ...material.pricing.disposalFee });
        setTippingFeePricing({
          rate: material.pricing.disposalFee.rate * 0.85,
          includedTonnage: material.pricing.disposalTicket.includedTonnage,
          overageThreshold: material.pricing.disposalTicket.overageThreshold,
          overageFee: material.pricing.disposalTicket.overageFee
        });
        if (material.pricing.disposalTicket.containerRate) {
          setContainerRate(material.pricing.disposalTicket.containerRate);
        }
        setIsPricingPerTon(true);
        
        // Set actual tonnage for mobile/scale
        if (source === 'mobile') {
          setActualTonnage(2.50); // 2.5 tons
        } else if (source === 'scale') {
          setActualTonnage(2.00); // 2 tons
        }
      }
    }
  }, [source]);

  // Add effect to set example image when source is scale or mobile
  useEffect(() => {
    if (source === 'scale' || source === 'mobile') {
      setTicketImage('/disposal-ticket-example.png');
    }
  }, [source]);

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
  }, [selectedDisposalFee, actualTonnage, currentMaterial]);

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

  const handleEditFee = (material: MaterialWithWeights) => {
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
      <div className="bg-white rounded-lg p-8 min-w-[90vw] max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Disposal Ticket v3</h2>
            {(source === 'mobile' || source === 'scale') && (
              <div className="relative group">
                <button
                  onClick={() => {
                    if (source === 'mobile') {
                      setIsMobileUnlocked(!isMobileUnlocked);
                    } else if (source === 'scale') {
                      setIsScaleUnlocked(!isScaleUnlocked);
                    }
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                    (source === 'mobile' && isMobileUnlocked) || (source === 'scale' && isScaleUnlocked)
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {(source === 'mobile' && isMobileUnlocked) || (source === 'scale' && isScaleUnlocked) ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-medium">Unlocked</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-xs font-medium">Locked</span>
                    </>
                  )}
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Override ticket details
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Is Taxable</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isTaxable}
                  onChange={(e) => setIsTaxable(e.target.checked)}
                  disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                />
                <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
        </div>

        {/* Source Tag */}
        <div className="mb-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            source === 'scale' ? 'bg-blue-100 text-blue-800' :
            source === 'mobile' ? 'bg-purple-100 text-purple-800' :
            source === 'route' ? 'bg-green-100 text-green-800' :
            source === 'office' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {source.charAt(0).toUpperCase() + source.slice(1)}
          </span>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto pr-4">
          {/* Four Column Layout - 1/4 + 1/4 + 1/4 + 1/4 split */}
          <div className="grid grid-cols-4 gap-6">
            {/* Left Two Columns */}
            <div className="col-span-2 space-y-6">
              {/* Top Row - Basic Info and Image side by side */}
              <div className="grid grid-cols-2 gap-6">
                {/* Basic Info - Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Ticket #
                    </label>
                    <input
                      type="text"
                      className={`w-full border rounded-lg px-4 py-2 ${source === 'scale' && !isScaleUnlocked ? 'bg-gray-50' : source === 'mobile' && !isMobileUnlocked ? 'bg-gray-50' : 'bg-white'}`}
                      value={ticketDetails.transactionNumber}
                      onChange={(e) => setTicketDetails(prev => ({
                        ...prev,
                        transactionNumber: e.target.value
                      }))}
                      placeholder="Enter ticket number"
                      disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                      readOnly={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Date/Time
                    </label>
                    <input
                      type="datetime-local"
                      className={`w-full border rounded-lg px-4 py-2 ${source === 'scale' && !isScaleUnlocked ? 'bg-gray-50' : source === 'mobile' && !isMobileUnlocked ? 'bg-gray-50' : 'bg-white'}`}
                      value={ticketDetails.dateTime.slice(0, 16)}
                      onChange={(e) => setTicketDetails(prev => ({
                        ...prev,
                        dateTime: new Date(e.target.value).toISOString()
                      }))}
                      disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                      readOnly={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Disposal site
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full border rounded-lg px-4 py-2 ${source === 'scale' && !isScaleUnlocked ? 'bg-gray-50' : source === 'mobile' && !isMobileUnlocked ? 'bg-gray-50' : 'bg-white'} h-[42px] appearance-none`}
                        value={ticketDetails.disposalSite}
                        onChange={(e) => {
                          setTicketDetails(prev => ({
                            ...prev,
                            disposalSite: e.target.value
                          }));
                        }}
                        disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                      >
                        <option value="">Select Disposal Site</option>
                        {disposalSites.map(site => (
                          <option key={site} value={site}>{site}</option>
                        ))}
                      </select>
                      {(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked) ? (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Image Upload - Right Column */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                  {ticketImage ? (
                    <div className="relative flex items-center justify-center h-full">
                      <img
                        src={ticketImage}
                        alt="Disposal Ticket"
                        className="max-w-full max-h-full rounded object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
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

              {/* Materials Table - Full Width */}
              <div className="col-span-2">
                <div className={`p-2 rounded shadow-sm border border-gray-200 ${(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked) ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-gray-700 text-sm">Materials</div>
                    <div className="flex items-center space-x-2">
                      <label className="text-xs font-medium text-gray-600">Gross/Tare</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={useGrossTare}
                          onChange={(e) => setUseGrossTare(e.target.checked)}
                        />
                        <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-1 px-2 font-medium text-gray-600 w-24">Material</th>
                          {useGrossTare && (
                            <>
                              <th className="text-right py-1 px-2 font-medium text-gray-600 w-20">Gross</th>
                              <th className="text-right py-1 px-2 font-medium text-gray-600 w-20">Tare</th>
                            </>
                          )}
                          <th className="text-right py-1 px-2 font-medium text-gray-600 w-20">Net</th>
                          <th className="text-right py-1 px-2 font-medium text-gray-600 w-20">Rate</th>
                          <th className="text-right py-1 px-2 font-medium text-gray-600 w-20">Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedMaterials.map((material) => (
                          <tr key={material.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-1 px-2">
                              <div className="flex items-center gap-1">
                                <span className={`text-xs font-medium ${
                                  material.name === 'MSW' ? 'text-blue-700' :
                                  material.name === 'Recycling' ? 'text-green-700' :
                                  material.name === 'C&D' ? 'text-cyan-700' :
                                  'text-gray-700'
                                }`}>
                                  {material.name}
                                </span>
                                {!((source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)) && (
                                  <button
                                    onClick={() => {
                                      setSelectedMaterials(prev => prev.filter(m => m.id !== material.id));
                                      if (currentMaterial?.id === material.id) {
                                        setCurrentMaterial(null);
                                        setTicketPricing({
                                          rate: 0,
                                          includedTonnage: 0,
                                          overageThreshold: 0,
                                          overageFee: 0
                                        });
                                        setContainerRate(0);
                                      }
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </td>
                            {useGrossTare && (
                              <>
                                <td className="py-1 px-2">
                                  <div className={`flex items-center rounded border border-gray-200 ${
                                    (source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)
                                      ? 'bg-transparent border-transparent'
                                      : 'bg-white'
                                  }`}>
                                    <input
                                      type="number"
                                      className="w-full text-right focus:outline-none text-xs px-1 py-0.5"
                                      value={(material.weights?.gross || 0) / 2000}
                                      step="0.01"
                                      onChange={(e) => {
                                        const grossTons = parseFloat(e.target.value);
                                        setSelectedMaterials(prev => prev.map(m => 
                                          m.id === material.id 
                                            ? {
                                                ...m,
                                                weights: {
                                                  gross: grossTons * 2000,
                                                  tare: m.weights?.tare || 0,
                                                  net: grossTons * 2000 - (m.weights?.tare || 0)
                                                }
                                              }
                                            : m
                                        ));
                                      }}
                                      disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                                      readOnly={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                                    />
                                    <span className="text-xs text-gray-500 px-1 shrink-0">t</span>
                                  </div>
                                </td>
                                <td className="py-1 px-2">
                                  <div className={`flex items-center rounded border border-gray-200 ${
                                    (source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)
                                      ? 'bg-transparent border-transparent'
                                      : 'bg-white'
                                  }`}>
                                    <input
                                      type="number"
                                      className="w-full text-right focus:outline-none text-xs px-1 py-0.5"
                                      value={(material.weights?.tare || 0) / 2000}
                                      step="0.01"
                                      onChange={(e) => {
                                        const tareTons = parseFloat(e.target.value);
                                        setSelectedMaterials(prev => prev.map(m => 
                                          m.id === material.id 
                                            ? {
                                                ...m,
                                                weights: {
                                                  gross: m.weights?.gross || 0,
                                                  tare: tareTons * 2000,
                                                  net: m.weights?.gross || 0 - (tareTons * 2000)
                                                }
                                              }
                                            : m
                                        ));
                                      }}
                                      disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                                      readOnly={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                                    />
                                    <span className="text-xs text-gray-500 px-1 shrink-0">t</span>
                                  </div>
                                </td>
                              </>
                            )}
                            <td className="py-1 px-2">
                              <div className={`flex items-center rounded border border-gray-200 ${
                                (source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)
                                  ? 'bg-transparent border-transparent'
                                  : 'bg-white'
                              }`}>
                                <input
                                  type="number"
                                  className="w-full text-right focus:outline-none text-xs px-1 py-0.5"
                                  value={(material.weights?.net || 0) / 2000}
                                  step="0.01"
                                  onChange={(e) => {
                                    const netTons = parseFloat(e.target.value);
                                    setSelectedMaterials(prev => prev.map(m => 
                                      m.id === material.id 
                                        ? {
                                            ...m,
                                            weights: {
                                              gross: netTons * 2000 + (m.weights?.tare || 0),
                                              tare: m.weights?.tare || 0,
                                              net: netTons * 2000
                                            }
                                          }
                                        : m
                                    ));
                                  }}
                                  disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked) || useGrossTare}
                                  readOnly={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked) || useGrossTare}
                                />
                                <span className="text-xs text-gray-500 px-1 shrink-0">t</span>
                              </div>
                            </td>
                            <td className="py-1 px-2">
                              <div className={`flex items-center rounded border border-gray-200 ${
                                (source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)
                                  ? 'bg-transparent border-transparent'
                                  : 'bg-white'
                              }`}>
                                <span className="text-xs text-gray-500 px-1 shrink-0">$</span>
                                <input
                                  type="number"
                                  className="w-full text-right focus:outline-none text-xs px-1 py-0.5"
                                  value={(material.pricing.disposalFee.rate * 0.7).toFixed(2)}
                                  step="0.01"
                                  onChange={(e) => {
                                    if ((source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)) return;
                                    const newRate = parseFloat(e.target.value);
                                    const updatedMaterial = {
                                      ...material,
                                      pricing: {
                                        ...material.pricing,
                                        disposalFee: {
                                          ...material.pricing.disposalFee,
                                          rate: newRate / 0.7
                                        }
                                      }
                                    };
                                    setSelectedMaterials(prev => 
                                      prev.map(m => m.id === material.id ? updatedMaterial : m)
                                    );
                                    if (currentMaterial?.id === material.id) {
                                      setCurrentMaterial(updatedMaterial);
                                    }
                                  }}
                                  disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                                  readOnly={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                                />
                              </div>
                            </td>
                            <td className="py-1 px-2">
                              <div className={`flex items-center rounded border border-gray-200 ${
                                (source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)
                                  ? 'bg-transparent border-transparent'
                                  : 'bg-white'
                              }`}>
                                <span className="text-xs text-gray-500 px-1 shrink-0">$</span>
                                <input
                                  type="number"
                                  className="w-full text-right focus:outline-none text-xs px-1 py-0.5"
                                  value={(material.pricing.disposalFee.rate * 0.7 * (material.weights?.net || 0) / 2000).toFixed(2)}
                                  step="0.01"
                                  onChange={(e) => {
                                    if ((source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)) return;
                                    const newTippingFee = parseFloat(e.target.value);
                                    const newRate = newTippingFee / (material.weights?.net || 0) / 0.7;
                                    const updatedMaterial = {
                                      ...material,
                                      pricing: {
                                        ...material.pricing,
                                        disposalFee: {
                                          ...material.pricing.disposalFee,
                                          rate: newRate
                                        }
                                      }
                                    };
                                    setSelectedMaterials(prev => 
                                      prev.map(m => m.id === material.id ? updatedMaterial : m)
                                    );
                                    if (currentMaterial?.id === material.id) {
                                      setCurrentMaterial(updatedMaterial);
                                    }
                                  }}
                                  disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                                  readOnly={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className="py-1 px-2" colSpan={useGrossTare ? 6 : 4}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`h-6 w-full justify-start text-xs ${
                                    (source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)
                                      ? 'text-gray-400 cursor-not-allowed'
                                      : 'text-gray-900 hover:text-gray-700 hover:bg-transparent'
                                  }`}
                                  disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                                >
                                  Add Material +
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-[200px]">
                                {materials
                                  .filter(material => !selectedMaterials.some(m => m.id === material.id))
                                  .map((material: Material) => (
                                    <DropdownMenuItem
                                      key={material.id}
                                      onClick={() => {
                                        setSelectedMaterials(prev => [...prev, material]);
                                        setCurrentMaterial(material);
                                        setIsPricingPerTon(!material.allowPerContainer || true);
                                        setTicketPricing({
                                          ...material.pricing.disposalTicket,
                                          overageThreshold: 5.00
                                        });
                                        if (material.pricing.disposalTicket.containerRate) {
                                          setContainerRate(material.pricing.disposalTicket.containerRate);
                                        }
                                      }}
                                    >
                                      <span className={`text-xs font-medium ${
                                        material.name === 'MSW' ? 'text-blue-700' :
                                        material.name === 'Recycling' ? 'text-green-700' :
                                        material.name === 'C&D' ? 'text-cyan-700' :
                                        'text-gray-700'
                                      }`}>
                                        {material.name}
                                      </span>
                                    </DropdownMenuItem>
                                  ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Two Columns - Disposal Fee */}
            <div className="col-span-2 space-y-2 text-sm">
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
                          className="px-3 py-1 text-gray-600 hover:text-gray-700"
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
                      <div className={`p-3 rounded shadow-sm border border-gray-200 ${(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked) ? 'bg-gray-50' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-700">Disposal Fee</h4>
                          {!((source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)) && (
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
                                Edit disposal fee
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 text-xs">
                          {selectedMaterials.map((material, index) => (
                            <div key={material.id} className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium ${
                                  material.name === 'MSW' ? 'text-blue-700' :
                                  material.name === 'Recycling' ? 'text-green-700' :
                                  material.name === 'C&D' ? 'text-cyan-700' :
                                  'text-gray-700'
                                }`}>
                                  {material.name}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Rate:</span>
                                <span>${(material.pricing.disposalFee.rate * 0.7).toFixed(2)}/ton</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total Tonnage:</span>
                                <span>{(material.weights?.net || 0) / 2000} tons</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Included Tonnage:</span>
                                <span>{material.pricing.disposalFee.includedTonnage} tons</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Chargeable Tonnage:</span>
                                <span>{Math.max(0, (material.weights?.net || 0) / 2000 - material.pricing.disposalFee.includedTonnage)} tons</span>
                              </div>
                              {(material.weights?.net || 0) / 2000 > material.pricing.disposalFee.overageThreshold && (
                                <>
                                  <div className="flex justify-between text-orange-600">
                                    <span>Overage Fee:</span>
                                    <span>+${material.pricing.disposalFee.overageFee.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs">
                                      (Applied when tonnage exceeds {material.pricing.disposalFee.overageThreshold} tons)
                                    </span>
                                  </div>
                                </>
                              )}
                              <div className="flex justify-between text-xs text-gray-800">
                                <span>Subtotal:</span>
                                <span>${(material.pricing.disposalFee.rate * 0.7 * (material.weights?.net || 0) / 2000).toFixed(2)}</span>
                              </div>
                              {isTaxable && (
                                <div className="flex justify-between text-xs text-gray-600">
                                  <span>Tax (8.25%):</span>
                                  <span>+${((material.pricing.disposalFee.rate * 0.7 * (material.weights?.net || 0) / 2000) * 0.0825).toFixed(2)}</span>
                                </div>
                              )}
                              {index < selectedMaterials.length - 1 && (
                                <div className="border-t border-gray-100 my-2"></div>
                              )}
                            </div>
                          ))}
                          <div className="border-t border-gray-200 mt-4 pt-2"></div>
                          <div className="flex justify-between">
                            <span className="text-lg font-semibold text-blue-600">Total:</span>
                            <span className="text-lg font-semibold text-blue-600">
                              ${selectedMaterials.reduce((total, material) => {
                                const subtotal = material.pricing.disposalFee.rate * 0.7 * (material.weights?.net || 0) / 2000;
                                const tax = isTaxable ? subtotal * 0.0825 : 0;
                                const overage = (material.weights?.net || 0) / 2000 > material.pricing.disposalFee.overageThreshold ? material.pricing.disposalFee.overageFee : 0;
                                return total + subtotal + tax + overage;
                              }, 0).toFixed(2)}
                            </span>
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

        {/* Footer Buttons - Always visible */}
        <div className="mt-8 flex justify-end gap-4 border-t pt-4">
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