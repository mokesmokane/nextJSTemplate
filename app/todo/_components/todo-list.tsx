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
          prevTodos.map(todo =>
            todo.id === tempId ? result : todo
          )
        )
      } else {
        // revert
        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== tempId)
        )
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
    <div className="bg-card mx-auto mt-8 max-w-md rounded-lg p-6 shadow">
      <h1 className="mb-4 text-center text-2xl font-bold">Todo App</h1>

      <div className="mb-4 flex">
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
      <ul className="space-y-2">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="bg-muted flex items-center justify-between rounded p-2"
          >
            <div className="flex items-center">
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() =>
                  handleToggleTodo(todo.id, todo.completed)
                }
                className="mr-2"
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`${todo.completed ? "text-muted-foreground line-through" : ""}`}
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