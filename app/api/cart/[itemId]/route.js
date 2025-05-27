import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function PUT(request, { params }) {
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

    const itemId = params.itemId
    const { quantity } = await request.json()

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 })
    }

    // Find cart item and verify ownership
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId: user.id,
        },
      },
      include: {
        product: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    // Check stock
    if (cartItem.product.stock < quantity) {
      return NextResponse.json({ error: `Only ${cartItem.product.stock} items available in stock` }, { status: 400 })
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity,
        price: cartItem.product.price, // Update price in case it changed
      },
      include: {
        product: true,
      },
    })

    return NextResponse.json({
      message: "Cart item updated successfully",
      item: updatedItem,
    })
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json(
      {
        error: "Failed to update cart item",
        message: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request, { params }) {
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

    const itemId = params.itemId

    // Find cart item and verify ownership
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId: user.id,
        },
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({
      message: "Item removed from cart successfully",
      removedItem: cartItem.product.name,
    })
  } catch (error) {
    console.error("Error removing cart item:", error)
    return NextResponse.json(
      {
        error: "Failed to remove cart item",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
