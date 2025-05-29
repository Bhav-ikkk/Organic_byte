"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles"

const ThemeContext = createContext()

// Professional color schemes
const colorSchemes = {
  organic: {
    name: "Organic Green",
    primary: "#5c8d89",
    secondary: "#d4a373",
    background: "#fefae0",
    surface: "#ffffff",
    accent: "#8fbc8f",
  },
  ocean: {
    name: "Ocean Blue",
    primary: "#2196f3",
    secondary: "#ff9800",
    background: "#f5f5f5",
    surface: "#ffffff",
    accent: "#00bcd4",
  },
  sunset: {
    name: "Sunset Orange",
    primary: "#ff6b35",
    secondary: "#f7931e",
    background: "#fff8f0",
    surface: "#ffffff",
    accent: "#ffab00",
  },
  lavender: {
    name: "Lavender Purple",
    primary: "#7b68ee",
    secondary: "#dda0dd",
    background: "#f8f6ff",
    surface: "#ffffff",
    accent: "#9370db",
  },
  forest: {
    name: "Forest Green",
    primary: "#228b22",
    secondary: "#32cd32",
    background: "#f0fff0",
    surface: "#ffffff",
    accent: "#90ee90",
  },
  rose: {
    name: "Rose Gold",
    primary: "#e91e63",
    secondary: "#ff9800",
    background: "#fdf2f8",
    surface: "#ffffff",
    accent: "#f48fb1",
  },
  midnight: {
    name: "Midnight Blue",
    primary: "#1a237e",
    secondary: "#3f51b5",
    background: "#f3f4f6",
    surface: "#ffffff",
    accent: "#5c6bc0",
  },
  emerald: {
    name: "Emerald Green",
    primary: "#10b981",
    secondary: "#34d399",
    background: "#ecfdf5",
    surface: "#ffffff",
    accent: "#6ee7b7",
  },
}

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState("light")
  const [colorScheme, setColorScheme] = useState("organic")
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)

  // Load theme from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode")
    const savedColorScheme = localStorage.getItem("colorScheme")

    if (savedMode) setMode(savedMode)
    if (savedColorScheme) setColorScheme(savedColorScheme)
  }, [])

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem("themeMode", mode)
    localStorage.setItem("colorScheme", colorScheme)
  }, [mode, colorScheme])

  const currentColors = colorSchemes[colorScheme]

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: currentColors.primary,
        light: mode === "light" ? currentColors.accent : currentColors.primary,
        dark: currentColors.primary,
      },
      secondary: {
        main: currentColors.secondary,
      },
      background: {
        default: mode === "light" ? currentColors.background : "#121212",
        paper: mode === "light" ? currentColors.surface : "#1e1e1e",
      },
      text: {
        primary: mode === "light" ? "#333333" : "#ffffff",
        secondary: mode === "light" ? "#666666" : "#b3b3b3",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
      },
      h2: {
        fontWeight: 600,
        fontSize: "2rem",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.75rem",
      },
      h4: {
        fontWeight: 500,
        fontSize: "1.5rem",
      },
      h5: {
        fontWeight: 500,
        fontSize: "1.25rem",
      },
      h6: {
        fontWeight: 500,
        fontSize: "1rem",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: 500,
            padding: "10px 24px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === "light" ? "0 4px 20px rgba(0,0,0,0.08)" : "0 4px 20px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: mode === "light" ? "0 8px 30px rgba(0,0,0,0.12)" : "0 8px 30px rgba(0,0,0,0.4)",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)",
            backgroundColor: mode === "light" ? "rgba(255,255,255,0.95)" : "rgba(30,30,30,0.95)",
          },
        },
      },
    },
  })

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
  }

  const changeColorScheme = (scheme) => {
    setColorScheme(scheme)
  }

  const resetTheme = () => {
    setMode("light")
    setColorScheme("organic")
  }

  const value = {
    mode,
    colorScheme,
    colorSchemes,
    isCustomizerOpen,
    setIsCustomizerOpen,
    toggleMode,
    changeColorScheme,
    resetTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider")
  }
  return context
}
