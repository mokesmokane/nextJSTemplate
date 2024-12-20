"use client"
import { useAuth } from "@/lib/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return user ? <>{children}</> : null
}
