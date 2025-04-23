"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreVertical, Plus } from "lucide-react"

export function LateFees() {
  const [activeTab, setActiveTab] = useState("all")

  const lateFees = [
    {
      id: 1,
      name: "A new late fee",
      pricingPeriod: "Weekly",
      gracePeriod: "10 days",
      duration: "Indefinite",
      accounts: "3",
      businessLine: "Roll-off",
      amount: "$5.00",
    },
    {
      id: 2,
      name: "Monthly Late Fee",
      pricingPeriod: "Monthly",
      gracePeriod: "5 days",
      duration: "Indefinite",
      accounts: "6",
      businessLine: "None",
      amount: "$5.00",
    },
    {
      id: 3,
      name: "Monthly late fee with 5 days of grace period",
      pricingPeriod: "Monthly",
      gracePeriod: "5 days",
      duration: "Indefinite",
      accounts: "4",
      businessLine: "Roll off",
      amount: "$200.00",
    },
    {
      id: 4,
      name: "Once late fee with grace period",
      pricingPeriod: "Once",
      gracePeriod: "5 days",
      duration: "None",
      accounts: "1",
      businessLine: "None",
      amount: "$12.00",
    },
    {
      id: 5,
      name: "TESTED",
      pricingPeriod: "Once",
      gracePeriod: "Immediate",
      duration: "None",
      accounts: "1",
      businessLine: "None",
      amount: "$5.00",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All business lines</TabsTrigger>
            <TabsTrigger value="residential">Residential</TabsTrigger>
            <TabsTrigger value="commercial">Commercial</TabsTrigger>
            <TabsTrigger value="roll-off">Roll-off</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Late Fee
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        {lateFees.map((fee) => (
          <div key={fee.id} className="border-b last:border-b-0">
            <div className="p-4 bg-muted/10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{fee.name}</h3>
                <div className="flex items-center">
                  <span className="text-xl font-bold mr-2">{fee.amount}</span>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4 p-4">
              <div>
                <div className="text-sm font-medium">{fee.pricingPeriod}</div>
                <div className="text-xs text-muted-foreground">Pricing period</div>
              </div>
              <div>
                <div className="text-sm font-medium">{fee.gracePeriod}</div>
                <div className="text-xs text-muted-foreground">Grace period</div>
              </div>
              <div>
                <div className="text-sm font-medium">{fee.duration}</div>
                <div className="text-xs text-muted-foreground">Duration</div>
              </div>
              <div>
                <div className="text-sm font-medium">{fee.accounts}</div>
                <div className="text-xs text-muted-foreground">accounts</div>
              </div>
              <div>
                <div className="text-sm font-medium">{fee.businessLine}</div>
                <div className="text-xs text-muted-foreground">Business line</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
