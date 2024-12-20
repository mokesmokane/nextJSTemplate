"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

type UsageMode = "solo" | "team"

interface UsageModeStepProps {
  usageMode: UsageMode | null
  setUsageMode: (mode: UsageMode) => void
}

export function UsageModeStep({ usageMode, setUsageMode }: UsageModeStepProps) {
  return (
    <motion.div
      className="space-y-4"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-semibold">
        Will you be using this solo or with a team?
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {(["solo", "team"] as const).map(mode => (
          <motion.div
            key={mode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setUsageMode(mode)}
              variant={usageMode === mode ? "default" : "outline"}
              className="h-20 w-full"
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
