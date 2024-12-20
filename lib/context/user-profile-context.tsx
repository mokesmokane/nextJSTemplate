"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-context"
import { doc, onSnapshot } from "firebase/firestore"
import { firestore } from "@/lib/firebaseClient"
import { UserProfile } from "@/types/user-types"

interface UserProfileContextType {
  userProfile: UserProfile | null
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
)

export function UserProfileProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      setIsLoading(true)

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        doc(firestore, "users", user.uid),
        docSnap => {
          if (!docSnap.exists()) {
            setUserProfile(null)
          } else {
            const data = docSnap.data()
            setUserProfile({
              id: docSnap.id,
              email: data.email,
              preferences: data.preferences,
              createdAt: data.createdAt?.toDate(),
              updatedAt: data.updatedAt?.toDate()
            })
          }
          setIsLoading(false)
        },
        error => {
          console.error("Error listening to user profile:", error)
          setUserProfile(null)
          setIsLoading(false)
        }
      )

      // Cleanup subscription on unmount
      return () => unsubscribe()
    } else {
      setUserProfile(null)
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.uid])

  const refreshProfile = async () => {
    // With real-time updates, this is only needed if you want to force a refresh
    if (user?.uid) {
      setIsLoading(true)
      // The snapshot listener will automatically update the state
      setIsLoading(false)
    }
  }

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        isLoading,
        refreshProfile
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider")
  }
  return context
}
