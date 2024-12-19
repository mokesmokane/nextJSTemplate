'use client'

import { SiteHeader } from "@/components/site/SiteHeader"
import { SubscriptionDetails } from "./components/SubscriptionDetails"

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <SubscriptionDetails />
    </div>
  )
}