"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { SelectTodo } from "@/types/firebase-types"
import { createTodo, deleteTodo, updateTodo } from "@/lib/firebaseClient"

interface TodoListProps {
  userId: string
  initialTodos: SelectTodo[]
}

export function TodoList({ userId, initialTodos }: TodoListProps) {
  const [newTodo, setNewTodo] = useState("")
  const [todos, setTodos] = useState(initialTodos)

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      const tempId = Date.now().toString()
      const newTodoData: SelectTodo = {
        id: tempId,
        userId: userId,
        content: newTodo,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setTodos(prevTodos => [...prevTodos, newTodoData])
      setNewTodo("")

      const result = await createTodo(userId, newTodo)
      if (result) {
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === tempId ? result : todo))
        )
      } else {
        // revert
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== tempId))
      }
    }
  }

  const handleToggleTodo = async (id: string, completed: boolean) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    )

    await updateTodo(userId, id, { completed: !completed })
  }

  const handleRemoveTodo = async (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))

    await deleteTodo(userId, id)
  }

  return (
    <div className="bg-card mx-auto w-full max-w-2xl rounded-lg border p-6 shadow-sm">
      <div className="mb-6 flex">
        <Input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="mr-2"
          onKeyDown={e => e.key === "Enter" && handleAddTodo()}
        />
        <Button onClick={handleAddTodo}>Add</Button>
      </div>

      <ul className="space-y-3">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="bg-background flex items-center justify-between rounded-md border p-3"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() =>
                  handleToggleTodo(todo.id, todo.completed)
                }
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`${
                  todo.completed ? "text-muted-foreground line-through" : ""
                }`}
              >
                {todo.content}
              </label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveTodo(todo.id)}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete todo</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
