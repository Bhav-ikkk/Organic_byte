import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function GET(request, { params }) {
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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        reviews: {
          include: { user: { select: { name: true, email: true } } },
        },
        orderItems: {
          include: { order: { select: { placedAt: true, status: true } } },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
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

    const body = await request.json()
    const {
      name,
      description,
      price,
      originalPrice,
      stock,
      category,
      categories,
      image,
      images,
      isFeatured,
      ingredients,
      nutritionalInfo,
      allergens,
      benefits,
      weight,
      dimensions,
    } = body

    // Update slug if name changed
    const slug = name
      ? name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      : undefined

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name, slug }),
        ...(description && { description }),
        ...(price && { price: Number.parseFloat(price) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice ? Number.parseFloat(originalPrice) : null }),
        ...(stock !== undefined && { stock: Number.parseInt(stock) }),
        ...(category && { category }),
        ...(categories && { categories }),
        ...(image && { image }),
        ...(images && { images }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(ingredients && { ingredients }),
        ...(nutritionalInfo && { nutritionalInfo }),
        ...(allergens && { allergens }),
        ...(benefits && { benefits }),
        ...(weight && { weight }),
        ...(dimensions && { dimensions }),
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
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

    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
