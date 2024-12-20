"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

type UsageType = "work" | "personal" | "school"
type UsageMode = "solo" | "team"

interface TaskInterestsStepProps {
  taskInterests: string[]
  setTaskInterests: (interests: string[]) => void
  usageType: UsageType | null
  usageMode: UsageMode | null
  onComplete: () => void
}

export function TaskInterestsStep({
  taskInterests,
  setTaskInterests,
  usageType,
  usageMode,
  onComplete
}: TaskInterestsStepProps) {
  const getTaskOptions = () => {
    const baseOptions = [
      { id: "note-taking", label: "Note-taking" },
      { id: "task-tracking", label: "Task Tracking" },
      { id: "document-creation", label: "Document Creation" },
      { id: "goal-setting", label: "Goal Setting" },
      { id: "time-management", label: "Time Management" },
      { id: "brainstorming", label: "Brainstorming" }
    ]

    const specificOptions = {
      work: [
        { id: "project-management", label: "Project Management" },
        { id: "team-collaboration-work", label: "Team Collaboration" },
        { id: "client-management", label: "Client Management" }
      ],
      personal: [
        { id: "habit-tracking", label: "Habit Tracking" },
        { id: "journaling", label: "Journaling" },
        { id: "budgeting", label: "Budgeting" }
      ],
      school: [
        { id: "study-planning", label: "Study Planning" },
        { id: "research-organization", label: "Research Organization" },
        { id: "assignment-tracking", label: "Assignment Tracking" }
      ]
    }

    const modeOptions = {
      solo: [
        { id: "personal-productivity", label: "Personal Productivity" },
        { id: "self-reflection", label: "Self-reflection" }
      ],
      team: [
        { id: "team-collaboration-mode", label: "Team Collaboration" },
        { id: "task-delegation", label: "Task Delegation" },
        { id: "progress-tracking", label: "Progress Tracking" }
      ]
    }

    const allOptions = [
      ...baseOptions,
      ...(usageType ? specificOptions[usageType] : []),
      ...(usageMode ? modeOptions[usageMode] : [])
    ]

    // Remove duplicates based on id
    return Array.from(new Map(allOptions.map(item => [item.id, item])).values())
  }

  const toggleTask = (taskId: string) => {
    if (taskInterests.includes(taskId)) {
      setTaskInterests(taskInterests.filter(t => t !== taskId))
    } else {
      setTaskInterests([...taskInterests, taskId])
    }
  }

  const getChipColor = (task: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500"
    ]
    return colors[task.length % colors.length]
  }

  return (
    <motion.div
      className="space-y-4"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <h2 className="text-lg font-semibold">
        What kind of tasks are you interested in?
      </h2>
      <motion.div
        className="h-[130px]"
        layout
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <ScrollArea className="h-full">
          <div className="flex flex-wrap gap-2 p-1">
            <AnimatePresence>
              {getTaskOptions().map((task, index) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Badge
                    onClick={() => toggleTask(task.id)}
                    className={`cursor-pointer ${
                      taskInterests.includes(task.id)
                        ? `${getChipColor(task.label)} text-white`
                        : "bg-gray-200 text-gray-700"
                    } transition-colors hover:bg-opacity-80`}
                  >
                    {task.label}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </motion.div>
      <motion.div
        className="mt-6 flex justify-center"
        layout
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Button
          onClick={onComplete}
          disabled={taskInterests.length === 0}
          className="w-full"
        >
          Let's GO!
        </Button>
      </motion.div>
    </motion.div>
  )
}
