'use client'

import { AuthProvider } from "@/lib/context/auth-context"
import { SidebarProvider } from "@/lib/context/sidebar-context"
import { SubscriptionProvider } from "@/lib/context/subscription-context"
import { Providers } from "./providers"
import { PostHogUserIdentify } from "./posthog/posthog-user-identity"
import { PostHogPageview } from "./posthog/posthog-pageview"
import { TailwindIndicator } from "./tailwind-indicator"
import { Toaster } from "../ui/toaster"

interface RootProviderProps {
  children: React.ReactNode
  serverUser: { uid: string } | null
}

export function RootProvider({ children, serverUser }: RootProviderProps) {
  return (
    <>
      <AuthProvider serverUser={serverUser}>
        <Providers
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <PostHogUserIdentify />
          <PostHogPageview />

          <SubscriptionProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </SubscriptionProvider>

          <Toaster />
        </Providers>
      </AuthProvider>
      <TailwindIndicator />
    </>
  )
} 