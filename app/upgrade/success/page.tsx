'use client'

import { useEffect } from 'react'
import { SiteHeader } from "@/components/site/SiteHeader"

export default function SuccessPage() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = '/'
    }, 3000)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <SiteHeader />
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Thank you for your purchase!</h1>
        <p className="text-gray-400">You will be redirected shortly...</p>
      </div>
    </div>
  )
}