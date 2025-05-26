"use client"

import { useState, useEffect, useRef } from "react"
import { Grid, Box, Typography, Container, Button } from "@mui/material"
import { IconArrowRight, IconStar } from "@tabler/icons-react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ProductCard from "./product-card"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products?featured=true&limit=6")
        if (!response.ok) {
          throw new Error("Failed to fetch featured products")
        }
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        console.error("Error fetching featured products:", err)
        setProducts([
          {
            id: "1",
            name: "Chocolate Chip Biscuits",
            description: "Delicious organic chocolate chip biscuits",
            price: 4.99,
            image: "/placeholder.svg?height=300&width=300",
            rating: 4.8,
            reviewCount: 124,
            stock: 25,
          },
          {
            id: "2",
            name: "Vanilla Shortbread",
            description: "Classic organic vanilla shortbread",
            price: 3.99,
            image: "/placeholder.svg?height=300&width=300",
            rating: 4.5,
            reviewCount: 86,
            stock: 18,
          },
          {
            id: "4",
            name: "Almond Butter Cookies",
            description: "Rich almond butter cookies made with organic almonds",
            price: 5.99,
            image: "/placeholder.svg?height=300&width=300",
            rating: 4.7,
            reviewCount: 43,
            stock: 8,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  useEffect(() => {
    if (!loading && typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        // Title animation
        gsap.fromTo(
          titleRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
            },
          },
        )

        // Cards animation
        cardsRef.current.forEach((card, index) => {
          if (card) {
            gsap.fromTo(
              card,
              { y: 80, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                delay: index * 0.1,
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
  }, [loading])

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #5c8d89",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          />
        </Box>
      </Container>
    )
  }

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(180deg, #fefae0 0%, #ffffff 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box ref={titleRef} sx={{ textAlign: "center", mb: 8 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <IconStar size={24} style={{ color: "#d4a373", marginRight: 8 }} />
            <Typography
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                letterSpacing: 2,
                fontSize: "0.9rem",
              }}
            >
              Featured Collection
            </Typography>
            <IconStar size={24} style={{ color: "#d4a373", marginLeft: 8 }} />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 3,
              background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Taste the Difference
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Discover our handpicked selection of premium organic biscuits, each crafted with the finest ingredients for
            an unforgettable experience.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {products.slice(0, 3).map((product, index) => (
            <Grid item key={product.id} xs={12} md={4} ref={(el) => (cardsRef.current[index] = el)}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center" }}>
          <Button
            component={Link}
            href="/products"
            variant="contained"
            size="large"
            endIcon={<IconArrowRight />}
            sx={{
              px: 4,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 3,
              background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
              boxShadow: "0 8px 32px rgba(92, 141, 137, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(92, 141, 137, 0.4)",
              },
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
