import { RouteGuard } from "@/components/auth/route-guard"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <RouteGuard>{children}</RouteGuard>
} 