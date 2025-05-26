import { NextResponse } from "next/server"

// Mock data for products
const products = [
  {
    id: "1",
    name: "Chocolate Chip Biscuits",
    description: "Delicious organic chocolate chip biscuits made with the finest ingredients.",
    price: 4.99,
    stock: 25,
    image: "/placeholder.svg?height=300&width=300",
    categories: ["chocolate", "bestseller"],
    featured: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "2",
    name: "Vanilla Shortbread",
    description: "Classic organic vanilla shortbread that melts in your mouth.",
    price: 3.99,
    stock: 18,
    image: "/placeholder.svg?height=300&width=300",
    categories: ["vanilla"],
    featured: true,
    rating: 4.5,
    reviewCount: 86,
  },
  {
    id: "3",
    name: "Oatmeal Raisin Cookies",
    description: "Hearty oatmeal cookies with organic raisins and a hint of cinnamon.",
    price: 4.49,
    stock: 12,
    image: "/placeholder.svg?height=300&width=300",
    categories: ["fruit", "nuts"],
    featured: false,
    rating: 4.3,
    reviewCount: 52,
  },
  {
    id: "4",
    name: "Almond Butter Cookies",
    description: "Rich almond butter cookies made with organic almonds.",
    price: 5.99,
    stock: 8,
    image: "/placeholder.svg?height=300&width=300",
    categories: ["nuts", "gluten-free"],
    featured: true,
    rating: 4.7,
    reviewCount: 43,
  },
  {
    id: "5",
    name: "Lemon Zest Biscuits",
    description: "Refreshing lemon zest biscuits made with organic lemons.",
    price: 4.29,
    stock: 15,
    image: "/placeholder.svg?height=300&width=300",
    categories: ["fruit"],
    featured: false,
    rating: 4.4,
    reviewCount: 38,
  },
  {
    id: "6",
    name: "Coconut Macaroons",
    description: "Chewy coconut macaroons made with organic coconut flakes.",
    price: 6.99,
    stock: 20,
    image: "/placeholder.svg?height=300&width=300",
    categories: ["gluten-free", "vegan"],
    featured: true,
    rating: 4.9,
    reviewCount: 67,
  },
]

export async function GET(request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const category = searchParams.get("category")
    const sort = searchParams.get("sort")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const minPrice = Number.parseFloat(searchParams.get("minPrice") || "0")
    const maxPrice = Number.parseFloat(searchParams.get("maxPrice") || "1000")

    // Filter products
    let filteredProducts = [...products]

    if (featured === "true") {
      filteredProducts = filteredProducts.filter((product) => product.featured)
    }

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.categories && product.categories.includes(category),
      )
    }

    // Filter by price range
    filteredProducts = filteredProducts.filter((product) => product.price >= minPrice && product.price <= maxPrice)

    // Sort products
    if (sort) {
      switch (sort) {
        case "price-low":
          filteredProducts.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filteredProducts.sort((a, b) => b.price - a.price)
          break
        case "popular":
          filteredProducts.sort((a, b) => b.rating - a.rating)
          break
        case "newest":
        default:
          // Already sorted by newest (assuming id is sequential)
          break
      }
    }

    // Paginate
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    // If featured=true, return just the products array for simplicity
    if (featured === "true") {
      return NextResponse.json(paginatedProducts)
    }

    // Return paginated products with total pages
    return NextResponse.json({
      products: paginatedProducts,
      totalPages: Math.ceil(filteredProducts.length / limit),
      currentPage: page,
      totalProducts: filteredProducts.length,
    })
  } catch (error) {
    console.error("Error in products API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
