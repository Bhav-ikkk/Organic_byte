import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function DELETE(request, { params }) {
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

    const productId = params.id

    // In a real application, you would delete the product from the database
    // For now, we'll just return a success response
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
