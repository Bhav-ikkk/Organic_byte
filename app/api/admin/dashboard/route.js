import { NextResponse } from "next/server"
import { cookies } from "next/headers"

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

    // Mock dashboard data
    const dashboardData = {
      totalSales: 12580,
      totalOrders: 156,
      totalCustomers: 89,
      lowStockProducts: 5,
      recentOrders: [
        {
          id: "1001",
          customer: "John Doe",
          date: "2023-05-15T10:30:00Z",
          total: 49.97,
          status: "delivered",
        },
        {
          id: "1002",
          customer: "Jane Smith",
          date: "2023-05-14T14:45:00Z",
          total: 35.98,
          status: "shipped",
        },
        {
          id: "1003",
          customer: "Bob Johnson",
          date: "2023-05-14T09:15:00Z",
          total: 29.99,
          status: "processing",
        },
        {
          id: "1004",
          customer: "Alice Brown",
          date: "2023-05-13T16:20:00Z",
          total: 74.95,
          status: "delivered",
        },
        {
          id: "1005",
          customer: "Charlie Wilson",
          date: "2023-05-13T11:10:00Z",
          total: 19.99,
          status: "cancelled",
        },
      ],
      salesData: [
        { date: "2023-05-09", amount: 1250 },
        { date: "2023-05-10", amount: 1800 },
        { date: "2023-05-11", amount: 1600 },
        { date: "2023-05-12", amount: 2100 },
        { date: "2023-05-13", amount: 1900 },
        { date: "2023-05-14", amount: 2300 },
        { date: "2023-05-15", amount: 2050 },
      ],
      topSellingProducts: [
        {
          id: "1",
          name: "Chocolate Chip Biscuits",
          sales: 245,
          revenue: 1223.55,
        },
        {
          id: "2",
          name: "Vanilla Shortbread",
          sales: 189,
          revenue: 754.11,
        },
        {
          id: "3",
          name: "Almond Butter Cookies",
          sales: 156,
          revenue: 934.44,
        },
        {
          id: "4",
          name: "Coconut Macaroons",
          sales: 134,
          revenue: 936.66,
        },
      ],
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
