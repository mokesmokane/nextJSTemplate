"use client"
import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc
} from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
export const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const firestore = getFirestore(app)

// Initialize Analytics only on client side and if it's available
let analytics = null
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

export { analytics }

export async function createTodo(userId: string, content: string) {
  const ref = await addDoc(collection(firestore, "todos"), {
    userId,
    content,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  const newDoc = await getDoc(ref)
  const data = newDoc.data()
  return {
    id: ref.id,
    userId: data!.userId,
    content: data!.content,
    completed: data!.completed,
    createdAt: data!.createdAt,
    updatedAt: data!.updatedAt
  }
}

export async function updateTodo(
  userId: string,
  id: string,
  updateData: Partial<{ content: string; completed: boolean }>
) {
  const docRef = doc(firestore, "todos", id)
  await updateDoc(docRef, {
    ...updateData,
    updatedAt: new Date().toISOString()
  })
}

export async function deleteTodo(userId: string, id: string) {
  const docRef = doc(firestore, "todos", id)
  await deleteDoc(docRef)
}
