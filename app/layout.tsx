import { RootProvider } from "@/components/utilities/root-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getServerUser } from "@/lib/firebaseAdmin"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mokes' App Template",
  description: "A full-stack web app template now using Firebase."
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const user = await getServerUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background mx-auto min-h-screen w-full scroll-smooth antialiased",
          inter.className
        )}
      >
        <RootProvider serverUser={user}>{children}</RootProvider>
      </body>
    </html>
  )
}
