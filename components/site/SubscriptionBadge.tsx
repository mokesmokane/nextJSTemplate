import Link from "next/link"
import { useSubscription } from "@/lib/context/subscription-context"

export function SubscriptionBadge() {
  const { subscriptionStatus } = useSubscription()
  if (!subscriptionStatus || subscriptionStatus === "free") {
    return (
      <Link
        href="/upgrade"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Upgrade Plan
      </Link>
    )
  }

  if (subscriptionStatus === "pro" || subscriptionStatus === "enterprise") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-3 py-1.5">
        <div className="size-2 animate-pulse rounded-full bg-blue-500" />
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {subscriptionStatus === "pro" ? "Pro" : "Enterprise"} Plan
        </span>
      </div>
    )
  }

  return null
}
