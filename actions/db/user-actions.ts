"use server"

import { firestore } from "firebase-admin"
import type { ActionState } from "@/types/server-action-types"
import type { UserPreferences, UserProfile } from "@/types/user-types"

export async function getUserProfileAction(
  userId: string
): Promise<ActionState<UserProfile | null>> {
  try {
    const userDoc = await firestore()
      .collection("users")
      .doc(userId)
      .get()
    
    const userData = userDoc.data() as UserProfile | undefined
    
    return {
      isSuccess: true,
      message: "User profile retrieved successfully",
      data: userData || null
    }
  } catch (error) {
    console.error("Error getting user profile:", error)
    return { isSuccess: false, message: "Failed to get user profile" }
  }
}

export async function updateUserPreferencesAction(
  userId: string,
  preferences: UserPreferences
): Promise<ActionState<UserProfile | null>> {
  try {   
    await firestore()
      .collection("users")
      .doc(userId)
      .update({ preferences })

    return { isSuccess: true, message: "User preferences updated successfully", data: null }
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return { isSuccess: false, message: "Failed to update user preferences" }
  }
}