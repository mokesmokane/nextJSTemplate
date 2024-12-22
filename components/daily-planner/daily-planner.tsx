"use client"

import { useState, useRef, useEffect } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { format, isSameDay } from "date-fns"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskColumn } from "./task-column"
import { TaskCard } from "./task-card"
import { useDate } from "@/lib/context/date-context"
import { useTasks } from "@/lib/context/tasks-context"
import { createTaskAction, updateTaskAction } from "@/actions/db/tasks-actions"
import type { Task } from "@/types/tasks-types"

const SCROLL_PADDING = 40

// Helper to group tasks by date
function groupTasksByDate(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce(
    (groups, task) => {
      if (!groups[task.date]) {
        groups[task.date] = []
      }
      groups[task.date].push(task)
      return groups
    },
    {} as Record<string, Task[]>
  )
}

export default function DailyPlanner() {
  const {
    selectedDate,
    loadDates,
    addToStartOfDateWindow,
    addToEndOfDateWindow,
    isLoading: isLoadingDates,
    days
  } = useDate()
  const { tasks, isLoading: isLoadingTasks, refreshTasks } = useTasks()
  const [activeId, setActiveId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Group tasks by date
  const grouped = groupTasksByDate(tasks)
  // Make an array of columns based on the loaded days
  const columns = days.map(dateStr => {
    return {
      date: dateStr,
      tasks: grouped[dateStr] || []
    }
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  // If user drags a task from one date to another, we update the task's date.
  // Then refresh tasks.
  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find active task
    const oldDateCol = columns.find(col =>
      col.tasks.some(t => t.id === activeId)
    )
    if (!oldDateCol) return
    const activeTask = oldDateCol.tasks.find(t => t.id === activeId)
    if (!activeTask) return

    // Find new date col
    const newDateCol = columns.find(
      col => col.date === overId || col.tasks.some(t => t.id === overId)
    )
    if (!newDateCol) return

    // If it's a different date, update in Firestore
    if (oldDateCol.date !== newDateCol.date) {
      const result = await updateTaskAction(activeTask.id, {
        date: newDateCol.date,
        order: newDateCol.tasks.length
      })
      if (result.isSuccess) {
        await refreshTasks()
      }
    }
  }

  // If user reorders tasks within the same date, update order.
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) {
      setActiveId(null)
      return
    }
    const activeId = active.id as string
    const overId = over.id as string

    const dateCol = columns.find(col => col.tasks.some(t => t.id === activeId))
    if (!dateCol) {
      setActiveId(null)
      return
    }

    const tasksArray = dateCol.tasks
    const oldIndex = tasksArray.findIndex(t => t.id === activeId)
    const newIndex = tasksArray.findIndex(t => t.id === overId)
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
      setActiveId(null)
      return
    }

    const activeTask = tasksArray[oldIndex]
    if (activeTask) {
      // Update the order for the active task
      await updateTaskAction(activeTask.id, {
        order: newIndex
      })
      await refreshTasks()
    }
    setActiveId(null)
  }

  const addTask = async (dateStr: string) => {
    if (!tasks) return
    const newTask = {
      title: "New Task",
      time: "0:00",
      subtasks: [],
      completed: false,
      tag: "work",
      date: dateStr,
      order: grouped[dateStr]?.length ?? 0
    }
    const result = await createTaskAction(newTask)
    if (result.isSuccess) {
      await refreshTasks()
    }
  }

  // Scroll to date
  const scrollToDate = (date: string) => {
    const targetColumn = columns.find(col => col.date === date)
    if (!targetColumn || !containerRef.current) {
      // If we don't have the date loaded, load more columns
      loadDates(new Date(date)) // attempt to load that date
      return
    }

    const columnElement = document.getElementById(date)
    if (!columnElement) return

    const container = containerRef.current
    const scrollLeft =
      columnElement.offsetLeft -
      container.offsetWidth / 2 +
      columnElement.offsetWidth / 2

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth"
    })
  }

  useEffect(() => {
    if (selectedDate) {
      scrollToDate(format(selectedDate, "yyyy-MM-dd"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, columns])

  const isLoading = isLoadingDates || isLoadingTasks

  return (
    <div className="relative size-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="relative h-full">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 absolute left-0 top-1/2 z-10 -translate-y-1/2 backdrop-blur-sm"
            onClick={() => addToStartOfDateWindow()}
            disabled={isLoading}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 absolute right-0 top-1/2 z-10 -translate-y-1/2 backdrop-blur-sm"
            onClick={() => addToEndOfDateWindow()}
            disabled={isLoading}
          >
            <ChevronRight className="size-4" />
          </Button>

          <div
            ref={containerRef}
            className="flex h-full snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-12"
            style={{
              scrollPaddingLeft: SCROLL_PADDING,
              scrollPaddingRight: SCROLL_PADDING
            }}
          >
            {columns.map(column => (
              <div
                key={column.date}
                id={column.date}
                className="w-[300px] shrink-0 snap-center"
              >
                <div className="mb-4 space-y-1.5">
                  <h2 className="text-lg font-semibold">{column.date}</h2>
                  <p className="text-muted-foreground text-sm">
                    {column.tasks.length} tasks
                  </p>
                </div>

                <SortableContext
                  items={column.tasks.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <TaskColumn id={column.date}>
                    {column.tasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </TaskColumn>
                </SortableContext>

                <Button
                  variant="outline"
                  className="mt-4 w-full justify-start"
                  onClick={() => addTask(column.date)}
                >
                  <Plus className="mr-2 size-4" />
                  Add task
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <TaskCard task={tasks.find(t => t.id === activeId)!} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
