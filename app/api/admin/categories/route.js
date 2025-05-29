import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function GET() {
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

    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    })

    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await prisma.product.count({
          where: { category: category.slug },
        })
        return { ...category, productCount }
      }),
    )

    return NextResponse.json(categoriesWithCount)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request) {
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
    const { name, description, image } = body

    if (!name) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 })
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
