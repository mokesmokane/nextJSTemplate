"use server"

import { auth, firestore } from "firebase-admin"
import { cookies } from "next/headers"
import { ActionState } from "@/types/server-action-types"
import { Task } from "@/types/tasks-types"

const db = firestore()

// Helper function to get authenticated user ID
async function getAuthenticatedUserId(): Promise<string> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")?.value
  if (!sessionCookie) {
    throw new Error("No session cookie found")
  }

  const decodedClaims = await auth().verifySessionCookie(sessionCookie)
  return decodedClaims.uid
}

// Get tasks by date range
export async function getTasksByDateRangeAction(
  startDate: string,
  endDate: string
): Promise<ActionState<Task[]>> {
  try {
    const userId = await getAuthenticatedUserId()
    const snapshot = await db
      .collection("userTasks")
      .doc(userId)
      .collection("tasks")
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .orderBy("date", "asc")
      .get()

    const tasks: Task[] = []
    snapshot.forEach(doc => {
      const data = doc.data() as Omit<Task, "id">
      tasks.push({
        ...data,
        id: doc.id
      })
    })

    return {
      isSuccess: true,
      message: "Tasks retrieved successfully",
      data: tasks
    }
  } catch (error) {
    console.error("Error getting tasks by date range:", error)
    return { isSuccess: false, message: "Failed to get tasks by date range" }
  }
}

// Create a single task
export async function createTaskAction(
  task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<ActionState<Task>> {
  try {
    const userId = await getAuthenticatedUserId()
    
    const docRef = db
      .collection("userTasks")
      .doc(userId)
      .collection("tasks")
      .doc()
    
    const taskData = {
      ...task,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await docRef.set(taskData)

    return {
      isSuccess: true,
      message: "Task created successfully",
      data: {
        id: docRef.id,
        ...task,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Task
    }
  } catch (error) {
    console.error("Error creating task:", error)
    return { isSuccess: false, message: "Failed to create task" }
  }
}

// Update a single task
export async function updateTaskAction(
  taskId: string,
  updates: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>
): Promise<ActionState<Task>> {
  try {
    const userId = await getAuthenticatedUserId()
    

    const taskRef = db
      .collection("userTasks")
      .doc(userId)
      .collection("tasks")
      .doc(taskId)

    const taskDoc = await taskRef.get()
    if (!taskDoc.exists) {
      return { isSuccess: false, message: "Task not found" }
    }

    const updatedData: Partial<Task> = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await taskRef.update(updatedData)

    const updatedDoc = await taskRef.get()
    const updatedTask = updatedDoc.data() as Omit<Task, "id">

    return {
      isSuccess: true,
      message: "Task updated successfully",
      data: {
        ...updatedTask,
        id: taskId
      }
    }
  } catch (error) {
    console.error("Error updating task:", error)
    return { isSuccess: false, message: "Failed to update task" }
  }
}