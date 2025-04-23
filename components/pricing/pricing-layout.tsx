"use client"

import { useState } from "react"
import { PricingSidebar } from "@/components/pricing/pricing-sidebar"
import { LateFees } from "@/components/pricing/late-fees"
import { Fees } from "@/components/pricing/fees"
import { DisposalFees } from "@/components/pricing/disposal-fees"
import { Services } from "@/components/pricing/services"
import { ChevronLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

type ActiveView = "late-fees" | "fees" | "services" | "service-groups" | "general" | "rental" | "taxes" | "disposal"

export function PricingLayout() {
  const [activeView, setActiveView] = useState<ActiveView>("services")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderContent = () => {
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
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <p className="text-muted-foreground">Select an option from the sidebar</p>
          </div>
        )
    }
  }

  const renderActionButton = () => {
    if (activeView === "services") {
      return (
        <Button size="icon" variant="ghost">
          <Plus className="h-5 w-5" />
        </Button>
      )
    }
    return null
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className={`border-r transition-all duration-200 ${sidebarCollapsed ? "w-0 -ml-[250px]" : "w-[250px]"}`}>
        <PricingSidebar activeView={activeView} onViewChange={setActiveView} collapsed={sidebarCollapsed} />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 flex items-center h-12 px-4 border-b bg-background">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="mr-2 h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
          </button>
          <h1 className="text-xl font-semibold">
            {activeView === "late-fees"
              ? "Late Fees"
              : activeView === "fees"
                ? "Fees"
                : activeView === "disposal"
                  ? "Disposal Fees"
                  : activeView === "services"
                    ? "Services"
                    : activeView.charAt(0).toUpperCase() + activeView.slice(1).replace("-", " ")}
          </h1>
          <div className="ml-auto">{renderActionButton()}</div>
        </div>
        <div className="h-[calc(100vh-112px)]">{renderContent()}</div>
      </div>
    </div>
  )
}
