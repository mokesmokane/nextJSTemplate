"use server"

import { redirect } from "next/navigation"
import { getServerUser, getUserTodos } from "@/lib/firebaseAdmin"
import DailyPlanner from "@/components/daily-planner/daily-planner"

export default async function TodoPage() {
  const user = await getServerUser()
  if (!user) {
    console.log("No user found, redirecting to login")
    return redirect("/login")
  }

  const todos = await getUserTodos(user.uid)
  console.log("Fetched todos:", todos)

  return (
    <div className="size-full">
      <DailyPlanner />
    </div>
  )
}
