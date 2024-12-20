import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { firestore } from "firebase-admin"
import { adminAuth, adminDb } from "@/lib/firebaseAdmin"

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Verify the session
    const sessionCookie = request.cookies.get("session")?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedClaim = await getAuth().verifySessionCookie(sessionCookie)

    // Check if the requested userId matches the authenticated user
    if (decodedClaim.uid !== params.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Fetch user profile from Firestore
    const userDoc = await firestore()
      .collection("users")
      .doc(params.userId)
      .get()

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      )
    }

    const userData = userDoc.data()

    return NextResponse.json({
      id: userDoc.id,
      ...userData,
      createdAt: userData?.createdAt?.toDate(),
      updatedAt: userData?.updatedAt?.toDate()
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
