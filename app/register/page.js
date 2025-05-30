"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Box, Container, Paper, Tabs, Tab, Divider, Typography, Alert } from "@mui/material"
import { useAuth } from "@/contexts/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PhoneAuth from "@/components/auth/phone-auth"
import GmailAuth from "@/components/auth/gmail-auth"

export default function RegisterPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [authMethod, setAuthMethod] = useState("phone")
  const [error, setError] = useState("")

  // Redirect if already logged in
  if (user) {
    router.push("/")
    return null
  }

  const handleAuthMethodChange = (event, newValue) => {
    setAuthMethod(newValue)
  }

  const handleAuthSuccess = (userData) => {
    router.push("/")
  }

  return (
    <Box>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <GmailAuth onSuccess={handleAuthSuccess} />
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Tabs value={authMethod} onChange={handleAuthMethodChange} centered sx={{ mb: 3 }}>
            <Tab label="Phone" value="phone" />
            <Tab label="Email & Password" value="email" disabled />
          </Tabs>

          {authMethod === "phone" && <PhoneAuth onSuccess={handleAuthSuccess} />}

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link href="/login" style={{ color: "inherit", fontWeight: 500 }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  )
}
