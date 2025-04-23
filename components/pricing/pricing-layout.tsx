"use client"

import { useState } from "react"
import { PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PricingSidebar } from "@/components/pricing/pricing-sidebar"
import { LateFees } from "@/components/pricing/late-fees"
import { Fees } from "@/components/pricing/fees"
import { DisposalFees } from "@/components/pricing/disposal-fees"
import { Services } from "@/components/pricing/services"

type ActiveView = "late-fees" | "fees" | "services" | "service-groups" | "general" | "rental" | "taxes" | "disposal"

export function PricingLayout() {
  const [activeView, setActiveView] = useState<ActiveView>("disposal")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
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
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
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
          <div className="flex gap-2">
            {activeView === "disposal" && (
              <Button
                size="sm"
                onClick={() => {
                  // This will be handled by the DisposalFees component
                  const disposalFeesComponent = document.querySelector("[data-disposal-fees]")
                  if (disposalFeesComponent) {
                    const event = new CustomEvent("add-disposal-fee")
                    disposalFeesComponent.dispatchEvent(event)
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Disposal Fee
              </Button>
            )}
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </div>
        <div className="p-4">{renderView()}</div>
      </div>
    </div>
  )
}
