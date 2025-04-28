"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { materials, Material, MaterialPricing } from '@/app/config/materials';

// Add new interface for disposal fee
interface DisposalFee {
  id: string;
  name: string;
  date: string;
  amount: number;
  materialId: string;
}

interface DisposalTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  onSave: (ticketData: any) => void;
  disposalFees?: DisposalFee[]; // Add this prop
}

export default function DisposalTicketModal({ 
  isOpen, 
  onClose, 
  workOrderId, 
  onSave,
  disposalFees = [] // Add default empty array
}: DisposalTicketModalProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
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

  // Update pricing when material is selected
  useEffect(() => {
    if (selectedMaterial) {
      setTicketPricing(selectedMaterial.pricing.disposalTicket);
      if (selectedMaterial.pricing.disposalTicket.containerRate) {
        setContainerRate(selectedMaterial.pricing.disposalTicket.containerRate);
      }
      // If material doesn't allow per container pricing, force per ton
      if (!selectedMaterial.allowPerContainer) {
        setIsPricingPerTon(true);
      }
    }
  }, [selectedMaterial]);

  useEffect(() => {
    if (selectedMaterial) {
      if (isPricingPerTon) {
        calculatePrices();
      } else {
        setCalculatedTicketPrice(containerRate);
        setCalculatedFeePrice(selectedMaterial.pricing.disposalFee.containerRate || 0);
      }
    }
  }, [isPricingPerTon, ticketPricing, containerRate, actualTonnage, selectedMaterial]);

  // Add effect to update pricing when disposal fee is selected
  useEffect(() => {
    if (selectedDisposalFee && selectedMaterial) {
      // Update pricing based on the selected disposal fee
      setCalculatedFeePrice(selectedDisposalFee.amount);
    }
  }, [selectedDisposalFee]);

  const calculatePrices = () => {
    if (!selectedMaterial) return;

    // Calculate ticket price (what we're charged)
    const chargeableTonnage = Math.max(0, actualTonnage - ticketPricing.includedTonnage);
    let ticketPrice = ticketPricing.rate * chargeableTonnage;
    if (actualTonnage > ticketPricing.overageThreshold) {
      ticketPrice += ticketPricing.overageFee;
    }
    setCalculatedTicketPrice(ticketPrice);

    // Calculate fee price (what we charge)
    const feePricing = selectedMaterial.pricing.disposalFee;
    const feeChargeableTonnage = Math.max(0, actualTonnage - feePricing.includedTonnage);
    let feePrice = feePricing.rate * feeChargeableTonnage;
    if (actualTonnage > feePricing.overageThreshold) {
      feePrice += feePricing.overageFee;
    }
    setCalculatedFeePrice(feePrice);
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
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Create Disposal Ticket</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Type
                </label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={selectedMaterial?.id || ''}
                  onChange={(e) => {
                    const material = materials.find(m => m.id === e.target.value);
                    setSelectedMaterial(material || null);
                    setSelectedDisposalFee(null); // Reset disposal fee when material changes
                  }}
                >
                  <option value="">Select a material...</option>
                  {materials.map(material => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))}
                </select>
                {selectedMaterial?.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedMaterial.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connect to Existing Fee
                </label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={selectedDisposalFee?.id || ''}
                  onChange={(e) => {
                    const fee = disposalFees.find(f => f.id === e.target.value);
                    setSelectedDisposalFee(fee || null);
                  }}
                  disabled={!selectedMaterial}
                >
                  <option value="">Select a fee...</option>
                  {disposalFees
                    .filter(fee => !selectedMaterial || fee.materialId === selectedMaterial.id)
                    .map(fee => (
                      <option key={fee.id} value={fee.id}>
                        ${fee.amount.toFixed(2)} - {new Date(fee.date).toLocaleDateString()}
                      </option>
                    ))}
                </select>
                {selectedDisposalFee && (
                  <p className="text-sm text-gray-500 mt-1">
                    Fee: ${selectedDisposalFee.amount.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {selectedMaterial && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing Type
                </label>
                <div className="flex gap-4">
                  <button
                    className={`px-4 py-2 rounded ${
                      isPricingPerTon
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setIsPricingPerTon(true)}
                  >
                    Per Ton
                  </button>
                  {selectedMaterial.allowPerContainer && (
                    <button
                      className={`px-4 py-2 rounded ${
                        !isPricingPerTon
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setIsPricingPerTon(false)}
                    >
                      Per Container
                    </button>
                  )}
                </div>
              </div>
            )}

            {selectedMaterial && isPricingPerTon ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disposal Ticket Rate ($/ton)
                  </label>
                  <input
                    type="number"
                    value={ticketPricing.rate}
                    onChange={(e) =>
                      setTicketPricing({ ...ticketPricing, rate: parseFloat(e.target.value) })
                    }
                    className="border rounded px-3 py-2 w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Rate we are charged by the disposal facility
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Included Tonnage
                  </label>
                  <input
                    type="number"
                    value={ticketPricing.includedTonnage}
                    onChange={(e) =>
                      setTicketPricing({
                        ...ticketPricing,
                        includedTonnage: parseFloat(e.target.value),
                      })
                    }
                    className="border rounded px-3 py-2 w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    No charge for tonnage up to this amount
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overage Threshold (tons)
                  </label>
                  <input
                    type="number"
                    value={ticketPricing.overageThreshold}
                    onChange={(e) =>
                      setTicketPricing({
                        ...ticketPricing,
                        overageThreshold: parseFloat(e.target.value),
                      })
                    }
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overage Fee ($ flat fee)
                  </label>
                  <input
                    type="number"
                    value={ticketPricing.overageFee}
                    onChange={(e) =>
                      setTicketPricing({
                        ...ticketPricing,
                        overageFee: parseFloat(e.target.value),
                      })
                    }
                    className="border rounded px-3 py-2 w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Flat fee applied when tonnage exceeds threshold
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Actual Tonnage
                  </label>
                  <input
                    type="number"
                    value={actualTonnage}
                    onChange={(e) => setActualTonnage(parseFloat(e.target.value))}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
              </div>
            ) : selectedMaterial && !isPricingPerTon ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Container Rate ($)
                </label>
                <input
                  type="number"
                  value={containerRate}
                  onChange={(e) => setContainerRate(parseFloat(e.target.value))}
                  className="border rounded px-3 py-2 w-full"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Rate we are charged by the disposal facility
                </p>
              </div>
            ) : null}

            {selectedMaterial && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-lg font-semibold mb-2">Disposal Ticket (Our Cost)</div>
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
                            <span>Our Cost:</span>
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
                            <span>Our Cost:</span>
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

                <div className="p-4 bg-blue-50 rounded">
                  <div className="text-lg font-semibold mb-2">Disposal Fee (Customer Charge)</div>
                  <div className="text-2xl text-blue-600 mb-3">
                    ${calculatedFeePrice.toFixed(2)}
                  </div>
                  {isPricingPerTon && selectedMaterial && (
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-white rounded shadow-sm">
                        <h4 className="font-medium text-gray-700 mb-2">Price Breakdown</h4>
                        <div className="space-y-1 text-gray-600">
                          <div className="flex justify-between">
                            <span>Base Rate:</span>
                            <span>${selectedMaterial.pricing.disposalFee.rate}/ton</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Tonnage:</span>
                            <span>{actualTonnage} tons</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Included Tonnage:</span>
                            <span>{selectedMaterial.pricing.disposalFee.includedTonnage} tons</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Chargeable Tonnage:</span>
                            <span>{Math.max(0, actualTonnage - selectedMaterial.pricing.disposalFee.includedTonnage)} tons</span>
                          </div>
                          <div className="border-t border-gray-200 my-2"></div>
                          <div className="flex justify-between">
                            <span>Base Charge:</span>
                            <span>
                              ${(selectedMaterial.pricing.disposalFee.rate * 
                                Math.max(0, actualTonnage - selectedMaterial.pricing.disposalFee.includedTonnage)).toFixed(2)}
                            </span>
                          </div>
                          {actualTonnage > selectedMaterial.pricing.disposalFee.overageThreshold && (
                            <>
                              <div className="flex justify-between text-orange-600">
                                <span>Overage Fee:</span>
                                <span>+${selectedMaterial.pricing.disposalFee.overageFee.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs">
                                  (Applied when tonnage exceeds {selectedMaterial.pricing.disposalFee.overageThreshold} tons)
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
                  {!isPricingPerTon && selectedMaterial && (
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-white rounded shadow-sm">
                        <h4 className="font-medium text-gray-700 mb-2">Container Price Breakdown</h4>
                        <div className="space-y-1 text-gray-600">
                          <div className="flex justify-between">
                            <span>Container Rate:</span>
                            <span>${selectedMaterial.pricing.disposalFee.containerRate?.toFixed(2)}</span>
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
            )}
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disposal Ticket Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {ticketImage ? (
                  <div className="relative">
                    <img
                      src={ticketImage}
                      alt="Disposal Ticket"
                      className="max-w-full h-auto rounded"
                    />
                    <button
                      onClick={() => setTicketImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
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
        </div>

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
                materialId: selectedMaterial?.id,
                materialName: selectedMaterial?.name,
                ticketPricing: {
                  ...ticketPricing,
                  containerRate: !isPricingPerTon ? containerRate : undefined
                },
                calculatedTicketPrice,
                calculatedFeePrice,
                ticketImage,
                isPricingPerTon,
                actualTonnage,
                connectedDisposalFeeId: selectedDisposalFee?.id,
                connectedDisposalFeeName: selectedDisposalFee?.name,
              });
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!selectedMaterial}
          >
            Save Disposal Ticket
          </button>
        </div>
      </div>
    </div>
  );
} 