import { NextResponse } from "next/server"
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
    const range = searchParams.get("range") || "7days"

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    switch (range) {
      case "7days":
        startDate.setDate(now.getDate() - 7)
        break
      case "30days":
        startDate.setDate(now.getDate() - 30)
        break
      case "90days":
        startDate.setDate(now.getDate() - 90)
        break
      case "1year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Get report data
    const [totalRevenue, totalOrders, newCustomers, topProducts] = await Promise.all([
      // Total revenue
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          placedAt: { gte: startDate },
          status: { not: "cancelled" },
        },
      }),

      // Total orders
      prisma.order.count({
        where: {
          placedAt: { gte: startDate },
        },
      }),

      // New customers
      prisma.user.count({
        where: {
          createdAt: { gte: startDate },
          isAdmin: false,
        },
      }),

      // Top products
      prisma.product.findMany({
        take: 5,
        select: {
          name: true,
          orderItems: {
            where: {
              order: {
                placedAt: { gte: startDate },
                status: { not: "cancelled" },
              },
            },
            select: { quantity: true, price: true },
          },
        },
      }),
    ])

    // Process top products
    const processedTopProducts = topProducts
      .map((product) => ({
        name: product.name,
        sales: product.orderItems.reduce((sum, item) => sum + item.quantity, 0),
        revenue: product.orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
      }))
      .filter((product) => product.sales > 0)
      .sort((a, b) => b.revenue - a.revenue)

    const reportData = {
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalOrders,
      avgOrderValue: totalOrders > 0 ? (totalRevenue._sum.totalAmount || 0) / totalOrders : 0,
      newCustomers,
      topProducts: processedTopProducts,
      recentActivity: [
        {
          description: "New order #1234 placed",
          timestamp: new Date().toISOString(),
        },
        {
          description: "Product 'Chocolate Chip Biscuits' restocked",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          description: "Customer John Doe registered",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
      ],
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error("Error fetching report data:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
