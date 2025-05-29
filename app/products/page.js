"use client"

import { useState, useEffect, useRef } from "react"
import {
  Box,
  Container,
  Typography,
  Grid,
  Pagination,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Paper,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material"
import { IconSearch, IconX, IconAdjustments, IconChevronRight, IconHome } from "@tabler/icons-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Navbar from "@/components/navbar"
import ProductCardPremium from "@/components/product-card-premium"
import Footer from "@/components/footer"
import Link from "next/link"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Enhanced product data with more variety
const allProducts = [
  {
    id: "1",
    name: "Chocolate Chip Delight",
    description: "Rich organic chocolate chips in every bite, made with premium Belgian chocolate",
    price: 4.99,
    originalPrice: 6.99,
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
    description: "Pure Madagascar vanilla in buttery perfection with real vanilla beans",
    price: 3.99,
    originalPrice: 5.49,
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
    description: "Hearty oatmeal cookies with organic raisins and a hint of cinnamon",
    price: 4.49,
    originalPrice: 5.99,
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
    description: "Roasted almonds with organic honey glaze, perfect for nut lovers",
    price: 5.99,
    originalPrice: 7.99,
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
    description: "Refreshing lemon zest with organic citrus and a delicate crumb",
    price: 4.29,
    originalPrice: 5.79,
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
    description: "Chewy coconut macaroons with natural sweetness and tropical flavor",
    price: 6.99,
    originalPrice: 8.99,
    image: "/images/chocolate-chip.png",
    rating: 4.9,
    reviewCount: 67,
    stock: 20,
    categories: ["gluten-free", "vegan"],
    featured: true,
    color: "#8B4513",
  },
  {
    id: "7",
    name: "Double Chocolate Fudge",
    description: "Decadent double chocolate with fudge chunks for ultimate indulgence",
    price: 7.49,
    originalPrice: 9.99,
    image: "/images/chocolate-chip.png",
    rating: 4.6,
    reviewCount: 91,
    stock: 14,
    categories: ["chocolate", "premium"],
    featured: false,
    color: "#8B4513",
  },
  {
    id: "8",
    name: "Honey Wheat Crackers",
    description: "Wholesome wheat crackers with organic honey and sea salt",
    price: 3.49,
    originalPrice: 4.99,
    image: "/images/vanilla-shortbread.png",
    rating: 4.2,
    reviewCount: 29,
    stock: 22,
    categories: ["healthy", "savory"],
    featured: false,
    color: "#DEB887",
  },
]

const categories = [
  { id: "all", name: "All Products", color: "#5c8d89", count: allProducts.length },
  {
    id: "chocolate",
    name: "Chocolate",
    color: "#8B4513",
    count: allProducts.filter((p) => p.categories.includes("chocolate")).length,
  },
  {
    id: "vanilla",
    name: "Vanilla",
    color: "#F5DEB3",
    count: allProducts.filter((p) => p.categories.includes("vanilla")).length,
  },
  {
    id: "nuts",
    name: "Nuts & Seeds",
    color: "#DEB887",
    count: allProducts.filter((p) => p.categories.includes("nuts")).length,
  },
  {
    id: "fruit",
    name: "Fruit",
    color: "#e76f51",
    count: allProducts.filter((p) => p.categories.includes("fruit")).length,
  },
  {
    id: "gluten-free",
    name: "Gluten Free",
    color: "#2a9d8f",
    count: allProducts.filter((p) => p.categories.includes("gluten-free")).length,
  },
  {
    id: "vegan",
    name: "Vegan",
    color: "#264653",
    count: allProducts.filter((p) => p.categories.includes("vegan")).length,
  },
  {
    id: "healthy",
    name: "Healthy",
    color: "#6a994e",
    count: allProducts.filter((p) => p.categories.includes("healthy")).length,
  },
]

const sortOptions = [
  { value: "featured", label: "Featured First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "name", label: "Name A-Z" },
  { value: "newest", label: "Newest First" },
]

export default function ProductsPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [products, setProducts] = useState(allProducts)
  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 10])
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const productsPerPage = 12

  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const filtersRef = useRef(null)
  const cardsRef = useRef([])
  const statsRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        // Header animation with stagger
        gsap.fromTo(
          headerRef.current?.children || [],
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.2,
          },
        )

        // Filters slide in
        gsap.fromTo(
          filtersRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.4,
          },
        )

        // Stats counter animation
        if (statsRef.current) {
          gsap.fromTo(
            statsRef.current,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              delay: 0.6,
            },
          )
        }

        // Cards entrance with stagger
        cardsRef.current.forEach((card, index) => {
          if (card) {
            gsap.fromTo(
              card,
              {
                y: 120,
                opacity: 0,
                scale: 0.8,
                rotation: Math.random() * 10 - 5,
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 1,
                ease: "power3.out",
                delay: 0.8 + (index % 4) * 0.1,
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
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by price range
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

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
      case "newest":
        filtered.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id))
        break
      default:
        // Featured first
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [products, selectedCategory, searchTerm, sortBy, priceRange])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setMobileFiltersOpen(false)

    // Animate category change
    gsap.to(cardsRef.current, {
      opacity: 0,
      y: 30,
      scale: 0.95,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(cardsRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        })
      },
    })
  }

  const FilterContent = () => (
    <Box sx={{ p: isMobile ? 3 : 0 }}>
      {/* Price Range Filter */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(145deg, #ffffff 0%, #fefefe 100%)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#2d3748" }}>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={(e, newValue) => setPriceRange(newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={10}
          step={0.5}
          marks={[
            { value: 0, label: "$0" },
            { value: 5, label: "$5" },
            { value: 10, label: "$10+" },
          ]}
          sx={{
            color: "#5c8d89",
            "& .MuiSlider-thumb": {
              background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
              boxShadow: "0 4px 12px rgba(92,141,137,0.3)",
            },
            "& .MuiSlider-track": {
              background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            ${priceRange[0]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${priceRange[1]}+
          </Typography>
        </Box>
      </Paper>

      {/* Category Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(145deg, #ffffff 0%, #fefefe 100%)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#2d3748" }}>
          Categories
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span>{category.name}</span>
                  <span style={{ opacity: 0.7, fontSize: "0.8rem" }}>({category.count})</span>
                </Box>
              }
              onClick={() => handleCategoryChange(category.id)}
              variant={selectedCategory === category.id ? "filled" : "outlined"}
              sx={{
                justifyContent: "flex-start",
                height: "44px",
                fontSize: "0.9rem",
                fontWeight: 600,
                borderRadius: 2,
                background:
                  selectedCategory === category.id
                    ? `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`
                    : "transparent",
                color: selectedCategory === category.id ? "white" : category.color,
                borderColor: category.color,
                transition: "all 0.3s ease",
                "&:hover": {
                  background:
                    selectedCategory === category.id
                      ? `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`
                      : `${category.color}10`,
                  transform: "translateX(4px)",
                },
                "& .MuiChip-label": {
                  width: "100%",
                  display: "flex",
                },
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  )

  return (
    <Box>
      <Navbar />

      <Box
        ref={sectionRef}
        sx={{
          minHeight: "100vh",
          background: `
            linear-gradient(135deg, #fefae0 0%, #f4f3ee 30%, #e9edc9 70%, #d4edda 100%),
            radial-gradient(circle at 20% 80%, rgba(92, 141, 137, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212, 163, 115, 0.08) 0%, transparent 50%)
          `,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background: `
              radial-gradient(circle at 25% 25%, rgba(92, 141, 137, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(212, 163, 115, 0.03) 0%, transparent 50%)
            `,
            zIndex: 0,
          }}
        />

        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 }, position: "relative", zIndex: 1 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs separator={<IconChevronRight size={16} />} sx={{ mb: 4, opacity: 0.8 }}>
            <MuiLink
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#5c8d89",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <IconHome size={16} />
              Home
            </MuiLink>
            <Typography color="text.primary" fontWeight={600}>
              Products
            </Typography>
          </Breadcrumbs>

          {/* Header */}
          <Box ref={headerRef} sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                color: "#5c8d89",
                fontWeight: 700,
                letterSpacing: 4,
                fontSize: "1.1rem",
                mb: 2,
                display: "block",
              }}
            >
              Premium Collection
            </Typography>

            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: "3.5rem", md: "5rem", lg: "6rem" },
                background: "linear-gradient(135deg, #2d3748 0%, #4a5568 30%, #1a202c 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1,
                textShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              Artisan
              <br />
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(135deg, #5c8d89 0%, #d4a373 50%, #e76f51 100%)",
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
                maxWidth: 700,
                mx: "auto",
                lineHeight: 1.6,
                fontSize: { xs: "1.3rem", md: "1.5rem" },
                fontWeight: 400,
              }}
            >
              Handcrafted with love, baked to perfection. Discover our complete range of organic, artisanal biscuits
              that bring joy to every moment.
            </Typography>
          </Box>

          {/* Search and Sort Controls */}
          <Box ref={filtersRef} sx={{ mb: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search for your favorite biscuits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconSearch size={22} color="#5c8d89" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        background: "rgba(255,255,255,0.8)",
                        fontSize: "1.1rem",
                        "& fieldset": {
                          borderColor: "rgba(92,141,137,0.2)",
                        },
                        "&:hover fieldset": {
                          borderColor: "#5c8d89",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#5c8d89",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                      sx={{
                        borderRadius: 3,
                        background: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<IconAdjustments size={20} />}
                    onClick={() => setMobileFiltersOpen(true)}
                    sx={{
                      height: "56px",
                      borderRadius: 3,
                      borderColor: "#5c8d89",
                      color: "#5c8d89",
                      background: "rgba(255,255,255,0.8)",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#4a7c7a",
                        background: "rgba(92,141,137,0.1)",
                      },
                    }}
                  >
                    {isMobile ? "Filters" : "Advanced"}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Results Stats */}
          <Box ref={statsRef} sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                display: "inline-block",
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600, color: "#2d3748" }}>
                Showing {currentProducts.length} of {filteredProducts.length} products
                {selectedCategory !== "all" && (
                  <Chip
                    label={categories.find((c) => c.id === selectedCategory)?.name}
                    size="small"
                    onDelete={() => setSelectedCategory("all")}
                    sx={{ ml: 1, background: "#5c8d89", color: "white" }}
                  />
                )}
              </Typography>
            </Paper>
          </Box>

          <Grid container spacing={4}>
            {/* Sidebar Filters - Desktop */}
            {!isMobile && (
              <Grid item md={3}>
                <Box sx={{ position: "sticky", top: 100 }}>
                  <FilterContent />
                </Box>
              </Grid>
            )}

            {/* Products Grid */}
            <Grid item xs={12} md={isMobile ? 12 : 9}>
              <Grid container spacing={4}>
                {currentProducts.map((product, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={product.id}>
                    <Box ref={(el) => (cardsRef.current[index] = el)}>
                      <ProductCardPremium product={product} />
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
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
                          fontSize: "1rem",
                          "&.Mui-selected": {
                            background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                            color: "white",
                            boxShadow: "0 4px 12px rgba(92,141,137,0.3)",
                          },
                        },
                      }}
                    />
                  </Paper>
                </Box>
              )}

              {/* No Results */}
              {filteredProducts.length === 0 && (
                <Box sx={{ textAlign: "center", py: 12 }}>
                  <Typography variant="h4" sx={{ mb: 2, color: "text.secondary", fontWeight: 700 }}>
                    No biscuits found
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
                    Try adjusting your search or filter criteria
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                      setPriceRange([0, 10])
                    }}
                    sx={{
                      background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                      borderRadius: 3,
                      px: 6,
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      boxShadow: "0 8px 25px rgba(92,141,137,0.3)",
                    }}
                  >
                    Clear All Filters
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>

        {/* Mobile Filters Drawer */}
        <Drawer
          anchor="right"
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          PaperProps={{
            sx: {
              width: "90%",
              maxWidth: 400,
              background: "linear-gradient(145deg, #fefae0 0%, #f4f3ee 100%)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 3,
              borderBottom: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Filter Products
            </Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <IconX />
            </IconButton>
          </Box>
          <FilterContent />
        </Drawer>
      </Box>

      <Footer />
    </Box>
  )
}
