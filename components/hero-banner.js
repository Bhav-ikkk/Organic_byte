"use client"

import { useEffect, useRef } from "react"
import { Box, Button, Container, Typography, Stack } from "@mui/material"
import { IconShoppingCart, IconHeart, IconLeaf, IconSparkles } from "@tabler/icons-react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HeroBanner() {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)
  const imageRef = useRef(null)
  const floatingElementsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], { opacity: 0, y: 100 })
      gsap.set(imageRef.current, { opacity: 0, scale: 0.8, rotation: -10 })
      gsap.set(floatingElementsRef.current, { opacity: 0, scale: 0 })

      // Main timeline
      const tl = gsap.timeline({ delay: 0.5 })

      // Hero content animation
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8",
        )
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.6",
        )
        .to(
          imageRef.current,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)",
          },
          "-=1.2",
        )

      // Floating elements
      floatingElementsRef.current.forEach((el, index) => {
        if (el) {
          gsap.to(el, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: 1.5 + index * 0.2,
            ease: "back.out(1.7)",
          })

          // Continuous floating animation
          gsap.to(el, {
            y: -20,
            rotation: 360,
            duration: 4 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: index * 0.3,
          })
        }
      })

      // Parallax effect on scroll
      gsap.to(imageRef.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
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
          radial-gradient(circle at 20% 80%, rgba(212, 163, 115, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(92, 141, 137, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #fefae0 0%, #f4f3ee 25%, #e9edc9 50%, #ccd5ae 75%, #a3b18a 100%)
        `,
        backgroundSize: "400% 400%",
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
          top: "15%",
          right: "8%",
          color: "#5c8d89",
          opacity: 0.6,
          zIndex: 1,
        }}
      >
        <IconLeaf size={80} />
      </Box>
      <Box
        ref={(el) => (floatingElementsRef.current[1] = el)}
        sx={{
          position: "absolute",
          top: "70%",
          left: "5%",
          color: "#d4a373",
          opacity: 0.4,
          zIndex: 1,
        }}
      >
        <IconSparkles size={60} />
      </Box>
      <Box
        ref={(el) => (floatingElementsRef.current[2] = el)}
        sx={{
          position: "absolute",
          top: "25%",
          left: "10%",
          color: "#e76f51",
          opacity: 0.3,
          zIndex: 1,
        }}
      >
        <IconHeart size={45} />
      </Box>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: { xs: 4, lg: 8 },
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          {/* Left Content */}
          <Box sx={{ order: { xs: 2, lg: 1 } }}>
            <Typography
              ref={titleRef}
              variant="h1"
              sx={{
                fontSize: { xs: "3.5rem", md: "5rem", lg: "6rem" },
                fontWeight: 900,
                lineHeight: 0.9,
                mb: 3,
                background: "linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #1a202c 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 4px 8px rgba(0,0,0,0.1)",
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
                Organic
              </Box>
              <br />
              Biscuits
            </Typography>

            <Typography
              ref={subtitleRef}
              variant="h5"
              sx={{
                color: "text.secondary",
                mb: 5,
                fontSize: { xs: "1.3rem", md: "1.6rem" },
                fontWeight: 400,
                lineHeight: 1.5,
                maxWidth: 500,
              }}
            >
              Handcrafted with premium organic ingredients. Every bite tells a story of tradition, quality, and pure
              indulgence.
            </Typography>

            <Stack
              ref={buttonRef}
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              sx={{ alignItems: { xs: "stretch", sm: "center" } }}
            >
              <Button
                component={Link}
                href="/products"
                variant="contained"
                size="large"
                startIcon={<IconShoppingCart size={24} />}
                sx={{
                  px: 5,
                  py: 2.5,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  borderRadius: 4,
                  background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                  boxShadow: "0 12px 40px rgba(92, 141, 137, 0.4)",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.02)",
                    boxShadow: "0 20px 60px rgba(92, 141, 137, 0.5)",
                  },
                }}
              >
                Explore Collection
              </Button>

              <Button
                component={Link}
                href="/about"
                variant="outlined"
                size="large"
                startIcon={<IconHeart size={24} />}
                sx={{
                  px: 5,
                  py: 2.5,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  borderRadius: 4,
                  borderWidth: 3,
                  color: "#5c8d89",
                  borderColor: "#5c8d89",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.02)",
                    backgroundColor: "#5c8d89",
                    color: "white",
                    boxShadow: "0 12px 40px rgba(92, 141, 137, 0.3)",
                  },
                }}
              >
                Our Story
              </Button>
            </Stack>
          </Box>

          {/* Right Content - Hero Image */}
          <Box
            sx={{
              order: { xs: 1, lg: 2 },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box
              ref={imageRef}
              sx={{
                width: { xs: 300, md: 400, lg: 500 },
                height: { xs: 300, md: 400, lg: 500 },
                borderRadius: "50%",
                background: `
                  radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%),
                  linear-gradient(135deg, #5c8d89 0%, #d4a373 100%)
                `,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxShadow: "0 30px 80px rgba(0,0,0,0.15)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: -20,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #5c8d89, #d4a373, #e76f51)",
                  opacity: 0.3,
                  filter: "blur(20px)",
                  zIndex: -1,
                },
              }}
            >
              <Box
                component="img"
                src="/images/hero-biscuit.png"
                alt="Organic Biscuits"
                sx={{
                  width: "80%",
                  height: "80%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.2))",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          animation: "bounce 2s infinite",
          "@keyframes bounce": {
            "0%, 20%, 50%, 80%, 100%": {
              transform: "translateX(-50%) translateY(0)",
            },
            "40%": {
              transform: "translateX(-50%) translateY(-15px)",
            },
            "60%": {
              transform: "translateX(-50%) translateY(-8px)",
            },
          },
        }}
      >
        <Box
          sx={{
            width: 3,
            height: 50,
            background: "linear-gradient(to bottom, transparent, #5c8d89, transparent)",
            borderRadius: 2,
          }}
        />
      </Box>
    </Box>
  )
}
