import { NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const user = await getUserFromToken(token)

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
