"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function SubscriptionDetails() {
  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Manage your subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm">
              No subscription is currently active.
            </p>
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Upgrade to unlock more features
              </p>
              <Button asChild>
                <a href="/upgrade">Upgrade</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
