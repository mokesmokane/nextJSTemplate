export interface BaseDocument {
  id: string
  createdAt: string
  updatedAt: string
}

export interface Subtask extends BaseDocument {
  text: string
  completed: boolean
}

export interface Task extends BaseDocument {
  title: string
  time?: string
  subtasks: Subtask[]
  completed: boolean
  tag?: string
  order: number
}

export interface Day extends BaseDocument {
  date: string
  tasks: Task[]
}

export interface DateWindow {
  startDate: Date
  endDate: Date
}
