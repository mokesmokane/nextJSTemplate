'use client'

import { createContext, useContext, useState } from "react"

type SubscriptionStatus = 'free' | 'pro' | 'enterprise'

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus | null
  setSubscriptionStatus: (status: SubscriptionStatus | null) => void
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>('free')

  return (
    <SubscriptionContext.Provider value={{ subscriptionStatus, setSubscriptionStatus }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
} 