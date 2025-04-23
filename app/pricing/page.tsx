import type { Metadata } from "next"
import { PricingLayout } from "@/components/pricing/pricing-layout"

export const metadata: Metadata = {
  title: "Pricing | Hauler Hero",
  description: "Manage pricing and fees for your waste management services",
}

export default function PricingPage() {
  return <PricingLayout />
}
