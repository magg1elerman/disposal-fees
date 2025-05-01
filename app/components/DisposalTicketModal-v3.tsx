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
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(() => {
    if (source === 'scale') {
      const mswMaterial = materials.find(m => m.name === 'MSW');
      if (mswMaterial) {
        return {
          ...mswMaterial,
          pricing: {
            ...mswMaterial.pricing,
            disposalTicket: {
              ...mswMaterial.pricing.disposalTicket,
              overageThreshold: 5.00
            },
            disposalFee: {
              ...mswMaterial.pricing.disposalFee,
              overageThreshold: 5.00
            }
          }
        };
      }
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
      <div className="bg-white rounded-lg p-8 max-w-[80vw] max-h-[95vh] flex flex-col overflow-hidden">
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
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto pr-4">
          {/* Two Column Layout - 3/4 and 1/4 split */}
          <div className="grid grid-cols-4 gap-12">
            {/* Left Column - Form Fields (3/4 width) */}
            <div className="col-span-3">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              {/* Source Selector and Disposal Site */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Source
                  </label>
                  <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50 h-[42px]">
                    <span className="text-gray-700">{source}</span>
                  </div>
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

              {/* Material Selection and Net Weight */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Material
                  </label>
                  <div className="relative">
                    <select
                      className={`w-full border rounded-lg px-4 py-2 ${source === 'scale' && !isScaleUnlocked ? 'bg-gray-50' : source === 'mobile' && !isMobileUnlocked ? 'bg-gray-50' : 'bg-white'} h-[42px] appearance-none`}
                      value={currentMaterial?.id || ''}
                      onChange={(e) => {
                        const material = materials.find((m: Material) => m.id === e.target.value);
                        setCurrentMaterial(material || null);
                        if (material) {
                          setIsPricingPerTon(!material.allowPerContainer || true);
                          setTicketPricing({
                            ...material.pricing.disposalTicket,
                            overageThreshold: 5.00
                          });
                          if (material.pricing.disposalTicket.containerRate) {
                            setContainerRate(material.pricing.disposalTicket.containerRate);
                          }
                        }
                      }}
                      disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                    >
                      <option value="">Select Material</option>
                      {materials.map((material: Material) => (
                        <option key={material.id} value={material.id}>
                          {material.name}
                        </option>
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

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Net weight
                  </label>
                  <div className={`flex items-top justify-between border rounded-lg px-4 py-2 ${source === 'scale' && !isScaleUnlocked ? 'bg-gray-50' : source === 'mobile' && !isMobileUnlocked ? 'bg-gray-50' : useGrossTare ? 'bg-gray-50' : 'bg-white'}`}>
                    <input
                      type="number"
                      className={`w-full focus:outline-none ${source === 'scale' && !isScaleUnlocked ? 'bg-gray-50' : source === 'mobile' && !isMobileUnlocked ? 'bg-gray-50' : useGrossTare ? 'bg-gray-50' : 'bg-white'}`}
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
                      disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked) || useGrossTare}
                      readOnly={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked) || useGrossTare}
                    />
                    <div className="flex items-center">
                      <span className="text-gray-500 ml-2">Tons</span>
                    </div>
                  </div>
                </div>
              </div>

              {source !== 'scale' && source !== 'mobile' && (
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
              )}

              {(source === 'scale' || source === 'mobile' || useGrossTare) && (
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Gross weight
                    </label>
                    <div className={`flex items-center border rounded-lg px-4 py-2 ${source === 'scale' && !isScaleUnlocked ? 'bg-gray-50' : source === 'mobile' && !isMobileUnlocked ? 'bg-gray-50' : 'bg-white'}`}>
                      <input
                        type="number"
                        className={`w-full focus:outline-none ${source === 'scale' && !isScaleUnlocked ? 'bg-gray-50' : source === 'mobile' && !isMobileUnlocked ? 'bg-gray-50' : 'bg-white'}`}
                        value={ticketDetails.weights.gross / 2000}
                        step="0.01"
                        onChange={(e) => setTicketDetails(prev => ({
                          ...prev,
                          weights: {
                            ...prev.weights,
                            gross: Number(e.target.value) * 2000
                          }
                        }))}
                        disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                        readOnly={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                      />
                      <span className="text-gray-500 ml-2">Tons</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Tare Weight
                    </label>
                    <div className={`flex items-top border rounded-lg px-4 py-2 ${source === 'scale' && !isScaleUnlocked ? 'bg-gray-50' : source === 'mobile' && !isMobileUnlocked ? 'bg-gray-50' : 'bg-white'}`}>
                      <input
                        type="number"
                        className={`w-full focus:outline-none ${source === 'scale' && !isScaleUnlocked ? 'bg-gray-50' : source === 'mobile' && !isMobileUnlocked ? 'bg-gray-50' : 'bg-white'}`}
                        value={ticketDetails.weights.vehicleTare / 2000}
                        step="0.01"
                        onChange={(e) => setTicketDetails(prev => ({
                          ...prev,
                          weights: {
                            ...prev.weights,
                            vehicleTare: Number(e.target.value) * 2000
                          }
                        }))}
                        disabled={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
                        readOnly={(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked)}
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
                <div className={`p-3 rounded shadow-sm border border-gray-200 ${(source === 'scale' && !isScaleUnlocked) || (source === 'mobile' && !isMobileUnlocked) ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs font-medium text-gray-700">Tipping Fee</div>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
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

            {/* Right Column - Image Upload and Disposal Fee (1/4 width) */}
            <div className="col-span-1 flex flex-col">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 flex-1">
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

              {/* Disposal Fee Section */}
              <div className="mt-4">
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
                            <h4 className="font-medium text-blue-500">Disposal Fee</h4>
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
                          <div className="space-y-1 text-xs text-gray-600">
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
                              <span className="text-gray-700 font-bold">Total:</span>
                              <span className="text-gray-700 font-bold">${calculatedFeePrice.toFixed(2)}</span>
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