"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UsageTypeStep } from "./usage-type-step"
import { UsageModeStep } from "./usage-mode-step"
import { TaskInterestsStep } from "./task-interests-step"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { UserPreferences, UserProfile } from "@/types/user-types"
import { ActionState } from "@/types/server-action-types"

interface OnboardingFlowProps {
  userId: string
  updatePreferences: (
    prefs: UserPreferences
  ) => Promise<ActionState<UserProfile | null>>
}

export function OnboardingFlow({
  userId,
  updatePreferences
}: OnboardingFlowProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [usageType, setUsageType] = useState<
    UserPreferences["usageType"] | null
  >(null)
  const [usageMode, setUsageMode] = useState<
    UserPreferences["usageMode"] | null
  >(null)
  const [taskInterests, setTaskInterests] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (usageType && step === 1) {
      setTimeout(() => setStep(2), 500)
    }
    if (usageMode && step === 2) {
      setTimeout(() => setStep(3), 500)
    }
  }, [usageType, usageMode, step])

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      if (step === 2) setUsageType(null)
      if (step === 3) setUsageMode(null)
    }
  }

  const showBackButton =
    step > 1 && (usageType || usageMode || taskInterests.length > 0)

  const handleSubmit = async () => {
    if (!usageType || !usageMode || taskInterests.length === 0) {
      toast.error("Please complete all steps")
      return
    }

    setIsSubmitting(true)
    try {
      const preferences: UserPreferences = {
        usageType,
        usageMode,
        taskInterests,
        onboardingCompleted: true
      }

      const result = await updatePreferences(preferences)

      if (result.isSuccess) {
        toast.success("Preferences saved successfully")
        router.push("/dashboard/todo")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to save preferences")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <motion.div
        className="w-full max-w-lg"
        layout
        transition={{
          layout: { duration: 0.5, ease: "easeInOut" }
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your App</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex justify-between">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className={`h-2 w-1/3 rounded-full ${
                    i <= step ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: i <= step ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>
            <motion.div
              layout
              transition={{
                layout: { duration: 0.5, ease: "easeInOut" }
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <UsageTypeStep
                      usageType={usageType}
                      setUsageType={setUsageType}
                    />
                  )}
                  {step === 2 && (
                    <UsageModeStep
                      usageMode={usageMode}
                      setUsageMode={setUsageMode}
                    />
                  )}
                  {step === 3 && (
                    <TaskInterestsStep
                      taskInterests={taskInterests}
                      setTaskInterests={setTaskInterests}
                      usageType={usageType}
                      usageMode={usageMode}
                      onComplete={handleSubmit}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
            <AnimatePresence>
              {showBackButton && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="flex justify-center">
                    <Button
                      onClick={handleBack}
                      disabled={step === 1}
                      variant="ghost"
                      className="flex items-center text-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Back
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
