"use client"

import { useState, useEffect, useRef } from "react"
import { Grid, Box, Typography, Container, Button, Card, CardMedia, CardContent, Rating, Chip } from "@mui/material"
import { IconArrowRight, IconStar, IconShoppingCart, IconHeart } from "@tabler/icons-react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useCart } from "@/contexts/cart-context"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Sample biscuit images with real paths
const sampleProducts = [
  {
    id: "1",
    name: "Chocolate Chip Delight",
    description: "Rich organic chocolate chips in every bite",
    price: 4.99,
    image: "/images/chocolate-chip.png",
    rating: 4.8,
    reviewCount: 124,
    stock: 25,
    featured: true,
    badge: "Bestseller",
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
    featured: true,
    badge: "Premium",
    color: "#F5DEB3",
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
    featured: true,
    badge: "Limited",
    color: "#DEB887",
  },
]

export default function FeaturedProducts() {
  const [products, setProducts] = useState(sampleProducts)
  const [loading, setLoading] = useState(false)
  const { addToCart } = useCart()
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        // Title animation
        gsap.fromTo(
          titleRef.current,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
            },
          },
        )

        // Cards stagger animation
        cardsRef.current.forEach((card, index) => {
          if (card) {
            gsap.fromTo(
              card,
              {
                y: 120,
                opacity: 0,
                scale: 0.8,
                rotationY: 15,
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                rotationY: 0,
                duration: 1.2,
                ease: "power4.out",
                delay: index * 0.2,
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                },
              },
            )
          }
        })
      }, sectionRef)

      return () => ctx.revert()
    }
  }, [])

  const handleAddToCart = (product, event) => {
    event.preventDefault()
    event.stopPropagation()
    addToCart(product)

    // Add to cart animation
    const button = event.currentTarget
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    })
  }

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 10, md: 15 },
        background: `
          linear-gradient(135deg, #ffffff 0%, #fefae0 50%, #f4f3ee 100%),
          radial-gradient(circle at 80% 20%, rgba(92, 141, 137, 0.05) 0%, transparent 50%)
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorations */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "-5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 163, 115, 0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <Container maxWidth="xl">
        <Box ref={titleRef} sx={{ textAlign: "center", mb: 10 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
            <IconStar size={28} style={{ color: "#d4a373", marginRight: 12 }} />
            <Typography
              variant="overline"
              sx={{
                color: "#5c8d89",
                fontWeight: 700,
                letterSpacing: 3,
                fontSize: "1rem",
              }}
            >
              Featured Collection
            </Typography>
            <IconStar size={28} style={{ color: "#d4a373", marginLeft: 12 }} />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 4,
              fontSize: { xs: "3rem", md: "4.5rem", lg: "5.5rem" },
              background: "linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #1a202c 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}
          >
            Taste the
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
              Extraordinary
            </Box>
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
              lineHeight: 1.6,
              fontSize: { xs: "1.2rem", md: "1.4rem" },
              fontWeight: 400,
            }}
          >
            Discover our handpicked selection of premium organic biscuits, each crafted with passion and the finest
            ingredients for an unforgettable culinary journey.
          </Typography>
        </Box>

        <Grid container spacing={5} sx={{ mb: 8 }}>
          {products.map((product, index) => (
            <Grid item xs={12} md={6} lg={4} key={product.id}>
              <Card
                ref={(el) => (cardsRef.current[index] = el)}
                component={Link}
                href={`/products/${product.id}`}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #ffffff 0%, #fefae0 100%)",
                  border: "1px solid rgba(92, 141, 137, 0.1)",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  cursor: "pointer",
                  textDecoration: "none",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-12px) scale(1.02)",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
                    "& .product-image": {
                      transform: "scale(1.1) rotate(2deg)",
                    },
                    "& .product-overlay": {
                      opacity: 1,
                    },
                  },
                }}
              >
                {/* Badge */}
                <Chip
                  label={product.badge}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    zIndex: 2,
                    background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />

                {/* Product Image */}
                <Box
                  sx={{
                    position: "relative",
                    height: 300,
                    overflow: "hidden",
                    background: `linear-gradient(135deg, ${product.color}20 0%, ${product.color}10 100%)`,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    className="product-image"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    }}
                  />

                  {/* Overlay */}
                  <Box
                    className="product-overlay"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "all 0.4s ease",
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<IconShoppingCart size={20} />}
                      onClick={(e) => handleAddToCart(product, e)}
                      sx={{
                        background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        transform: "translateY(20px)",
                        transition: "all 0.4s ease",
                        ".product-overlay:hover &": {
                          transform: "translateY(0)",
                        },
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: "#2d3748",
                      fontSize: "1.4rem",
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      mb: 2,
                      lineHeight: 1.6,
                    }}
                  >
                    {product.description}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Rating value={product.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.reviewCount})
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: "#5c8d89",
                        fontSize: "1.8rem",
                      }}
                    >
                      ${product.price}
                    </Typography>

                    <IconHeart
                      size={24}
                      style={{
                        color: "#d4a373",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center" }}>
          <Button
            component={Link}
            href="/products"
            variant="contained"
            size="large"
            endIcon={<IconArrowRight size={24} />}
            sx={{
              px: 6,
              py: 3,
              fontSize: "1.3rem",
              fontWeight: 700,
              borderRadius: 4,
              background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
              boxShadow: "0 12px 40px rgba(92, 141, 137, 0.4)",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              "&:hover": {
                transform: "translateY(-4px) scale(1.05)",
                boxShadow: "0 20px 60px rgba(92, 141, 137, 0.5)",
              },
            }}
          >
            Explore Full Collection
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
