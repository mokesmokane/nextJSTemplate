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
      <div className="fixed top-0 z-50 w-full">
        <SiteHeader />
      </div>

      <div className="flex pt-16">
        <aside className="fixed left-0 h-[calc(100vh-4rem)] w-64">
          <Sidebar />
        </aside>

        <main className="ml-64 h-[calc(100vh-8rem)] flex-1 overflow-y-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
