import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFromToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request) {
  try {
    // Get auth token from cookies
    const cookieStore = cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get user from token
    const user = await getUserFromToken(authToken.value)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get user addresses
    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { isDefault: "desc" },
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error("Error fetching user addresses:", error)
    return NextResponse.json({ message: "Failed to fetch addresses" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Get auth token from cookies
    const cookieStore = cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get user from token
    const user = await getUserFromToken(authToken.value)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get address data
    const data = await request.json()

    // If this is the first address or marked as default, update all other addresses
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      })
    }

    // Create new address
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        name: data.name,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        isDefault: data.isDefault || false,
      },
    })

    return NextResponse.json(address)
  } catch (error) {
    console.error("Error creating address:", error)
    return NextResponse.json({ message: "Failed to create address" }, { status: 500 })
  }
}
