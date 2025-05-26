import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock user data
const users = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be hashed
    firstName: "Admin",
    lastName: "User",
    isAdmin: true,
  },
  {
    id: "2",
    email: "user@example.com",
    password: "user123", // In a real app, this would be hashed
    firstName: "Regular",
    lastName: "User",
    isAdmin: false,
  },
]

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Find user by email
    const user = users.find((u) => u.email === email)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Create a user object without the password
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    }

    // Set a cookie for authentication
    // In a real app, you would use a JWT or other secure token
    const cookieStore = await cookies()
    cookieStore.set("auth_token", JSON.stringify(userWithoutPassword), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
