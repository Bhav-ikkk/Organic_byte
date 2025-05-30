import { NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { prisma } from "@/lib/prisma"
import { generateToken } from "@/lib/auth"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function POST(request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 })
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { email, name, picture } = payload

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    })

    // If user doesn't exist, create a new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          profilePicture: picture,
          isAdmin: false,
        },
      })
    }

    // Generate JWT token
    const jwtToken = generateToken(user.id)

    // Set cookie with token
    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      isAdmin: user.isAdmin,
    })

    response.cookies.set({
      name: "auth_token",
      value: jwtToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Error with Google authentication:", error)
    return NextResponse.json({ message: "Authentication failed" }, { status: 500 })
  }
}
