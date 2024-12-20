"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

type UsageType = "work" | "personal" | "school"

interface UsageTypeStepProps {
  usageType: UsageType | null
  setUsageType: (type: UsageType) => void
}

export function UsageTypeStep({ usageType, setUsageType }: UsageTypeStepProps) {
  return (
    <motion.div
      className="space-y-4"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-semibold">How do you plan to use our app?</h2>
      <div className="grid grid-cols-3 gap-4">
        {(["work", "personal", "school"] as const).map(type => (
          <motion.div
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setUsageType(type)}
              variant={usageType === type ? "default" : "outline"}
              className="h-20 w-full"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
