"use server"

import { Sidebar } from "@/components/sidebar/Sidebar"
import { SiteHeader } from "@/components/site/SiteHeader"
import { getServerUser } from "@/lib/firebaseAdmin"
import { redirect } from "next/navigation"
import { getUserProfileAction } from "@/actions/db/user-actions"

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const user = await getServerUser()

  if (!user) {
    redirect("/login")
  }

  const { isSuccess, data: userProfile } = await getUserProfileAction(user.uid)

  if (!isSuccess || !userProfile?.preferences) {
    redirect("/onboarding")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  )
}
