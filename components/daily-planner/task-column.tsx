"use client"

import { useDroppable } from "@dnd-kit/core"

interface TaskColumnProps {
  id: string
  children: React.ReactNode
}

export function TaskColumn({ id, children }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className="bg-muted/50 min-h-[200px] space-y-4 rounded-lg border p-4"
    >
      {children}
    </div>
  )
}
