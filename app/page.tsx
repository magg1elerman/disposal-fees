import type { Metadata } from "next"
import { DashboardOverview } from "@/components/dashboard/overview"

export const metadata: Metadata = {
  title: "Dashboard | Hauler Hero",
  description: "Waste management software for haulers",
}

export default function HomePage() {
  return (
    <div className="w-full max-w-full px-8 pb-8 pt-6 md:px-12 md:pb-12 lg:px-16 lg:pb-16">
      <DashboardOverview />
    </div>
  )
}
