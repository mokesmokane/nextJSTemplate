"use client"

import { SiteHeader } from "@/components/site/SiteHeader"
import { SubscriptionDetails } from "./components/SubscriptionDetails"

export default function BillingPage() {
  return (
    <div className="bg-background min-h-screen">
      <SiteHeader />
      <SubscriptionDetails />
    </div>
  )
}
