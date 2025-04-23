import type { Metadata } from "next"
import BulkMessagingDashboard from "@/components/bulk-messaging/dashboard"

export const metadata: Metadata = {
  title: "Messaging | Hauler Hero",
  description: "Send messages to your customers via email or text",
}

export default function BulkMessagingPage() {
  return (
    <div className="w-full max-w-full px-8 pb-8 pt-0 md:px-12 md:pb-12 md:pt-0 lg:px-16 lg:pb-16 lg:pt-0">
      <BulkMessagingDashboard />
    </div>
  )
}
