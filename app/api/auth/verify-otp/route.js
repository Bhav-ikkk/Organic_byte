import { NextResponse } from "next/server"
import { verifyOTP } from "@/lib/otp"
import { prisma } from "@/lib/prisma"
import { generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { phone, code, userData } = await request.json()

    if (!phone || !code) {
      return NextResponse.json({ message: "Phone number and code are required" }, { status: 400 })
    }

    // Verify OTP
    const isValid = await verifyOTP(phone, code)

    if (!isValid) {
      return NextResponse.json({ message: "Invalid or expired code" }, { status: 400 })
    }

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: { phone },
    })

    // If user doesn't exist and we have userData, create a new user
    if (!user && userData) {
      user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          phone,
          isAdmin: false,
        },
      })
    } else if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Generate JWT token
    const token = generateToken(user.id)

    // Set cookie with token
    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
    })

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ message: "Failed to verify OTP" }, { status: 500 })
  }
}
