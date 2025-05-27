"use client"

import { useState, useEffect, useRef } from "react"
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material"
import {
  IconShoppingCart,
  IconHeart,
  IconMinus,
  IconPlus,
  IconChevronDown,
  IconTruck,
  IconShield,
  IconRefresh,
} from "@tabler/icons-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useCart } from "@/contexts/cart-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { notFound } from "next/navigation"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Enhanced product data
const productData = {
  1: {
    id: "1",
    name: "Chocolate Chip Delight",
    description: "Rich organic chocolate chips in every bite, made with premium Belgian chocolate and organic flour",
    price: 4.99,
    originalPrice: 6.99,
    images: ["/images/chocolate-chip.png", "/images/vanilla-shortbread.png", "/images/almond-cookies.png"],
    rating: 4.8,
    reviewCount: 124,
    stock: 25,
    categories: ["chocolate", "bestseller"],
    featured: true,
    ingredients:
      "Organic flour, organic butter, organic sugar, Belgian chocolate chips, organic eggs, vanilla extract, sea salt",
    nutritionalInfo: {
      calories: 120,
      fat: "6g",
      carbs: "15g",
      protein: "2g",
      sugar: "8g",
      fiber: "1g",
    },
    allergens: ["Gluten", "Dairy", "Eggs"],
    benefits: ["Organic", "No Artificial Flavors", "Handcrafted"],
    weight: "200g",
    dimensions: "15cm x 10cm x 5cm",
  },
  2: {
    id: "2",
    name: "Vanilla Bean Dreams",
    description: "Pure Madagascar vanilla in buttery perfection, crafted with real vanilla beans",
    price: 3.99,
    originalPrice: 5.49,
    images: ["/images/vanilla-shortbread.png", "/images/chocolate-chip.png", "/images/almond-cookies.png"],
    rating: 4.5,
    reviewCount: 86,
    stock: 18,
    categories: ["vanilla", "classic"],
    featured: true,
    ingredients: "Organic flour, organic butter, organic sugar, Madagascar vanilla beans, organic eggs, sea salt",
    nutritionalInfo: {
      calories: 110,
      fat: "7g",
      carbs: "12g",
      protein: "1g",
      sugar: "5g",
      fiber: "0.5g",
    },
    allergens: ["Gluten", "Dairy", "Eggs"],
    benefits: ["Organic", "Real Vanilla Beans", "Traditional Recipe"],
    weight: "180g",
    dimensions: "15cm x 10cm x 4cm",
  },
  4: {
    id: "4",
    name: "Almond Crunch Heaven",
    description: "Roasted almonds with organic honey glaze, perfect for nut lovers",
    price: 5.99,
    originalPrice: 7.99,
    images: ["/images/almond-cookies.png", "/images/chocolate-chip.png", "/images/vanilla-shortbread.png"],
    rating: 4.7,
    reviewCount: 43,
    stock: 8,
    categories: ["nuts", "gluten-free"],
    featured: true,
    ingredients: "Almond flour, organic almonds, organic honey, organic coconut oil, vanilla extract, sea salt",
    nutritionalInfo: {
      calories: 150,
      fat: "12g",
      carbs: "10g",
      protein: "5g",
      sugar: "6g",
      fiber: "3g",
    },
    allergens: ["Tree Nuts"],
    benefits: ["Gluten-Free", "High Protein", "Natural Sweeteners"],
    weight: "220g",
    dimensions: "15cm x 10cm x 6cm",
  },
}

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment: "Absolutely delicious! The chocolate chips are perfectly distributed and the texture is amazing.",
    date: "2024-01-15",
    verified: true,
  },
  {
    id: 2,
    name: "Mike Chen",
    rating: 4,
    comment: "Great quality biscuits. My kids love them for their lunch boxes.",
    date: "2024-01-10",
    verified: true,
  },
  {
    id: 3,
    name: "Emma Wilson",
    rating: 5,
    comment: "Best organic biscuits I've ever tasted. Will definitely order again!",
    date: "2024-01-08",
    verified: false,
  },
]

