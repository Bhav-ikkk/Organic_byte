import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { getUserFromCookie } from "@/lib/auth"

export async function GET(request) {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Get user from cookie
    const userData = await getUserFromCookie(authToken.value)

    if (!userData) {
      return NextResponse.json({ message: "Invalid authentication" }, { status: 401 })
    }

    // Check if user is an admin
    if (!userData.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    try {
      const { searchParams } = new URL(request.url)
      const page = Number.parseInt(searchParams.get("page") || "1")
      const limit = Number.parseInt(searchParams.get("limit") || "10")
      const category = searchParams.get("category") || ""
      const search = searchParams.get("search") || ""

      const skip = (page - 1) * limit

      const where = {
        AND: [
          category ? { categoryId: category } : {},
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      }

      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            category: true,
          },
        }),
        prisma.product.count({ where }),
      ])

      return NextResponse.json({
        products,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        },
      })
    } catch (dbError) {
      console.error("Database error:", dbError)

      // Return mock data as fallback
      const mockProducts = Array.from({ length: 10 }, (_, i) => ({
        id: `product-${i + 1}`,
        name: `Organic Biscuit ${i + 1}`,
        description: `Delicious organic biscuit variety ${i + 1}`,
        price: Math.floor(Math.random() * 20) + 5,
        stock: Math.floor(Math.random() * 100) + 10,
        image: `/images/product-${(i % 3) + 1}.jpg`,
        featured: i < 3,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        category: {
          id: `category-${(i % 3) + 1}`,
          name: ["Chocolate", "Vanilla", "Fruit"][i % 3],
        },
      }))

      return NextResponse.json({
        products: mockProducts,
        pagination: {
          page: 1,
          limit: 10,
          total: 30,
          pages: 3,
        },
      })
    }
  } catch (error) {
    console.error("Error fetching products:", error)

    // Return mock data as fallback
    const mockProducts = Array.from({ length: 10 }, (_, i) => ({
      id: `product-${i + 1}`,
      name: `Organic Biscuit ${i + 1}`,
      description: `Delicious organic biscuit variety ${i + 1}`,
      price: Math.floor(Math.random() * 20) + 5,
      stock: Math.floor(Math.random() * 100) + 10,
      image: `/images/product-${(i % 3) + 1}.jpg`,
      featured: i < 3,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      category: {
        id: `category-${(i % 3) + 1}`,
        name: ["Chocolate", "Vanilla", "Fruit"][i % 3],
      },
    }))

    return NextResponse.json({
      products: mockProducts,
      pagination: {
        page: 1,
        limit: 10,
        total: 30,
        pages: 3,
      },
    })
  }
}

export async function POST(request) {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Get user from cookie
    const userData = await getUserFromCookie(authToken.value)

    if (!userData) {
      return NextResponse.json({ message: "Invalid authentication" }, { status: 401 })
    }

    // Check if user is an admin
    if (!userData.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()

    // Validate required fields
    const requiredFields = ["name", "price", "description", "categoryId"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ message: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    try {
      const product = await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: Number.parseFloat(data.price),
          stock: Number.parseInt(data.stock || 0),
          image: data.image || "/placeholder.svg?height=300&width=300",
          featured: data.featured || false,
          categoryId: data.categoryId,
        },
      })

      return NextResponse.json(product, { status: 201 })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ message: "Failed to create product" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
