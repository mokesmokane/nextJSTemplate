import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const cookieStore = await cookies()
  // Clear the session cookie
  cookieStore.delete("session")

  return NextResponse.json({ success: true })
}
