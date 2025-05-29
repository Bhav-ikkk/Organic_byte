"use client"

import { useEffect, useRef } from "react"
import { Box, Container, Typography, Grid, Paper } from "@mui/material"
import { IconLeaf, IconHeart, IconShield, IconRecycle, IconAward, IconUsers } from "@tabler/icons-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTranslation } from "react-i18next"
import { useTheme } from "@/contexts/theme-context"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function BenefitsSection() {
  const { t } = useTranslation()
  const { mode } = useTheme()
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])

  const benefits = [
    {
      icon: IconLeaf,
      title: t("organicIngredients"),
      description: t("organicDesc"),
      color: "#5c8d89",
      gradient: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
    },
    {
      icon: IconHeart,
      title: t("madeWithLove"),
      description: t("loveDesc"),
      color: "#d4a373",
      gradient: "linear-gradient(135deg, #d4a373 0%, #c49363 100%)",
    },
    {
      icon: IconShield,
      title: t("premiumQuality"),
      description: t("qualityDesc"),
      color: "#e76f51",
      gradient: "linear-gradient(135deg, #e76f51 0%, #d65a41 100%)",
    },
    {
      icon: IconRecycle,
      title: t("ecoFriendly"),
      description: t("ecoDesc"),
      color: "#2a9d8f",
      gradient: "linear-gradient(135deg, #2a9d8f 0%, #238a7f 100%)",
    },
    {
      icon: IconAward,
      title: t("awardWinning"),
      description: t("awardDesc"),
      color: "#f4a261",
      gradient: "linear-gradient(135deg, #f4a261 0%, #e89251 100%)",
    },
    {
      icon: IconUsers,
      title: t("familyRecipe"),
      description: t("familyDesc"),
      color: "#264653",
      gradient: "linear-gradient(135deg, #264653 0%, #1e3a43 100%)",
    },
  ]

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
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
        background:
          mode === "light"
            ? `linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)`
            : `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1e1e1e 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl">
        <Box ref={titleRef} sx={{ textAlign: "center", mb: 10 }}>
          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              letterSpacing: 3,
              fontSize: "1rem",
              mb: 2,
              display: "block",
            }}
          >
            {t("whyChooseUs")}
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 4,
              fontSize: { xs: "3rem", md: "4.5rem", lg: "5rem" },
              background:
                mode === "light"
                  ? "linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #1a202c 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e0 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}
          >
            {t("perfectChoice")}
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
            {t("qualityCommitment")}
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
                    background:
                      mode === "light"
                        ? "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
                        : "linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%)",
                    border: "1px solid",
                    borderColor: mode === "light" ? "grey.200" : "grey.700",
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
                      transform: "translateY(-10px)",
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
                      color: "text.primary",
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
