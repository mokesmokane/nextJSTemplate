"use client"

import React from "react"
import { motion } from "framer-motion"

interface AIVoiceVisualizerProps {
  isActive: boolean
  audioLevels?: number[]
  className?: string
}

export const AIVoiceVisualizer: React.FC<AIVoiceVisualizerProps> = ({
  isActive,
  audioLevels = Array(30).fill(0)
}) => {
  return (
    <div className="flex h-16 items-center justify-center gap-0.5 rounded-lg p-1">
      {audioLevels.map((level, index) => {
        const heightPercentage = Math.min(level * 200, 200)

        return (
          <motion.div
            key={index}
            className="w-1 origin-center rounded-full bg-blue-500"
            initial={{ height: "0%" }}
            animate={{
              height: `${heightPercentage}%`
            }}
            style={{
              transformOrigin: "center"
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 30,
              restDelta: 0.5,
              mass: 0.1
            }}
          />
        )
      })}
    </div>
  )
}
