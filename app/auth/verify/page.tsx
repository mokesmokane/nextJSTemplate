"use client"

import { useEffect, useState } from "react"
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function VerifyPage() {
  const [error, setError] = useState<string>()
  const router = useRouter()

  useEffect(() => {
    async function completeSignIn() {
      const auth = getAuth()
      
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn")
        
        if (!email) {
          // If missing email, prompt user for it
          email = window.prompt("Please provide your email for confirmation")
        }
        
        try {
          await signInWithEmailLink(
            auth,
            email || "",
            window.location.href
          )
          
          // Clear email from storage
          window.localStorage.removeItem("emailForSignIn")
          
          // Get ID token and set session cookie
          const currentUser = auth.currentUser
          if (currentUser) {
            const idToken = await currentUser.getIdToken(true)
            await fetch("/api/auth/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken })
            })
          }

          router.push("/todo")
        } catch (error) {
          console.error("Error signing in:", error)
          setError("Failed to sign in. Please try again.")
        }
      } else {
        setError("Invalid sign in link")
      }
    }

    completeSignIn()
  }, [router])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600">{error}</h1>
          <Button
            onClick={() => router.push("/login")}
            className="mt-4"
          >
            Back to login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl">Completing sign in...</h1>
      </div>
    </div>
  )
}