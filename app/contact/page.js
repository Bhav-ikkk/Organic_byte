"use client"

import { useState, useRef, useEffect } from "react"
import { Box, Container, Typography, Grid, TextField, Button, Paper, Alert, Snackbar } from "@mui/material"
import { IconMail, IconPhone, IconMapPin, IconSend } from "@tabler/icons-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const pageRef = useRef(null)
  const heroRef = useRef(null)
  const formRef = useRef(null)
  const contactInfoRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        // Hero animation
        gsap.fromTo(heroRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" })

        // Form animation
        gsap.fromTo(
          formRef.current,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.3,
          },
        )

        // Contact info animation
        gsap.fromTo(
          contactInfoRef.current,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.5,
          },
        )
      }, pageRef)

      return () => ctx.revert()
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      setShowSuccess(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    }, 2000)
  }

  return (
    <Box ref={pageRef}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "50vh",
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
              Get In Touch
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
              Contact
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
                Us
              </Box>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "text.secondary",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.6,
                fontSize: { xs: "1.2rem", md: "1.4rem" },
              }}
            >
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Form & Info */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: "#ffffff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Contact Form */}
            <Grid item xs={12} md={8}>
              <Paper
                ref={formRef}
                sx={{
                  p: { xs: 4, md: 6 },
                  borderRadius: 4,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: "#2d3748" }}>
                  Send us a Message
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<IconSend />}
                        disabled={loading}
                        sx={{
                          px: 4,
                          py: 2,
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          borderRadius: 3,
                          background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #4a7c7a 0%, #3a6b68 100%)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        {loading ? "Sending..." : "Send Message"}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <Box ref={contactInfoRef}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: "#2d3748" }}>
                  Get in Touch
                </Typography>

                {[
                  {
                    icon: IconMapPin,
                    title: "Visit Us",
                    content: "123 Organic Lane\nBiscuit Town, BT 12345",
                  },
                  {
                    icon: IconPhone,
                    title: "Call Us",
                    content: "+1 (555) 123-4567\nMon-Fri 9AM-6PM",
                  },
                  {
                    icon: IconMail,
                    title: "Email Us",
                    content: "info@organicbiscuits.com\nsupport@organicbiscuits.com",
                  },
                ].map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <Paper
                      key={index}
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "flex-start",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 3,
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent size={24} color="white" />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
                          {item.content}
                        </Typography>
                      </Box>
                    </Paper>
                  )
                })}

                {/* Map Placeholder */}
                <Paper
                  sx={{
                    height: 200,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Interactive Map Coming Soon
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />

      {/* Success Snackbar */}
      <Snackbar open={showSuccess} autoHideDuration={6000} onClose={() => setShowSuccess(false)}>
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Thank you for your message! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </Box>
  )
}
