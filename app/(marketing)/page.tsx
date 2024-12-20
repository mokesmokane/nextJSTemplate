/*
<ai_context>
This server page is the marketing homepage.
</ai_context>
*/

import { redirect } from "next/navigation"
import { FeaturesSection } from "@/components/landing/features"
import { HeroSection } from "@/components/landing/hero"
import { getAuth } from "firebase-admin/auth"
import { cookies } from "next/headers"

export default async function HomePage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")?.value

  if (sessionCookie) {
    const decodedClaims = await getAuth().verifySessionCookie(sessionCookie)
    if (decodedClaims) {
      redirect("/dashboard/todo")
    }
  }

  return (
    <div className="pb-20">
      <HeroSection />
      {/* social proof */}
      <FeaturesSection />
      {/* pricing */}
      {/* faq */}
      {/* blog */}
      {/* footer */}
    </div>
  )
}
