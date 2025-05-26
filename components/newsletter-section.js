"use client"

import { useState, useRef, useEffect } from "react"
import { Box, Container, Typography, TextField, Button, Stack } from "@mui/material"
import { IconMail, IconGift } from "@tabler/icons-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          contentRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 80%",
            },
          },
        )
      }, sectionRef)

      return () => ctx.revert()
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
        <Box ref={contentRef} sx={{ textAlign: "center" }}>
          <Box sx={{ mb: 3 }}>
            <IconGift size={60} />
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Get 15% Off Your First Order
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              lineHeight: 1.6,
            }}
          >
            Subscribe to our newsletter and be the first to know about new flavors, special offers, and healthy living
            tips.
          </Typography>

          {subscribed ? (
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                🎉 Welcome to the family!
              </Typography>
              <Typography>Check your email for your 15% discount code.</Typography>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 1,
                borderRadius: 3,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="stretch">
                <TextField
                  fullWidth
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                      borderRadius: 2,
                      "& fieldset": {
                        border: "none",
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<IconMail />}
                  sx={{
                    px: 4,
                    py: 2,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #d4a373 0%, #c49363 100%)",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    "&:hover": {
                      background: "linear-gradient(135deg, #c49363 0%, #b48653 100%)",
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Stack>
            </Box>
          )}

          <Typography
            variant="body2"
            sx={{
              mt: 3,
              opacity: 0.7,
            }}
          >
            No spam, unsubscribe at any time. We respect your privacy.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
