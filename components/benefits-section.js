"use client"

import { useEffect, useRef } from "react"
import { Box, Container, Typography, Grid, Paper } from "@mui/material"
import { IconLeaf, IconHeart, IconShield, IconRecycle, IconAward, IconUsers } from "@tabler/icons-react"
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
    gradient: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
  },
  {
    icon: IconHeart,
    title: "Made with Love",
    description: "Each batch is handcrafted using traditional methods passed down through generations.",
    color: "#d4a373",
    gradient: "linear-gradient(135deg, #d4a373 0%, #c49363 100%)",
  },
  {
    icon: IconShield,
    title: "Premium Quality",
    description: "Rigorous quality control ensures every biscuit meets our highest standards of excellence.",
    color: "#e76f51",
    gradient: "linear-gradient(135deg, #e76f51 0%, #d65a41 100%)",
  },
  {
    icon: IconRecycle,
    title: "Eco-Friendly",
    description: "Sustainable packaging made from recycled materials to protect our planet.",
    color: "#2a9d8f",
    gradient: "linear-gradient(135deg, #2a9d8f 0%, #238a7f 100%)",
  },
  {
    icon: IconAward,
    title: "Award Winning",
    description: "Recognized by culinary experts and loved by customers worldwide.",
    color: "#f4a261",
    gradient: "linear-gradient(135deg, #f4a261 0%, #e89251 100%)",
  },
  {
    icon: IconUsers,
    title: "Family Recipe",
    description: "Time-tested recipes that have brought families together for over 50 years.",
    color: "#264653",
    gradient: "linear-gradient(135deg, #264653 0%, #1e3a43 100%)",
  },
]

export default function BenefitsSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        // Title animation
        gsap.fromTo(
          titleRef.current,
          { y: 80, opacity: 0 },
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

        // Cards animation
        cardsRef.current.forEach((card, index) => {
          if (card) {
            gsap.fromTo(
              card,
              {
                y: 100,
                opacity: 0,
                scale: 0.8,
                rotationY: 15,
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                rotationY: 0,
                duration: 1,
                ease: "back.out(1.7)",
                delay: index * 0.15,
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                },
              },
            )

            // Hover animation
            const handleMouseEnter = () => {
              gsap.to(card, {
                y: -15,
                scale: 1.05,
                duration: 0.4,
                ease: "power2.out",
              })
            }

            const handleMouseLeave = () => {
              gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.4,
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
        py: { xs: 10, md: 15 },
        background: `
          linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%),
          radial-gradient(circle at 20% 80%, rgba(92, 141, 137, 0.08) 0%, transparent 50%)
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorations */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 163, 115, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(92, 141, 137, 0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <Container maxWidth="xl">
        <Box ref={titleRef} sx={{ textAlign: "center", mb: 10 }}>
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
            Why Choose Us
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 4,
              fontSize: { xs: "3rem", md: "4.5rem", lg: "5rem" },
              background: "linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #1a202c 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}
          >
            The Perfect
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
              Choice
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
            We're committed to delivering exceptional quality while caring for your health, our community, and our
            planet.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <Grid item xs={12} sm={6} lg={4} key={index}>
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
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: benefit.gradient,
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.4s ease",
                    },
                    "&:hover": {
                      borderColor: benefit.color,
                      boxShadow: `0 25px 50px ${benefit.color}20`,
                      "&::before": {
                        transform: "scaleX(1)",
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      background: `${benefit.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: -5,
                        borderRadius: "50%",
                        background: benefit.gradient,
                        opacity: 0.1,
                        filter: "blur(10px)",
                      },
                    }}
                  >
                    <IconComponent size={45} color={benefit.color} />
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: "#2d3748",
                      fontSize: "1.4rem",
                    }}
                  >
                    {benefit.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.7,
                      fontSize: "1rem",
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
