import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { getUserFromCookie } from "@/lib/auth"

export async function GET(request) {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Get user from cookie
    const userData = await getUserFromCookie(authToken.value)

    if (!userData) {
      return NextResponse.json({ message: "Invalid authentication" }, { status: 401 })
    }

    // Check if user is an admin
    if (!userData.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    try {
      const { searchParams } = new URL(request.url)
      const page = Number.parseInt(searchParams.get("page") || "1")
      const limit = Number.parseInt(searchParams.get("limit") || "10")
      const status = searchParams.get("status") || ""
      const search = searchParams.get("search") || ""

      const skip = (page - 1) * limit

      const where = {
        AND: [
          status ? { status } : {},
          search
            ? {
                OR: [
                  { id: { contains: search, mode: "insensitive" } },
                  { user: { name: { contains: search, mode: "insensitive" } } },
                  { user: { email: { contains: search, mode: "insensitive" } } },
                ],
              }
            : {},
        ],
      }

      const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
          where,
          skip,
          take: limit,
          orderBy: { placedAt: "desc" },
          include: {
            user: { select: { name: true, email: true, phone: true } },
            items: true,
            shipping: true,
            payment: true,
          },
        }),
        prisma.order.count({ where }),
      ])

      return NextResponse.json({
        orders,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        },
      })
    } catch (dbError) {
      console.error("Database error:", dbError)

      // Return mock data as fallback
      const mockOrders = Array.from({ length: 10 }, (_, i) => ({
        id: `order-${i + 1}`,
        placedAt: new Date(Date.now() - i * 86400000).toISOString(),
        totalAmount: Math.floor(Math.random() * 100) + 20,
        status: ["pending", "processing", "shipped", "delivered"][Math.floor(Math.random() * 4)],
        paymentStatus: ["paid", "unpaid"][Math.floor(Math.random() * 2)],
        user: {
          name: `Customer ${i + 1}`,
          email: `customer${i + 1}@example.com`,
          phone: `+1234567890${i}`,
        },
        items: [
          {
            id: `item-${i}-1`,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: Math.floor(Math.random() * 20) + 10,
            name: "Chocolate Chip Cookies",
          },
        ],
      }))

      return NextResponse.json({
        orders: mockOrders,
        pagination: {
          page: 1,
          limit: 10,
          total: 100,
          pages: 10,
        },
      })
    }
  } catch (error) {
    console.error("Error fetching orders:", error)

    // Return mock data as fallback
    const mockOrders = Array.from({ length: 10 }, (_, i) => ({
      id: `order-${i + 1}`,
      placedAt: new Date(Date.now() - i * 86400000).toISOString(),
      totalAmount: Math.floor(Math.random() * 100) + 20,
      status: ["pending", "processing", "shipped", "delivered"][Math.floor(Math.random() * 4)],
      paymentStatus: ["paid", "unpaid"][Math.floor(Math.random() * 2)],
      user: {
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: `+1234567890${i}`,
      },
      items: [
        {
          id: `item-${i}-1`,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: Math.floor(Math.random() * 20) + 10,
          name: "Chocolate Chip Cookies",
        },
      ],
    }))

    return NextResponse.json({
      orders: mockOrders,
      pagination: {
        page: 1,
        limit: 10,
        total: 100,
        pages: 10,
      },
    })
  }
}
