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
import { DisposalFeeFormV3 } from "@/components/pricing/disposal-fee-form-v3"

type ActiveView = "late-fees" | "fees" | "services" | "service-groups" | "general" | "rental" | "taxes" | "disposal"

export function PricingLayout() {
  const [activeView, setActiveView] = useState<ActiveView>("disposal")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showFormV2, setShowFormV2] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleSaveV2 = (fee: any) => {
    // Handle saving the fee
    setShowFormV2(false)
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
          <div className="flex items-center space-x-2">
            {activeView === "disposal" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const disposalFeesComponent = document.querySelector("[data-disposal-fees]")
                    if (disposalFeesComponent) {
                      const event = new CustomEvent("add-disposal-fee-v1")
                      disposalFeesComponent.dispatchEvent(event)
                    }
                  }}
                >
                  v01
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // This will be handled by the DisposalFees component
                    const disposalFeesComponent = document.querySelector("[data-disposal-fees]")
                    if (disposalFeesComponent) {
                      const event = new CustomEvent("add-disposal-fee")
                      disposalFeesComponent.dispatchEvent(event)
                    }
                  }}
                >
                  v02A
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowFormV2(true)}
                >
                  v02B
                  {/* <Plus className="h-5 w-5" /> */}

                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="bg-white m-4  shadow-sm">
          <div className="p-4">{renderView()}</div>
        </div>
      </div>

      <Dialog open={showFormV2} onOpenChange={setShowFormV2}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
          <DisposalFeeFormV3
            onSave={handleSaveV2}
            onCancel={() => setShowFormV2(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
