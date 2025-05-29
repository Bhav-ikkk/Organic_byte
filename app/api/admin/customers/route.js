import { NextResponse } from "next/headers"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function GET(request) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const userData = JSON.parse(authToken.value)
    if (!userData.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit

    const where = {
      AND: [
        { isAdmin: false },
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    }

    const [customers, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          orders: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
              placedAt: true,
            },
          },
          reviews: {
            select: { id: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    // Process customer data
    const processedCustomers = customers.map((customer) => ({
      ...customer,
      totalOrders: customer.orders.length,
      totalSpent: customer.orders.reduce((sum, order) => sum + order.totalAmount, 0),
      lastOrderDate:
        customer.orders.length > 0
          ? customer.orders.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))[0].placedAt
          : null,
      reviewCount: customer.reviews.length,
    }))

    return NextResponse.json({
      customers: processedCustomers,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
