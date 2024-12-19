import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/site/SiteHeader"

import { Separator } from "@/components/ui/separator"

export default async function TodoLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <AppSidebar />
      {children}
    </div>
  )
}
