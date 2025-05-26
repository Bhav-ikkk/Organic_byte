import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock orders data
const orders = []
let nextOrderId = 1

export async function GET(request) {
  try {
    // Get the authentication cookie
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Parse the user data from the cookie
    const userData = JSON.parse(authToken.value)

    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // Filter orders by user ID if provided
    let userOrders = orders
    if (userId) {
      // Only admins can view other users' orders
      if (userId !== userData.id && !userData.isAdmin) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
      }

      userOrders = orders.filter((order) => order.userId === userId)
    } else if (!userData.isAdmin) {
      // Non-admins can only see their own orders
      userOrders = orders.filter((order) => order.userId === userData.id)
    }

    return NextResponse.json(userOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Get the authentication cookie
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Parse the user data from the cookie
    const userData = JSON.parse(authToken.value)

    // Get order data from request
    const orderData = await request.json()

    // Create a new order
    const newOrder = {
      id: nextOrderId.toString(),
      userId: userData.id,
      items: orderData.items,
      shippingInfo: orderData.shippingInfo,
      paymentInfo: orderData.paymentInfo,
      total: orderData.total,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // Add the order to the mock database
    orders.push(newOrder)
    nextOrderId++

    return NextResponse.json(newOrder)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
