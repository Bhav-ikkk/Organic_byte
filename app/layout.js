"use client"

import { Inter } from "next/font/google"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeContextProvider } from "@/contexts/theme-context"
import ThemeCustomizer from "@/components/theme-customizer"
import "./globals.css"
import "@/lib/i18n"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

// Create a custom theme with organic/natural colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#5c8d89", // Sage green
    },
    secondary: {
      main: "#d4a373", // Warm beige
    },
    background: {
      default: "#fefae0", // Light cream
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      },
    },
  },
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider
          appearance={{
            baseTheme: "light",
            variables: {
              colorPrimary: "#5c8d89",
              colorBackground: "#ffffff",
              colorInputBackground: "#ffffff",
              colorInputText: "#1f2937",
            },
            elements: {
              formButtonPrimary: {
                backgroundColor: "#5c8d89",
                "&:hover": {
                  backgroundColor: "#4a7470",
                },
              },
              card: {
                borderRadius: "12px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
            },
          }}
        >
          <ThemeContextProvider>
            <AuthProvider>
              <CartProvider>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  {children}
                  <ThemeCustomizer />
                </ThemeProvider>
              </CartProvider>
            </AuthProvider>
          </ThemeContextProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
