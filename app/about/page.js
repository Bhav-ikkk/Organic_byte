"use client"

import { useEffect, useRef } from "react"
import { Box, Container, Typography, Grid, Paper, Avatar } from "@mui/material"
import { IconLeaf, IconHeart, IconAward, IconUsers } from "@tabler/icons-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & Head Baker",
    image: "/placeholder.svg?height=200&width=200",
    bio: "With 20 years of baking experience, Sarah founded our company with a vision to create the world's finest organic biscuits.",
  },
  {
    name: "Michael Chen",
    role: "Master Chocolatier",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Michael brings his expertise in chocolate crafting to create our signature chocolate chip varieties.",
  },
  {
    name: "Emma Wilson",
    role: "Quality Assurance",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Emma ensures every batch meets our rigorous quality standards and organic certification requirements.",
  },
]

const milestones = [
  { year: "1995", title: "Company Founded", description: "Started as a small family bakery" },
  { year: "2005", title: "Organic Certification", description: "Achieved full organic certification" },
  { year: "2015", title: "National Expansion", description: "Expanded to serve customers nationwide" },
  { year: "2024", title: "Award Recognition", description: "Received Best Organic Biscuit Award" },
]

export default function AboutPage() {
  const pageRef = useRef(null)
  const heroRef = useRef(null)
  const storyRef = useRef(null)
  const teamRef = useRef(null)
  const timelineRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        // Hero animation
        gsap.fromTo(heroRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" })

        // Story section animation
        gsap.fromTo(
          storyRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: storyRef.current,
              start: "top 80%",
            },
          },
        )

        // Team animation
        gsap.fromTo(
          teamRef.current.children,
          { y: 80, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            stagger: 0.2,
            scrollTrigger: {
              trigger: teamRef.current,
              start: "top 80%",
            },
          },
        )

        // Timeline animation
        gsap.fromTo(
          timelineRef.current.children,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
            },
          },
        )
      }, pageRef)

      return () => ctx.revert()
    }
  }, [])

  return (
    <Box ref={pageRef}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "60vh",
          background: "linear-gradient(135deg, #fefae0 0%, #f4f3ee 100%)",
          display: "flex",
          alignItems: "center",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Box ref={heroRef} sx={{ textAlign: "center" }}>
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
              Our Story
            </Typography>

            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 4,
                fontSize: { xs: "3rem", md: "4.5rem", lg: "5.5rem" },
                background: "linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #1a202c 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.1,
              }}
            >
              Crafting
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
                Excellence
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
              }}
            >
              For over 25 years, we've been dedicated to creating the finest organic biscuits using traditional methods
              and the highest quality ingredients.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Story Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: "#ffffff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box ref={storyRef}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: "#2d3748" }}>
                  Our Journey Began in a Small Kitchen
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: "1.1rem" }}>
                  What started as a passion project in Sarah's grandmother's kitchen has grown into a beloved brand
                  trusted by families across the nation. Our commitment to organic ingredients and traditional baking
                  methods remains unchanged.
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: "1.1rem" }}>
                  Every recipe is carefully crafted using time-honored techniques passed down through generations. We
                  source our ingredients from local organic farms, ensuring the highest quality and supporting our
                  community.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: "1.1rem" }}>
                  Today, we're proud to continue this tradition while innovating new flavors and maintaining our
                  commitment to sustainability and health.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/placeholder.svg?height=400&width=600"
                alt="Our bakery"
                sx={{
                  width: "100%",
                  height: 400,
                  objectFit: "cover",
                  borderRadius: 4,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: "center", fontWeight: 700, mb: 6, color: "#2d3748" }}>
            Our Values
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: IconLeaf,
                title: "Organic First",
                description: "We use only certified organic ingredients, supporting sustainable farming practices.",
              },
              {
                icon: IconHeart,
                title: "Made with Love",
                description: "Every batch is handcrafted with care and attention to detail.",
              },
              {
                icon: IconAward,
                title: "Quality Excellence",
                description: "We maintain the highest standards in every aspect of our production.",
              },
              {
                icon: IconUsers,
                title: "Community Focus",
                description: "We support local farmers and give back to our community.",
              },
            ].map((value, index) => {
              const IconComponent = value.icon
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: "center",
                      height: "100%",
                      borderRadius: 3,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                      }}
                    >
                      <IconComponent size={40} color="white" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {value.description}
                    </Typography>
                  </Paper>
                </Grid>
              )
            })}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: "#ffffff" }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: "center", fontWeight: 700, mb: 6, color: "#2d3748" }}>
            Meet Our Team
          </Typography>
          <Grid container spacing={4} ref={teamRef}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Avatar
                    src={member.image}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: "auto",
                      mb: 3,
                      border: "4px solid #5c8d89",
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: "#5c8d89", mb: 2, fontWeight: 600 }}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {member.bio}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Timeline Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: "linear-gradient(135deg, #fefae0 0%, #f4f3ee 100%)" }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: "center", fontWeight: 700, mb: 6, color: "#2d3748" }}>
            Our Journey
          </Typography>
          <Box ref={timelineRef}>
            {milestones.map((milestone, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 4,
                  "&:last-child": { mb: 0 },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 4,
                    flexShrink: 0,
                  }}
                >
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                    {milestone.year}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {milestone.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {milestone.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}
