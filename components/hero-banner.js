"use client"

import { useEffect, useRef } from "react"
import { Box, Button, Container, Typography, Stack } from "@mui/material"
import { IconShoppingCart, IconHeart, IconLeaf } from "@tabler/icons-react"
import Link from "next/link"
import { gsap } from "gsap"

export default function HeroBanner() {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)
  const floatingElementsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main content animation
      const tl = gsap.timeline()

      tl.fromTo(titleRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" })
        .fromTo(
          subtitleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
          "-=0.8",
        )
        .fromTo(
          buttonRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6",
        )

      // Floating elements animation
      floatingElementsRef.current.forEach((el, index) => {
        if (el) {
          gsap.fromTo(
            el,
            { y: 0, rotation: 0 },
            {
              y: -20,
              rotation: 360,
              duration: 3 + index * 0.5,
              repeat: -1,
              yoyo: true,
              ease: "power2.inOut",
              delay: index * 0.3,
            },
          )
        }
      })

      // Background gradient animation
      gsap.to(heroRef.current, {
        backgroundPosition: "200% 50%",
        duration: 20,
        repeat: -1,
        ease: "none",
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <Box
      ref={heroRef}
      sx={{
        minHeight: "100vh",
        background: `
          linear-gradient(-45deg, #fefae0, #f4f3ee, #e9edc9, #ccd5ae),
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 183, 77, 0.1) 0%, transparent 50%)
        `,
        backgroundSize: "400% 400%, 100% 100%, 100% 100%",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating decorative elements */}
      <Box
        ref={(el) => (floatingElementsRef.current[0] = el)}
        sx={{
          position: "absolute",
          top: "20%",
          right: "10%",
          color: "primary.main",
          opacity: 0.3,
        }}
      >
        <IconLeaf size={60} />
      </Box>
      <Box
        ref={(el) => (floatingElementsRef.current[1] = el)}
        sx={{
          position: "absolute",
          top: "60%",
          left: "5%",
          color: "secondary.main",
          opacity: 0.3,
        }}
      >
        <IconHeart size={40} />
      </Box>
      <Box
        ref={(el) => (floatingElementsRef.current[2] = el)}
        sx={{
          position: "absolute",
          top: "30%",
          left: "15%",
          color: "primary.main",
          opacity: 0.2,
        }}
      >
        <IconLeaf size={30} />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ maxWidth: 800, mx: "auto", textAlign: "center" }}>
          <Typography
            ref={titleRef}
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", md: "4.5rem", lg: "5.5rem" },
              fontWeight: 800,
              background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
              mb: 3,
            }}
          >
            Handcrafted
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
              Organic Bliss
            </Box>
          </Typography>

          <Typography
            ref={subtitleRef}
            variant="h5"
            sx={{
              color: "text.secondary",
              mb: 4,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Experience the perfect harmony of taste and wellness with our artisanal organic biscuits.
            <br />
            Made with love, crafted for your health.
          </Typography>

          <Stack
            ref={buttonRef}
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              component={Link}
              href="/products"
              variant="contained"
              size="large"
              startIcon={<IconShoppingCart />}
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
              Shop Now
            </Button>

            <Button
              component={Link}
              href="/about"
              variant="outlined"
              size="large"
              startIcon={<IconHeart />}
              sx={{
                px: 4,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 3,
                borderWidth: 2,
                color: "primary.main",
                borderColor: "primary.main",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
            >
              Our Story
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          animation: "bounce 2s infinite",
          "@keyframes bounce": {
            "0%, 20%, 50%, 80%, 100%": {
              transform: "translateX(-50%) translateY(0)",
            },
            "40%": {
              transform: "translateX(-50%) translateY(-10px)",
            },
            "60%": {
              transform: "translateX(-50%) translateY(-5px)",
            },
          },
        }}
      >
        <Box
          sx={{
            width: 2,
            height: 40,
            background: "linear-gradient(to bottom, transparent, #5c8d89)",
            borderRadius: 1,
          }}
        />
      </Box>
    </Box>
  )
}
