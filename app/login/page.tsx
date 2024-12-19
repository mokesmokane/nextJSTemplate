"use client"

import { EmailLinkAuth } from "@/components/auth/email-link-auth"
// Removed client-side redirect effect to rely solely on server-side auth
// and session cookie checks.

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        
        <EmailLinkAuth />
      </div>
    </div>
  )
}