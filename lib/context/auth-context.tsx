"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged, getAuth } from "firebase/auth"
import { app } from "@/lib/firebaseClient"
import { UserProfileProvider } from "./user-profile-context"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
  serverUser
}: {
  children: React.ReactNode
  serverUser: { uid: string } | null
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth(app)

    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user)
      setIsLoading(false)

      if (user) {
        // Create session cookie after sign in
        try {
          const idToken = await user.getIdToken()
          await fetch("/api/auth/session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ idToken })
          })
        } catch (error) {
          console.error("Error creating session:", error)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading
      }}
    >
      <UserProfileProvider>{children}</UserProfileProvider>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
