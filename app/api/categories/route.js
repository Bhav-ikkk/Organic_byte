import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            // We'll need to add a relation or calculate this differently
            // For now, we'll get all products and filter by category
          },
        },
      },
    })

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await prisma.product.count({
          where: {
            categories: {
              has: category.slug,
            },
          },
        })

        return {
          ...category,
          productCount,
        }
      }),
    )

    return NextResponse.json(categoriesWithCounts)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch categories",
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
    if (!data.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: slug }],
      },
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        image: data.image || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      {
        error: "Failed to create category",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
