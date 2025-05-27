import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const category = searchParams.get("category")
    const sort = searchParams.get("sort")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const minPrice = Number.parseFloat(searchParams.get("minPrice") || "0")
    const maxPrice = Number.parseFloat(searchParams.get("maxPrice") || "1000")
    const search = searchParams.get("search")

    // Build where clause
    const where = {
      AND: [
        { price: { gte: minPrice, lte: maxPrice } },
        featured === "true" ? { isFeatured: true } : {},
        category ? { categories: { has: category } } : {},
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
      ].filter((condition) => Object.keys(condition).length > 0),
    }

    // Build orderBy clause
    let orderBy = {}
    switch (sort) {
      case "price-low":
        orderBy = { price: "asc" }
        break
      case "price-high":
        orderBy = { price: "desc" }
        break
      case "rating":
        orderBy = { rating: "desc" }
        break
      case "name":
        orderBy = { name: "asc" }
        break
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      default:
        orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }]
    }

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    // Calculate average ratings and format response
    const productsWithRatings = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
          : product.rating || 0

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        images: product.images,
        stock: product.stock,
        category: product.category,
        categories: product.categories,
        isFeatured: product.isFeatured,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: product._count.reviews,
        createdAt: product.createdAt,
      }
    })

    // If featured=true, return just the products array for simplicity
    if (featured === "true") {
      return NextResponse.json(productsWithRatings)
    }

    // Return paginated products with metadata
    return NextResponse.json({
      products: productsWithRatings,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalProducts: totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("Error in products API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        message: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = ["name", "description", "price", "image", "stock", "category"]
    const missingFields = requiredFields.filter((field) => !data[field])

    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 })
    }

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json({ error: "A product with this name already exists" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: Number.parseFloat(data.price),
        originalPrice: data.originalPrice ? Number.parseFloat(data.originalPrice) : null,
        image: data.image,
        images: data.images || [data.image],
        stock: Number.parseInt(data.stock),
        category: data.category,
        categories: data.categories || [data.category],
        isFeatured: data.isFeatured || false,
        ingredients: data.ingredients || null,
        nutritionalInfo: data.nutritionalInfo || null,
        allergens: data.allergens || [],
        benefits: data.benefits || [],
        weight: data.weight || null,
        dimensions: data.dimensions || null,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      {
        error: "Failed to create product",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
