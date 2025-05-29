"use client"

import { useEffect, useRef } from "react"
import { Box, Container, Typography, Button, Grid } from "@mui/material"
import { IconShoppingCart, IconArrowRight } from "@tabler/icons-react"
import Link from "next/link"
import { gsap } from "gsap"
import { useTranslation } from "react-i18next"
import { useTheme } from "@/contexts/theme-context"

export default function HeroBanner() {
  const { t } = useTranslation()
  const { mode } = useTheme()
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline()

        tl.fromTo(titleRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" })
          .fromTo(
            subtitleRef.current,
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
            "-=0.8",
          )
          .fromTo(
            buttonRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
            "-=0.6",
          )
          .fromTo(
            imageRef.current,
            { x: 100, opacity: 0, scale: 0.8 },
            { x: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" },
            "-=1.2",
          )
      }, heroRef)

      return () => ctx.revert()
    }
  }, [])

  return (
    <Box
      ref={heroRef}
      sx={{
        minHeight: { xs: "80vh", md: "90vh" },
        display: "flex",
        alignItems: "center",
        background:
          mode === "light"
            ? "linear-gradient(135deg, #fefae0 0%, #f8f9fa 50%, #e9ecef 100%)"
            : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1e1e1e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorations */}
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            mode === "light"
              ? "radial-gradient(circle, rgba(92, 141, 137, 0.1) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(92, 141, 137, 0.2) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                ref={titleRef}
                variant="h1"
                sx={{
                  fontWeight: 900,
                  mb: 3,
                  fontSize: { xs: "3rem", md: "4.5rem", lg: "5.5rem" },
                  lineHeight: 1.1,
                  background:
                    mode === "light"
                      ? "linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #1a202c 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e0 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("organicBiscuits")}
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
                  {t("perfectChoice")}
                </Box>
              </Typography>

              <Typography
                ref={subtitleRef}
                variant="h5"
                sx={{
                  color: "text.secondary",
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: { xs: "1.2rem", md: "1.4rem" },
                  fontWeight: 400,
                }}
              >
                {t("handcraftedOrganic")}
              </Typography>

              <Box ref={buttonRef} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
                    boxShadow: "0 8px 25px rgba(92,141,137,0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #4a7c7a 0%, #3a6b68 100%)",
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 35px rgba(92,141,137,0.4)",
                    },
                  }}
                >
                  {t("shop")}
                </Button>

                <Button
                  component={Link}
                  href="/about"
                  variant="outlined"
                  size="large"
                  endIcon={<IconArrowRight />}
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  {t("about")}
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              ref={imageRef}
              sx={{
                position: "relative",
                textAlign: "center",
              }}
            >
              <Box
                component="img"
                src="/images/hero-biscuit.png"
                alt={t("organicBiscuits")}
                sx={{
                  width: "100%",
                  maxWidth: 500,
                  height: "auto",
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
