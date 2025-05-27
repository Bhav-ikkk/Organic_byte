import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request, { params }) {
  try {
    const productId = params.id

    // Try to find by ID first, then by slug
    let product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })

    // If not found by ID, try by slug
    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: productId },
        include: {
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      })
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Calculate average rating
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : product.rating || 0

    // Format reviews
    const formattedReviews = product.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      isVerified: review.isVerified,
      createdAt: review.createdAt,
      user: {
        name: review.user.name,
      },
    }))

    const productWithRating = {
      ...product,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: product._count.reviews,
      reviews: formattedReviews,
    }

    return NextResponse.json(productWithRating)
  } catch (error) {
    console.error("Error in product detail API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch product",
        message: error.message,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const productId = params.id
    const data = await request.json()

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Update slug if name changed
    const updateData = { ...data }
    if (data.name && data.name !== existingProduct.name) {
      const newSlug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      // Check if new slug already exists
      const slugExists = await prisma.product.findFirst({
        where: {
          slug: newSlug,
          id: { not: productId },
        },
      })

      if (slugExists) {
        return NextResponse.json({ error: "A product with this name already exists" }, { status: 400 })
      }

      updateData.slug = newSlug
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...updateData,
        price: data.price ? Number.parseFloat(data.price) : undefined,
        originalPrice: data.originalPrice ? Number.parseFloat(data.originalPrice) : undefined,
        stock: data.stock ? Number.parseInt(data.stock) : undefined,
        nutritionalInfo: data.nutritionalInfo || undefined,
        allergens: data.allergens || undefined,
        benefits: data.benefits || undefined,
        categories: data.categories || undefined,
        images: data.images || undefined,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      {
        error: "Failed to update product",
        message: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const productId = params.id

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete the product (cascade will handle related records)
    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({
      message: "Product deleted successfully",
      deletedProduct: existingProduct.name,
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      {
        error: "Failed to delete product",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
