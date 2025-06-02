"use client"

import { useState } from "react"
import { PanelLeftClose, PanelLeftOpen, Plus, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PricingSidebar } from "@/components/pricing/pricing-sidebar"
import { LateFees } from "@/components/pricing/late-fees"
import { Fees } from "@/components/pricing/fees"
import { DisposalFees } from "@/components/pricing/disposal-fees"
import { Services } from "@/components/pricing/services"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DisposalFeeFormV2 as DisposalFeeFormV01a } from "@/components/pricing/disposal-fee-form-v01a"
import { DisposalFeeForm as DisposalFeeFormV01b } from "@/components/pricing/disposal-fee-form-v01b"
import { DisposalFeeFormV3 as DisposalFeeFormV02a } from "@/components/pricing/disposal-fee-form-v02a"
import { DisposalFeeFormV3 as DisposalFeeFormV02b } from "@/components/pricing/disposal-fee-form-v02b"
import { DisposalFeeFormV3 as DisposalFeeFormV03 } from "@/components/pricing/disposal-fee-form-v03"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type ActiveView = "late-fees" | "fees" | "services" | "service-groups" | "general" | "rental" | "taxes" | "disposal"

export function PricingLayout() {
  const [activeView, setActiveView] = useState<ActiveView>("disposal")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showFormV1a, setShowFormV1a] = useState(false)
  const [showFormV1b, setShowFormV1b] = useState(false)
  const [showFormV2a, setShowFormV2a] = useState(false)
  const [showFormV2b, setShowFormV2b] = useState(false)
  const [showFormV2, setShowFormV2] = useState(false)
  const [showFormV3, setShowFormV3] = useState(false)

  const [formData, setFormData] = useState({
    rateStructure: "Per Ton",
    overageThreshold: 0,
    overageCharge: 0
  })

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleSaveV2 = (fee: any) => {
    // Handle saving the fee
    setShowFormV2(false)
  }

  const handleSaveV2b = (fee: any) => {
    // Handle saving the fee
    setShowFormV2b(false)
  }

  const handleSaveV3 = (fee: any) => {
    // Handle saving the fee
    setShowFormV3(false)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const renderView = () => {
    switch (activeView) {
      case "late-fees":
        return <LateFees />
      case "fees":
        return <Fees />
      case "disposal":
        return <DisposalFees />
      case "services":
        return <Services />
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a view from the sidebar</p>
          </div>
        )
    }
  }

  return (
    <div className="flex h-full">
      <PricingSidebar activeView={activeView} onViewChange={setActiveView} collapsed={sidebarCollapsed} />

      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
          <div className="flex items-center gap-4">
            {/* <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button> */}
            <h1 className="text-xl font-semibold">
              {activeView === "late-fees" && "Late Fees"}
              {activeView === "fees" && "Fees"}
              {activeView === "disposal" && "Disposal Fees"}
              {activeView === "services" && "Services"}
              {activeView === "service-groups" && "Service Groups"}
              {activeView === "general" && "General Fees"}
              {activeView === "rental" && "Rental Fees"}
              {activeView === "taxes" && "Taxes"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {activeView === "disposal" && (
              <>
                
                <div className="flex items-center space-x-2 bg-gray-50 rounded-md p-1 border border-gray-200">
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowFormV3(true)}
                  >
                    v03b
                  </Button>

                
              
                </div>
            
              </>
            )}
          </div>
         
        </div>
         <div className="bg-blue-100 p-4 border-t border-gray-200">
  <div className=" pb-4 space-y-6">
                <Accordion type="single" collapsible defaultValue="">
                  <AccordionItem value="versions">
                    <AccordionTrigger>Click to View Prior Versions</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Version 1</CardTitle>
                            <CardDescription>
                              Included Tonnage with <span className="font-semibold text-blue-500">
                                Chargeable/Not Chargeable Toggle 
                              </span>            
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <Button 
                                variant="outline" 
                                className="h-auto py-4 flex flex-col items-start"
                                onClick={() => {
                                  const disposalFeesComponent = document.querySelector("[data-disposal-fees]")
                                  if (disposalFeesComponent) {
                                    const event = new CustomEvent("add-disposal-fee")
                                    disposalFeesComponent.dispatchEvent(event)
                                  }
                                }}
                              >
                                <p className="font-semibold">v01a </p>
                                <p className="text-xs text-muted-foreground text-left mt-1 text-wrap">
                                  Overage Threshold and Overage Fee <span className="font-semibold text-blue-500">
                                    set per material
                                  </span>
                                </p>
                              </Button>

                              <Button 
                                variant="outline" 
                                className="h-auto py-4 flex flex-col items-start"
                                onClick={() => {
                                  const disposalFeesComponent = document.querySelector("[data-disposal-fees]")
                                  if (disposalFeesComponent) {
                                    const event = new CustomEvent("add-disposal-fee-v1")
                                    disposalFeesComponent.dispatchEvent(event)
                                  }
                                }}
                              >
                                <span className="font-semibold">v01b</span>
                                <span className="text-xs text-wrap text-muted-foreground text-left mt-1">
                                  Overage Threshold and Overage Fee <span className="font-semibold text-blue-500">
                                    set globally.
                                  </span>
                                </span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Version 2</CardTitle>
                            <CardDescription>
                              <span className="line-through">Included Tonnage</span> <span className="font-semibold text-blue-500">Free Tonnage</span> and <span className="font-semibold text-blue-500">
                                Min. Charge</span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <Button 
                                variant="outline" 
                                className="h-auto py-4 flex flex-col items-start"
                                onClick={() => setShowFormV2(true)}
                              >
                                <p className="font-semibold">v02a </p>
                                <p className="text-xs text-muted-foreground text-left mt-1 text-wrap">
                                  Overage Threshold and Overage Fee <span className="font-semibold text-blue-500">
                                    set per material
                                  </span>
                                </p>
                              </Button>
                              <Button 
                                variant="outline" 
                                className="h-auto py-4 flex flex-col items-start"
                                onClick={() => setShowFormV2b(true)}
                              >
                                <span className="font-semibold">v02b</span>
                                <span className="text-xs text-wrap text-muted-foreground text-left mt-1">
                                  Overage Threshold and Overage Fee <span className="font-semibold text-blue-500">
                                    set globally.
                                  </span>
                                </span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Version 3</CardTitle>
                            <CardDescription>
                              Set Fee by Cotnainer or Materials only          
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <Button 
                                variant="outline" 
                                className="h-auto py-4 flex flex-col items-start"
                                onClick={() => {
                                  const disposalFeesComponent = document.querySelector("[data-disposal-fees]")
                                  if (disposalFeesComponent) {
                                    const event = new CustomEvent("add-disposal-fee")
                                    disposalFeesComponent.dispatchEvent(event)
                                  }
                                }}
                              >
                                <p className="font-semibold">v01a </p>
                                <p className="text-xs text-muted-foreground text-left mt-1 text-wrap">
                                  Overage Threshold and Overage Fee <span className="font-semibold text-blue-500">
                                    set per material
                                  </span>
                                </p>
                              </Button>

                              <Button 
                                variant="outline" 
                                className="h-auto py-4 flex flex-col items-start"
                                onClick={() => {
                                  const disposalFeesComponent = document.querySelector("[data-disposal-fees]")
                                  if (disposalFeesComponent) {
                                    const event = new CustomEvent("add-disposal-fee-v1")
                                    disposalFeesComponent.dispatchEvent(event)
                                  }
                                }}
                              >
                                <span className="font-semibold">v01b</span>
                                <span className="text-xs text-wrap text-muted-foreground text-left mt-1">
                                  Overage Threshold and Overage Fee <span className="font-semibold text-blue-500">
                                    set globally.
                                  </span>
                                </span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>         </div>
        <div className="bg-white m-4 shadow-sm">
          <div className="p-4">
            {activeView === "disposal"}
            {renderView()}
          </div>
        </div>
      </div>

      <Dialog open={showFormV2} onOpenChange={setShowFormV2}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
          <DisposalFeeFormV02a
            onSave={handleSaveV2}
            onCancel={() => setShowFormV2(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showFormV2b} onOpenChange={setShowFormV2b}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
          <DisposalFeeFormV02b
            onSave={handleSaveV2b}
            onCancel={() => setShowFormV2b(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showFormV3} onOpenChange={setShowFormV3}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-visible p-0">
          <div className="overflow-y-auto max-h-[90vh]">
            <DisposalFeeFormV03
              onSave={handleSaveV3}
              onCancel={() => setShowFormV3(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
