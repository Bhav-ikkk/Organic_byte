import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Check if user exists and password matches
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Create user object without password
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
    }

    // Generate token
    const token = generateToken(user.id)

    // Set cookie
    const response = NextResponse.json(userWithoutPassword)
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
