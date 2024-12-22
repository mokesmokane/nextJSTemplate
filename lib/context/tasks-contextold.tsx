// "use client"

// import { createContext, useContext, useEffect, useState } from "react"
// import { Day, Task } from "@/types/daily-task-types"
// import { getDateRangeTasksAction, getDayTasksAction } from "@/actions/db/tasks-actions"
// import { useDate } from "./date-context"
// import { useAuth } from "./auth-context"

// interface TasksContextType {
//   dailyTasks: Day[]
//   isLoading: boolean
//   error: string | null
//   refreshTasks: () => Promise<void>
// }

// const TasksContext = createContext<TasksContextType | undefined>(undefined)

// export function TasksProvider({ children }: { children: React.ReactNode }) {
//   const [dailyTasks, setDailyTasks] = useState<Day[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const { dateWindow } = useDate()
//   const { user } = useAuth()

//   const refreshTasks = async () => {
//     if (!user) {
//       setDailyTasks([])
//       setIsLoading(false)
//       return
//     }

//     //get all the days from the date window
//     const days = await getDateRangeTasksAction(user.uid, dateWindow.startDate.toISOString(), dateWindow.endDate.toISOString())
//     if (days.isSuccess) {
//       setDailyTasks(days.data || [])
//     } else {
//       setError(days.message)
//       setDailyTasks([])
//     }
//     setIsLoading(false)
//   }

//   useEffect(() => {
//     refreshTasks()
//   }, [user, dateWindow.startDate, dateWindow.endDate])

//   return (
//     <TasksContext.Provider value={{ dailyTasks, isLoading, error, refreshTasks }}>
//       {children}
//     </TasksContext.Provider>
//   )
// }

// export function useTasks() {
//   const context = useContext(TasksContext)
//   if (context === undefined) {
//     throw new Error("useTasks must be used within a TasksProvider")
//   }
//   return context
// }
