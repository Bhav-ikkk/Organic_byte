import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isAdmin: true,
      },
    })

    // Generate token
    const token = generateToken(user.id)

    // Set cookie
    const response = NextResponse.json(user)
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
