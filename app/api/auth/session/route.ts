import { cookies } from "next/headers"
import { getAuth } from "firebase-admin/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json()
    
    // Verify the ID token
    const decodedToken = await getAuth().verifyIdToken(idToken)
    
    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    const sessionCookie = await getAuth().createSessionCookie(idToken, {
      expiresIn
    })
    
    // Wait for cookies
    const cookieStore = await cookies()
    cookieStore.set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/"
    })
    
    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("Session creation error:", error)
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
} 