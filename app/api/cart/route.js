import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                image: true,
                stock: true,
                categories: true,
              },
            },
          },
          orderBy: {
            id: "desc", // Most recently added first
          },
        },
      },
    })

    if (!cart) {
      return NextResponse.json({
        items: [],
        total: 0,
        itemCount: 0,
      })
    }

    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

    // Format cart items
    const formattedItems = cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      product: item.product,
      subtotal: item.price * item.quantity,
    }))

    return NextResponse.json({
      items: formattedItems,
      total: Math.round(total * 100) / 100,
      itemCount,
      cartId: cart.id,
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch cart",
        message: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    if (quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 })
    }

    // Get product and check stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: `Only ${product.stock} items available in stock` }, { status: 400 })
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
        include: { items: true },
      })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    })

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity

      // Check stock for new quantity
      if (product.stock < newQuantity) {
        return NextResponse.json({ error: `Only ${product.stock} items available in stock` }, { status: 400 })
      }

      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          price: product.price, // Update price in case it changed
        },
      })
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
          price: product.price,
        },
      })
    }

    return NextResponse.json({
      message: "Item added to cart successfully",
      product: {
        name: product.name,
        quantity: quantity,
      },
    })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      {
        error: "Failed to add item to cart",
        message: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Clear all items from cart
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: user.id,
        },
      },
    })

    return NextResponse.json({ message: "Cart cleared successfully" })
  } catch (error) {
    console.error("Error clearing cart:", error)
    return NextResponse.json(
      {
        error: "Failed to clear cart",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
