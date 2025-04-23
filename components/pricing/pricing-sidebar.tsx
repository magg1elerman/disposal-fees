"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"

type ActiveView = "late-fees" | "fees" | "services" | "service-groups" | "general" | "rental" | "taxes" | "disposal"

interface PricingSidebarProps {
  activeView: ActiveView
  onViewChange: (view: ActiveView) => void
  collapsed?: boolean
}

export function PricingSidebar({ activeView, onViewChange, collapsed = false }: PricingSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    services: true,
    fees: true,
    taxes: true,
  })

  const toggleSection = (section: "services" | "fees" | "taxes") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const isActive = (view: ActiveView) => activeView === view

  const SidebarItem = ({
    label,
    view,
    indent = false,
    favorited = false,
    icon,
  }: {
    label: string
    view: ActiveView
    indent?: boolean
    favorited?: boolean
    icon?: React.ReactNode
  }) => (
    <button
      className={cn(
        "flex items-center w-full py-4 text-left hover:bg-muted/50 transition-colors",
        collapsed ? "justify-center px-3" : "justify-between px-4",
        isActive(view) && "bg-blue-50",
        indent && !collapsed && "pl-12",
      )}
      onClick={() => onViewChange(view)}
      title={collapsed ? label : undefined}
    >
      {icon && collapsed ? (
        <div className="mx-auto">{icon}</div>
      ) : (
        <>
          <span>{label}</span>
          {!collapsed && (
            <Star className={cn("h-5 w-5", favorited ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
          )}
        </>
      )}
    </button>
  )

  if (collapsed) {
    return (
      <div className="h-full overflow-auto w-14 border-r">
        <div className="py-4 px-3 border-b flex justify-center">
          <span className="sr-only">Pricing</span>
          <div className="h-5 w-5 bg-muted-foreground/20 rounded-md"></div>
        </div>

        <div className="py-2">
          <SidebarItem
            label="Services"
            view="services"
            icon={<div className="h-4 w-4 bg-muted-foreground/20 rounded-sm"></div>}
          />
          <SidebarItem
            label="Service groups"
            view="service-groups"
            icon={<div className="h-4 w-4 bg-muted-foreground/20 rounded-sm"></div>}
          />
        </div>

        <div className="py-2">
          <SidebarItem
            label="General"
            view="general"
            icon={<div className="h-4 w-4 bg-muted-foreground/20 rounded-sm"></div>}
          />
          <SidebarItem
            label="Late"
            view="late-fees"
            icon={<div className="h-4 w-4 bg-muted-foreground/20 rounded-sm"></div>}
          />
          <SidebarItem
            label="Rental"
            view="rental"
            icon={<div className="h-4 w-4 bg-muted-foreground/20 rounded-sm"></div>}
          />
          <SidebarItem
            label="Disposal"
            view="disposal"
            icon={<div className="h-4 w-4 bg-muted-foreground/20 rounded-sm"></div>}
          />
        </div>

        <div className="py-2">
          <SidebarItem
            label="Taxes"
            view="taxes"
            icon={<div className="h-4 w-4 bg-muted-foreground/20 rounded-sm"></div>}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto w-64 border-r">
      <div className="py-4 px-6 border-b">
        <h2 className="text-xl font-medium text-muted-foreground">Pricing</h2>
      </div>

      <div className="border-b">
        <button
          className="flex items-center w-full py-4 px-6 text-left hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection("services")}
        >
          {expandedSections.services ? (
            <ChevronDown className="h-5 w-5 mr-2" />
          ) : (
            <ChevronRight className="h-5 w-5 mr-2" />
          )}
          <span className="font-medium">Services</span>
        </button>

        {expandedSections.services && (
          <div>
            <SidebarItem label="Services" view="services" indent favorited />
            <SidebarItem label="Service groups" view="service-groups" indent />
          </div>
        )}
      </div>

      <div className="border-b">
        <button
          className="flex items-center w-full py-4 px-6 text-left hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection("fees")}
        >
          {expandedSections.fees ? <ChevronDown className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 mr-2" />}
          <span className="font-medium">Fees</span>
        </button>

        {expandedSections.fees && (
          <div>
            <SidebarItem label="General" view="general" indent />
            <SidebarItem label="Late" view="late-fees" indent />
            <SidebarItem label="Rental" view="rental" indent />
            <SidebarItem label="Disposal" view="disposal" indent favorited />
          </div>
        )}
      </div>

      <div className="border-b">
        <button
          className="flex items-center w-full py-4 px-6 text-left hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection("taxes")}
        >
          {expandedSections.taxes ? (
            <ChevronDown className="h-5 w-5 mr-2" />
          ) : (
            <ChevronRight className="h-5 w-5 mr-2" />
          )}
          <span className="font-medium">Taxes</span>
        </button>

        {expandedSections.taxes && (
          <div>
            <SidebarItem label="Taxes" view="taxes" indent />
          </div>
        )}
      </div>
    </div>
  )
}