export default function ProductDetailPage({ params }) {
  const product = productData[params.id]
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const { addToCart } = useCart()

  const pageRef = useRef(null)
  const imageRef = useRef(null)
  const detailsRef = useRef(null)
  const reviewsRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        // Page entrance animation
        gsap.fromTo(imageRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" })

        gsap.fromTo(
          detailsRef.current,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 },
        )

        gsap.fromTo(
          reviewsRef.current,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: reviewsRef.current,
              start: "top 80%",
            },
          },
        )
      }, pageRef)

      return () => ctx.revert()
    }
  }, [])

  if (!product) {
    notFound()
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setShowSnackbar(true)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    // Redirect to checkout
    window.location.href = "/checkout"
  }

  return (
    <Box ref={pageRef}>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #fefae0 0%, #f4f3ee 100%)",
          py: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={6}>
            {/* Product Images */}
            <Grid item xs={12} md={6}>
              <Box ref={imageRef}>
                {/* Main Image */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    mb: 3,
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <Box
                    component="img"
                    src={product.images[selectedImage]}
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: { xs: 300, md: 500 },
                      objectFit: "cover",
                      transition: "all 0.4s ease",
                    }}
                  />
                </Paper>

                {/* Thumbnail Images */}
                <Grid container spacing={2}>
                  {product.images.map((image, index) => (
                    <Grid item xs={4} key={index}>
                      <Paper
                        elevation={0}
                        onClick={() => setSelectedImage(index)}
                        sx={{
                          borderRadius: 2,
                          overflow: "hidden",
                          cursor: "pointer",
                          border: selectedImage === index ? "3px solid #5c8d89" : "1px solid rgba(0,0,0,0.08)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          sx={{
                            width: "100%",
                            height: 100,
                            objectFit: "cover",
                          }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            {/* Product Details */}
            <Grid item xs={12} md={6}>
              <Box ref={detailsRef}>
                {/* Product Title & Rating */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    {product.categories.map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        size="small"
                        sx={{
                          background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Box>

                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                      background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Rating value={product.rating} precision={0.1} readOnly />
                    <Typography variant="body1" color="text.secondary">
                      ({product.reviewCount} reviews)
                    </Typography>
                  </Box>

                  <Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {product.description}
                  </Typography>
                </Box>

                {/* Price */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: "#5c8d89",
                        fontSize: "2.5rem",
                      }}
                    >
                      ${product.price}
                    </Typography>
                    {product.originalPrice && (
                      <Typography
                        variant="h5"
                        sx={{
                          textDecoration: "line-through",
                          color: "text.secondary",
                          fontWeight: 500,
                        }}
                      >
                        ${product.originalPrice}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                    Save ${(product.originalPrice - product.price).toFixed(2)} (
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                  </Typography>
                </Box>

                {/* Stock Status */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Availability:</strong>
                    <Chip
                      label={product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      color={product.stock > 0 ? "success" : "error"}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  {product.stock <= 5 && product.stock > 0 && (
                    <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                      ⚡ Only {product.stock} left - order soon!
                    </Typography>
                  )}
                </Box>

                {/* Quantity Selector */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                    Quantity:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", border: "2px solid #e0e0e0", borderRadius: 2 }}>
                      <IconButton
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        sx={{ borderRadius: 0 }}
                      >
                        <IconMinus size={20} />
                      </IconButton>
                      <Typography
                        variant="h6"
                        sx={{
                          px: 3,
                          py: 1,
                          minWidth: 60,
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {quantity}
                      </Typography>
                      <IconButton
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        sx={{ borderRadius: 0 }}
                      >
                        <IconPlus size={20} />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Total: ${(product.price * quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<IconShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    sx={{
                      flex: 1,
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #4a7c7a 0%, #3a6b68 100%)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Add to Cart
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    sx={{
                      flex: 1,
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      borderRadius: 3,
                      borderWidth: 2,
                      color: "#5c8d89",
                      borderColor: "#5c8d89",
                      "&:hover": {
                        borderWidth: 2,
                        background: "#5c8d89",
                        color: "white",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Buy Now
                  </Button>

                  <IconButton
                    onClick={() => setIsLiked(!isLiked)}
                    sx={{
                      border: "2px solid #e0e0e0",
                      borderRadius: 3,
                      color: isLiked ? "#e76f51" : "#666",
                      "&:hover": {
                        borderColor: "#e76f51",
                        color: "#e76f51",
                      },
                    }}
                  >
                    <IconHeart size={24} fill={isLiked ? "currentColor" : "none"} />
                  </IconButton>
                </Box>

                {/* Features */}
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: "center", p: 2 }}>
                        <IconTruck size={32} color="#5c8d89" />
                        <Typography variant="caption" display="block" sx={{ mt: 1, fontWeight: 600 }}>
                          Free Shipping
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: "center", p: 2 }}>
                        <IconShield size={32} color="#5c8d89" />
                        <Typography variant="caption" display="block" sx={{ mt: 1, fontWeight: 600 }}>
                          Quality Guarantee
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: "center", p: 2 }}>
                        <IconRefresh size={32} color="#5c8d89" />
                        <Typography variant="caption" display="block" sx={{ mt: 1, fontWeight: 600 }}>
                          Easy Returns
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Product Details Accordion */}
                <Box>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<IconChevronDown />}>
                      <Typography variant="h6" fontWeight={600}>
                        Ingredients
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{product.ingredients}</Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<IconChevronDown />}>
                      <Typography variant="h6" fontWeight={600}>
                        Nutritional Information
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                          <Grid item xs={6} key={key}>
                            <Typography>
                              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<IconChevronDown />}>
                      <Typography variant="h6" fontWeight={600}>
                        Product Details
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ mb: 2 }}>
                        <strong>Weight:</strong> {product.weight}
                      </Typography>
                      <Typography sx={{ mb: 2 }}>
                        <strong>Dimensions:</strong> {product.dimensions}
                      </Typography>
                      <Typography sx={{ mb: 2 }}>
                        <strong>Allergens:</strong> {product.allergens.join(", ")}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {product.benefits.map((benefit) => (
                          <Chip key={benefit} label={benefit} size="small" color="primary" />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Reviews Section */}
          <Box ref={reviewsRef} sx={{ mt: 8 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
              Customer Reviews
            </Typography>

            <Grid container spacing={3}>
              {reviews.map((review) => (
                <Grid item xs={12} md={4} key={review.id}>
                  <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ mr: 2 }}>{review.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {review.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Rating value={review.rating} readOnly size="small" />
                          {review.verified && <Chip label="Verified" size="small" color="success" />}
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {review.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.date).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      <Footer />

      {/* Snackbar */}
      <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={() => setShowSnackbar(false)}>
        <Alert severity="success" onClose={() => setShowSnackbar(false)}>
          {product.name} added to cart!
        </Alert>
      </Snackbar>
    </Box>
  )
}
