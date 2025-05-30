import { NextResponse } from "next/server"
import { generateOTP, saveOTP, sendOTP, formatPhoneNumber, validatePhoneNumber } from "@/lib/otp"
import { prisma } from "@/lib/prisma"

// Rate limiting map (in a production app, use Redis or similar)
const rateLimitMap = new Map()

export async function POST(request) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ message: "Phone number is required" }, { status: 400 })
    }

    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(phone)
    if (!validatePhoneNumber(formattedPhone)) {
      return NextResponse.json({ message: "Invalid phone number format" }, { status: 400 })
    }

    // Check rate limiting (max 3 attempts in 15 minutes)
    const now = Date.now()
    const key = `${formattedPhone}_${Math.floor(now / (15 * 60 * 1000))}`
    const attempts = rateLimitMap.get(key) || 0

    if (attempts >= 3) {
      return NextResponse.json(
        {
          message: "Too many attempts. Please try again later.",
        },
        { status: 429 },
      )
    }

    rateLimitMap.set(key, attempts + 1)

    // Check if user already exists with this phone
    const existingUser = await prisma.user.findFirst({
      where: { phone: formattedPhone },
    })

    // Generate and save OTP
    const otp = generateOTP()
    await saveOTP(formattedPhone, otp)

    // Send OTP
    const sent = await sendOTP(formattedPhone, otp)

    if (!sent) {
      return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 })
    }

    return NextResponse.json({
      message: "OTP sent successfully",
      userExists: !!existingUser,
    })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 })
  }
}
