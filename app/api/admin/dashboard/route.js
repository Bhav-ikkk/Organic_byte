import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get the authentication cookie
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Parse the user data from the cookie
    const userData = JSON.parse(authToken.value)

    // Check if user is an admin
    if (!userData.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Get dashboard statistics
    const [totalSales, totalOrders, totalCustomers, lowStockProducts, recentOrders, topSellingProducts, salesData] =
      await Promise.all([
        // Total sales from all orders
        prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: { status: { not: "cancelled" } },
        }),

        // Total orders count
        prisma.order.count(),

        // Total customers count
        prisma.user.count({ where: { isAdmin: false } }),

        // Low stock products (less than 10)
        prisma.product.count({ where: { stock: { lt: 10 } } }),

        // Recent orders with user details
        prisma.order.findMany({
          take: 5,
          orderBy: { placedAt: "desc" },
          include: {
            user: { select: { name: true, email: true } },
            items: { include: { product: { select: { name: true } } } },
          },
        }),

        // Top selling products
        prisma.product.findMany({
          take: 4,
          orderBy: { reviewCount: "desc" },
          select: {
            id: true,
            name: true,
            price: true,
            orderItems: {
              select: { quantity: true, price: true },
            },
          },
        }),

        // Sales data for the last 7 days
        prisma.order.groupBy({
          by: ["placedAt"],
          _sum: { totalAmount: true },
          where: {
            placedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
            status: { not: "cancelled" },
          },
          orderBy: { placedAt: "asc" },
        }),
      ])

    // Process top selling products
    const processedTopProducts = topSellingProducts.map((product) => ({
      id: product.id,
      name: product.name,
      sales: product.orderItems.reduce((sum, item) => sum + item.quantity, 0),
      revenue: product.orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
    }))

    // Process sales data for chart
    const processedSalesData = salesData.map((item) => ({
      date: item.placedAt.toISOString().split("T")[0],
      amount: item._sum.totalAmount || 0,
    }))

    const dashboardData = {
      totalSales: totalSales._sum.totalAmount || 0,
      totalOrders: totalOrders,
      totalCustomers: totalCustomers,
      lowStockProducts: lowStockProducts,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customer: order.user.name,
        email: order.user.email,
        date: order.placedAt.toISOString(),
        total: order.totalAmount,
        status: order.status,
        itemCount: order.items.length,
      })),
      topSellingProducts: processedTopProducts,
      salesData: processedSalesData,
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
