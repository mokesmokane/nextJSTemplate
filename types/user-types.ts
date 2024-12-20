export interface UserPreferences {
  usageType: "work" | "personal" | "school"
  usageMode: "solo" | "team"
  taskInterests: string[]
  onboardingCompleted: boolean
}

export interface UserProfile {
  id: string
  email: string
  preferences?: UserPreferences
  createdAt: FirebaseFirestore.Timestamp
  updatedAt: FirebaseFirestore.Timestamp
}
