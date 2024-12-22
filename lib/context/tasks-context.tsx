"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Task } from "@/types/tasks-types"
import { getTasksByDateRangeAction } from "@/actions/db/tasks-actions"
import { useDate } from "./date-context"
import { useAuth } from "./auth-context"

interface TasksContextType {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  refreshTasks: () => Promise<void>
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { dateWindow } = useDate()
  const { user } = useAuth()

  const refreshTasks = async () => {
    if (!user) {
      setTasks([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const result = await getTasksByDateRangeAction(
      dateWindow.startDate.toISOString().split("T")[0],
      dateWindow.endDate.toISOString().split("T")[0]
    )

    if (result.isSuccess) {
      setTasks(result.data || [])
      setError(null)
    } else {
      setError(result.message)
      setTasks([])
    }

    setIsLoading(false)
  }

  useEffect(() => {
    void refreshTasks()
  }, [user, dateWindow.startDate, dateWindow.endDate])

  return (
    <TasksContext.Provider value={{ tasks, isLoading, error, refreshTasks }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider")
  }
  return context
}
