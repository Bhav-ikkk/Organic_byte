"use client"

import { useEffect, useRef } from "react"
import { Box, Container, Typography, Grid, Paper, Avatar, Rating } from "@mui/material"
import { IconQuote } from "@tabler/icons-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Health Enthusiast",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "These biscuits are absolutely divine! The perfect balance of taste and health. I can't imagine my morning tea without them.",
  },
  {
    name: "Michael Chen",
    role: "Food Blogger",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "As someone who reviews food for a living, I can confidently say these are the best organic biscuits I've ever tasted.",
  },
  {
    name: "Emma Williams",
    role: "Busy Mom",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Finally, a healthy snack my kids actually love! The quality is outstanding and the ingredients give me peace of mind.",
  },
]

export default function TestimonialsSection() {
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
                y: 80,
                opacity: 0,
                rotationY: 15,
              },
              {
                y: 0,
                opacity: 1,
                rotationY: 0,
                duration: 1,
                ease: "power3.out",
                delay: index * 0.2,
                scrollTrigger: {
                  trigger: card,
                  start: "top 80%",
                },
              },
            )
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
        background: "linear-gradient(180deg, #ffffff 0%, #fefae0 100%)",
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
            What Our Customers Say
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
            Don't just take our word for it. Here's what our happy customers have to say about our biscuits.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                ref={(el) => (cardsRef.current[index] = el)}
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 3,
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -10,
                    left: 20,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconQuote size={20} color="white" />
                </Box>

                <Box sx={{ mt: 2, mb: 3 }}>
                  <Rating value={testimonial.rating} readOnly size="small" />
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: "text.primary",
                    lineHeight: 1.7,
                    mb: 3,
                    fontStyle: "italic",
                  }}
                >
                  "{testimonial.text}"
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={testimonial.avatar} sx={{ width: 50, height: 50, mr: 2 }}>
                    {testimonial.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
