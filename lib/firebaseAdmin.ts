import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"

// Only initialize the app if it hasn't been initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n")
    })
  })
}

export const adminAuth = getAuth()
export const adminDb = getFirestore()

export async function getServerUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (!token) return null
  try {
    const decoded = await adminAuth.verifySessionCookie(token, true)
    return { uid: decoded.uid }
  } catch {
    return null
  }
}

export async function getUserTodos(userId: string) {
  const snapshot = await adminDb
    .collection("todos")
    .where("userId", "==", userId)
    .get()
  const todos: {
    id: string
    userId: string
    content: string
    completed: boolean
    createdAt: string
    updatedAt: string
  }[] = []
  snapshot.forEach(doc => {
    const data = doc.data()
    todos.push({
      id: doc.id,
      userId: data.userId,
      content: data.content,
      completed: data.completed,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  })
  return todos
}
