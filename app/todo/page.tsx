import { redirect } from "next/navigation"
import { getServerUser, getUserTodos } from "@/lib/firebaseAdmin"
import { TodoList } from "@/app/todo/_components/todo-list"

export default async function TodoPage() {
  const user = await getServerUser()
  if (!user) {
    return redirect("/login") // or some login page or marketing page
  }

  const todos = await getUserTodos(user.uid)

  return (
    <div className="flex-1 p-4 pt-0">
      <TodoList userId={user.uid} initialTodos={todos} />
    </div>
  )
}