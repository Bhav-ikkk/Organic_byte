"use client"

import { useState, useEffect, useRef } from "react"
import { Box, Container, Typography, Grid, Pagination, TextField, InputAdornment, Button, Chip } from "@mui/material"
import { IconSearch, IconFilter, IconSortDescending } from "@tabler/icons-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Navbar from "@/components/navbar"
import ProductCardEnhanced from "@/components/product-card-enhanced"
import Footer from "@/components/footer"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Enhanced product data with real image paths
const allProducts = [
  {
    id: "1",
    name: "Chocolate Chip Delight",
    description: "Rich organic chocolate chips in every bite",
    price: 4.99,
    image: "/images/chocolate-chip.png",
    rating: 4.8,
    reviewCount: 124,
    stock: 25,
    categories: ["chocolate", "bestseller"],
    featured: true,
    color: "#8B4513",
  },
  {
    id: "2",
    name: "Vanilla Bean Dreams",
    description: "Pure Madagascar vanilla in buttery perfection",
    price: 3.99,
    image: "/images/vanilla-shortbread.png",
    rating: 4.5,
    reviewCount: 86,
    stock: 18,
    categories: ["vanilla", "classic"],
    featured: true,
    color: "#F5DEB3",
  },
  {
    id: "3",
    name: "Oatmeal Raisin Classic",
    description: "Hearty oatmeal cookies with organic raisins",
    price: 4.49,
    image: "/images/almond-cookies.png",
    rating: 4.3,
    reviewCount: 52,
    stock: 12,
    categories: ["fruit", "healthy"],
    featured: false,
    color: "#DEB887",
  },
  {
    id: "4",
    name: "Almond Crunch Heaven",
    description: "Roasted almonds with organic honey glaze",
    price: 5.99,
    image: "/images/almond-cookies.png",
    rating: 4.7,
    reviewCount: 43,
    stock: 8,
    categories: ["nuts", "gluten-free"],
    featured: true,
    color: "#DEB887",
  },
  {
    id: "5",
    name: "Lemon Zest Biscuits",
    description: "Refreshing lemon zest with organic citrus",
    price: 4.29,
    image: "/images/vanilla-shortbread.png",
    rating: 4.4,
    reviewCount: 38,
    stock: 15,
    categories: ["fruit", "citrus"],
    featured: false,
    color: "#F5DEB3",
  },
  {
    id: "6",
    name: "Coconut Macaroons",
    description: "Chewy coconut macaroons with natural sweetness",
    price: 6.99,
    image: "/images/chocolate-chip.png",
    rating: 4.9,
    reviewCount: 67,
    stock: 20,
    categories: ["gluten-free", "vegan"],
    featured: true,
    color: "#8B4513",
  },
]

const categories = [
  { id: "all", name: "All Products", color: "#5c8d89" },
  { id: "chocolate", name: "Chocolate", color: "#8B4513" },
  { id: "vanilla", name: "Vanilla", color: "#F5DEB3" },
  { id: "nuts", name: "Nuts & Seeds", color: "#DEB887" },
  { id: "fruit", name: "Fruit", color: "#e76f51" },
  { id: "gluten-free", name: "Gluten Free", color: "#2a9d8f" },
  { id: "vegan", name: "Vegan", color: "#264653" },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(allProducts)
  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6

  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const filtersRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        // Header animation
        gsap.fromTo(
          headerRef.current,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power4.out",
          },
        )

        // Filters animation
        gsap.fromTo(
          filtersRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.3,
          },
        )

        // Cards animation
        cardsRef.current.forEach((card, index) => {
          if (card) {
            gsap.fromTo(
              card,
              {
                y: 100,
                opacity: 0,
                scale: 0.9,
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.5 + index * 0.1,
              },
            )
          }
        })
      }, sectionRef)

      return () => ctx.revert()
    }
  }, [filteredProducts])

  useEffect(() => {
    let filtered = [...products]

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.categories.includes(selectedCategory))
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Featured first
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [products, selectedCategory, searchTerm, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)

    // Animate category change
    gsap.to(cardsRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      stagger: 0.05,
      onComplete: () => {
        gsap.to(cardsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        })
      },
    })
  }

  return (
    <Box>
      <Navbar />

      <Box
        ref={sectionRef}
        sx={{
          minHeight: "100vh",
          background: `
            linear-gradient(135deg, #fefae0 0%, #f4f3ee 50%, #e9edc9 100%),
            radial-gradient(circle at 80% 20%, rgba(92, 141, 137, 0.05) 0%, transparent 50%)
          `,
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
          {/* Header */}
          <Box ref={headerRef} sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                color: "#5c8d89",
                fontWeight: 700,
                letterSpacing: 3,
                fontSize: "1rem",
                mb: 2,
                display: "block",
              }}
            >
              Our Collection
            </Typography>

            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: "3rem", md: "4.5rem", lg: "5.5rem" },
                background: "linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #1a202c 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.1,
              }}
            >
              Premium
              <br />
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(135deg, #5c8d89 0%, #d4a373 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Biscuits
              </Box>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "text.secondary",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.6,
                fontSize: { xs: "1.2rem", md: "1.4rem" },
              }}
            >
              Discover our complete range of handcrafted organic biscuits, each one a masterpiece of flavor and quality.
            </Typography>
          </Box>

          {/* Filters */}
          <Box ref={filtersRef} sx={{ mb: 6 }}>
            {/* Search and Sort */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search biscuits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(10px)",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<IconSortDescending size={20} />}
                    onClick={() => setSortBy(sortBy === "price-low" ? "price-high" : "price-low")}
                    sx={{
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    Price
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<IconFilter size={20} />}
                    onClick={() => setSortBy("rating")}
                    sx={{
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    Rating
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* Category Filters */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  onClick={() => handleCategoryChange(category.id)}
                  variant={selectedCategory === category.id ? "filled" : "outlined"}
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    background:
                      selectedCategory === category.id
                        ? `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`
                        : "rgba(255,255,255,0.8)",
                    color: selectedCategory === category.id ? "white" : category.color,
                    borderColor: category.color,
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`,
                      color: "white",
                      transform: "translateY(-2px)",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Products Grid */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {currentProducts.map((product, index) => (
              <Grid item xs={12} sm={6} lg={4} key={product.id}>
                <Box ref={(el) => (cardsRef.current[index] = el)}>
                  <ProductCardEnhanced product={product} />
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                    fontWeight: 600,
                    "&.Mui-selected": {
                      background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h5" sx={{ mb: 2, color: "text.secondary" }}>
                No biscuits found
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
                Try adjusting your search or filter criteria
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
                sx={{
                  background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                  borderRadius: 3,
                  px: 4,
                  py: 2,
                }}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}
