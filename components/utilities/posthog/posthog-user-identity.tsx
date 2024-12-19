/*
<ai_context>
This client component identifies the user in PostHog using Firebase Auth.
</ai_context>
*/

"use client"

import { onAuthStateChanged } from "firebase/auth"
import posthog from "posthog-js"
import { useEffect } from "react"
import { auth } from "@/lib/firebaseClient"

export function PostHogUserIdentify() {
  useEffect(() => {
    // Listen for auth state changes using the initialized auth instance
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.uid) {
        // Identify the user in PostHog
        posthog.identify(user.uid)
      } else {
        // If no user is signed in, reset any previously identified user
        posthog.reset()
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  return null
}
