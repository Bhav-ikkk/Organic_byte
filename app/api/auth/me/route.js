import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get the authentication cookie
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Parse the user data from the cookie
    const userData = JSON.parse(authToken.value)

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
