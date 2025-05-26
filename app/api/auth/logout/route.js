import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear the authentication cookie
    const cookieStore = await cookies()
    cookieStore.delete("auth_token")

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
