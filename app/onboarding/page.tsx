"use server"

import { OnboardingFlow } from "./_components/onboarding-flow"
import { updateUserPreferencesAction } from "@/actions/db/user-actions"
import { getServerUser } from "@/lib/firebaseAdmin"
import { ActionState } from "@/types/server-action-types"
import { UserPreferences, UserProfile } from "@/types/user-types"
import { redirect } from "next/navigation"

export default async function OnboardingPage() {
  const user = await getServerUser()

  if (!user) {
    redirect("/login")
  }

  async function updatePreferences(
    prefs: UserPreferences
  ): Promise<ActionState<UserProfile | null>> {
    "use server"
    if (!user) {
      return { isSuccess: false, message: "User not found", data: undefined }
    }
    return updateUserPreferencesAction(user.uid, prefs)
  }

  return (
    <OnboardingFlow userId={user.uid} updatePreferences={updatePreferences} />
  )
}
