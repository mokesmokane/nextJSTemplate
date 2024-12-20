"use server"

import { redirect } from "next/navigation"
import { getServerUser, getUserTodos } from "@/lib/firebaseAdmin"
import { TodoList } from "./_components/todo-list"

export default async function TodoPage() {
  const user = await getServerUser()
  if (!user) {
    console.log("No user found, redirecting to login")
    return redirect("/login")
  }

  const todos = await getUserTodos(user.uid)
  console.log("Fetched todos:", todos)

  return (
    <div className="container mx-auto">
      <div className="flex min-h-screen flex-col py-8">
        <h1 className="mb-8 text-3xl font-bold">Todo List</h1>

        <TodoList userId={user.uid} initialTodos={todos} />
      </div>
    </div>
  )
}
