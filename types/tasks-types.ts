export interface Subtask {
  id: string
  text: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  time: string
  subtasks: Subtask[]
  completed: boolean
  tag: string
  date: string
  order: number
  createdAt: string
  updatedAt: string
}
