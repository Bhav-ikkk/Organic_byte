"use client"

import { useEffect, useRef } from "react"
import { Box, Container, Typography, Grid, Button } from "@mui/material"
import { IconArrowRight, IconLeaf, IconHeart, IconAward } from "@tabler/icons-react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const showcaseProducts = [
  {
    id: 1,
    name: "Signature Collection",
    description: "Our most beloved recipes, perfected over generations",
    image: "/placeholder.svg?height=500&width=500",
    color: "#5c8d89",
    icon: IconAward,
  },
  {
    id: 2,
    name: "Seasonal Specials",
    description: "Limited edition flavors inspired by nature's bounty",
    image: "/placeholder.svg?height=500&width=500",
    color: "#d4a373",
    icon: IconLeaf,
  },
  {
    id: 3,
    name: "Wellness Range",
    description: "Nutritious options without compromising on taste",
    image: "/placeholder.svg?height=500&width=500",
    color: "#e76f51",
    icon: IconHeart,
  },
]

export default function ProductShowcase() {
  const sectionRef = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        itemsRef.current.forEach((item, index) => {
          if (item) {
            const isEven = index % 2 === 0

            gsap.fromTo(
              item,
              {
                x: isEven ? -100 : 100,
                opacity: 0,
                scale: 0.9,
              },
              {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: item,
                  start: "top 80%",
                  end: "bottom 20%",
                },
              },
            )

            // Parallax effect for images
            const image = item.querySelector(".showcase-image")
            if (image) {
              gsap.to(image, {
                yPercent: -30,
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              })
            }
          }
        })
      }, sectionRef)

      return () => ctx.revert()
    }
  }, [])

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 10, md: 15 },
        background: "linear-gradient(180deg, #f4f3ee 0%, #e9edc9 100%)",
      }}
    >
      <Container maxWidth="xl">
        {showcaseProducts.map((product, index) => {
          const isEven = index % 2 === 0
          const IconComponent = product.icon

          return (
            <Box
              key={product.id}
              ref={(el) => (itemsRef.current[index] = el)}
              sx={{
                mb: { xs: 8, md: 15 },
                "&:last-child": { mb: 0 },
              }}
            >
              <Grid
                container
                spacing={{ xs: 4, md: 8 }}
                alignItems="center"
                direction={{ xs: "column", md: isEven ? "row" : "row-reverse" }}
              >
                {/* Content */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ maxWidth: 500, mx: { xs: "auto", md: isEven ? 0 : "auto" } }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 3,
                        color: product.color,
                      }}
                    >
                      <IconComponent size={32} />
                      <Typography
                        variant="overline"
                        sx={{
                          ml: 2,
                          fontWeight: 700,
                          letterSpacing: 2,
                          fontSize: "1rem",
                        }}
                      >
                        Premium Quality
                      </Typography>
                    </Box>

                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 900,
                        mb: 3,
                        fontSize: { xs: "2.5rem", md: "3.5rem" },
                        background: `linear-gradient(135deg, ${product.color} 0%, #2d3748 100%)`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        lineHeight: 1.2,
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.secondary",
                        mb: 4,
                        lineHeight: 1.6,
                        fontSize: "1.3rem",
                      }}
                    >
                      {product.description}
                    </Typography>

                    <Button
                      component={Link}
                      href="/products"
                      variant="contained"
                      size="large"
                      endIcon={<IconArrowRight size={24} />}
                      sx={{
                        px: 4,
                        py: 2,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${product.color} 0%, ${product.color}dd 100%)`,
                        boxShadow: `0 8px 32px ${product.color}40`,
                        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        "&:hover": {
                          transform: "translateY(-3px) scale(1.02)",
                          boxShadow: `0 15px 45px ${product.color}50`,
                        },
                      }}
                    >
                      Discover More
                    </Button>
                  </Box>
                </Grid>

                {/* Image */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      position: "relative",
                      height: { xs: 300, md: 500 },
                      borderRadius: 4,
                      overflow: "hidden",
                      background: `linear-gradient(135deg, ${product.color}20 0%, ${product.color}10 100%)`,
                      boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      className="showcase-image"
                      sx={{
                        width: "100%",
                        height: "120%",
                        objectFit: "cover",
                        transition: "all 0.6s ease",
                      }}
                    />

                    {/* Overlay gradient */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(135deg, ${product.color}30 0%, transparent 50%)`,
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )
        })}
      </Container>
    </Box>
  )
}
