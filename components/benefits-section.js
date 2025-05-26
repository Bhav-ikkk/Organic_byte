"use client"

import { useEffect, useRef } from "react"
import { Box, Container, Typography, Grid, Paper } from "@mui/material"
import { IconLeaf, IconHeart, IconShield, IconRecycle } from "@tabler/icons-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const benefits = [
  {
    icon: IconLeaf,
    title: "100% Organic",
    description: "Certified organic ingredients sourced from trusted local farmers with no pesticides or GMOs.",
    color: "#5c8d89",
  },
  {
    icon: IconHeart,
    title: "Made with Love",
    description: "Each batch is handcrafted using traditional methods passed down through generations.",
    color: "#d4a373",
  },
  {
    icon: IconShield,
    title: "Premium Quality",
    description: "Rigorous quality control ensures every biscuit meets our highest standards of excellence.",
    color: "#e76f51",
  },
  {
    icon: IconRecycle,
    title: "Eco-Friendly",
    description: "Sustainable packaging made from recycled materials to protect our planet.",
    color: "#2a9d8f",
  },
]

export default function BenefitsSection() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        cardsRef.current.forEach((card, index) => {
          if (card) {
            gsap.fromTo(
              card,
              {
                y: 100,
                opacity: 0,
                scale: 0.8,
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.7)",
                delay: index * 0.2,
                scrollTrigger: {
                  trigger: card,
                  start: "top 80%",
                },
              },
            )

            // Hover animation
            const handleMouseEnter = () => {
              gsap.to(card, {
                y: -10,
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out",
              })
            }

            const handleMouseLeave = () => {
              gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
              })
            }

            card.addEventListener("mouseenter", handleMouseEnter)
            card.addEventListener("mouseleave", handleMouseLeave)

            return () => {
              card.removeEventListener("mouseenter", handleMouseEnter)
              card.removeEventListener("mouseleave", handleMouseLeave)
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
        py: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
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
            Why Choose Our Biscuits?
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
            We're committed to delivering exceptional quality while caring for your health and our planet.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  ref={(el) => (cardsRef.current[index] = el)}
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    textAlign: "center",
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    border: "1px solid",
                    borderColor: "grey.200",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: benefit.color,
                      boxShadow: `0 20px 40px ${benefit.color}20`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${benefit.color}20 0%, ${benefit.color}10 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                    }}
                  >
                    <IconComponent size={40} color={benefit.color} />
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: "text.primary",
                    }}
                  >
                    {benefit.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Box>
  )
}
