"use client"

import { SiteHeader } from "@/components/site/SiteHeader"
import { useAuth } from "@/lib/context/auth-context"
import { useState } from "react"

export default function UpgradePage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      alert("Please sign in to upgrade.")
      return
    }
    setIsLoading(true)
    // Placeholder upgrade logic
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/upgrade/success"
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <SiteHeader />
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">Pricing Plans</h1>
          <p className="text-gray-400">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {/* Free Plan */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-8">
            <h3 className="mb-4 text-xl font-bold text-white">Free</h3>
            <p className="mb-6 text-3xl font-bold text-white">
              £0
              <span className="text-base font-normal text-gray-400">
                /month
              </span>
            </p>
            <ul className="mb-8 space-y-4 text-gray-300">
              <li>1 Model</li>
              <li>Basic Features</li>
            </ul>
            <button className="w-full rounded-md border border-gray-600 px-4 py-2 text-white transition hover:bg-gray-700">
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative scale-105 rounded-lg border border-blue-500 bg-gray-800 p-8">
            <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-blue-500 px-3 py-1 text-sm text-white">
              Popular
            </div>
            <h3 className="mb-4 text-xl font-bold text-white">Pro</h3>
            <p className="mb-6 text-3xl font-bold text-white">
              £10
              <span className="text-base font-normal text-gray-400">
                /month
              </span>
            </p>
            <ul className="mb-8 space-y-4 text-gray-300">
              <li>Unlimited Models</li>
              <li>Advanced Features</li>
              <li>Team Collaboration</li>
              <li>Priority Support</li>
            </ul>
            <button
              className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
              onClick={() => handleSubscribe("PRO")}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Upgrade Now"}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-8">
            <h3 className="mb-4 text-xl font-bold text-white">Enterprise</h3>
            <p className="mb-6 text-3xl font-bold text-white">
              £100
              <span className="text-base font-normal text-gray-400">
                /month
              </span>
            </p>
            <ul className="mb-8 space-y-4 text-gray-300">
              <li>Everything in Pro</li>
              <li>Custom Training</li>
              <li>Dedicated Support</li>
              <li>SLA Guarantee</li>
            </ul>
            <button
              className="w-full rounded-md border border-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
              onClick={() => handleSubscribe("ENTERPRISE")}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Contact Sales"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
