import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"

// 5 days in seconds - matches Firebase default
const SESSION_LENGTH = 60 * 60 * 24 * 5 * 1000

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json(
        { error: "Id token is required" },
        { status: 400 }
      )
    }

    // Create session cookie
    const sessionCookie = await getAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_LENGTH
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("session", sessionCookie, {
      maxAge: SESSION_LENGTH,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  return NextResponse.json({ success: true })
}
