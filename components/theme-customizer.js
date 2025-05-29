"use client"
import { Box, Drawer, Typography, IconButton, Divider, Button, Grid, Paper, Switch, Fab, Tooltip } from "@mui/material"
import {
  Close as CloseIcon,
  Palette as PaletteIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import { useTheme } from "@/contexts/theme-context"
import { useTranslation } from "react-i18next"

export default function ThemeCustomizer() {
  const { t } = useTranslation()
  const {
    mode,
    colorScheme,
    colorSchemes,
    isCustomizerOpen,
    setIsCustomizerOpen,
    toggleMode,
    changeColorScheme,
    resetTheme,
  } = useTheme()

  const handleClose = () => {
    setIsCustomizerOpen(false)
  }

  const handleOpen = () => {
    setIsCustomizerOpen(true)
  }

  return (
    <>
      {/* Floating Action Button */}
      <Tooltip title="Customize Theme" placement="left">
        <Fab
          color="primary"
          onClick={handleOpen}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
            background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #4a7c7a 0%, #3a6b68 100%)",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <PaletteIcon />
        </Fab>
      </Tooltip>

      {/* Theme Customizer Drawer */}
      <Drawer
        anchor="right"
        open={isCustomizerOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 350,
            p: 3,
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h6" fontWeight={700}>
            🎨 Theme Customizer
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Mode Toggle */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            🌓 Theme Mode
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
              background: "rgba(92, 141, 137, 0.05)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {mode === "light" ? <LightModeIcon color="primary" /> : <DarkModeIcon color="primary" />}
              <Typography variant="body2" fontWeight={500}>
                {mode === "light" ? "Light Mode" : "Dark Mode"}
              </Typography>
            </Box>
            <Switch checked={mode === "dark"} onChange={toggleMode} color="primary" />
          </Box>
        </Box>

        {/* Color Schemes */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            🎨 Color Schemes
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(colorSchemes).map(([key, scheme]) => (
              <Grid item xs={6} key={key}>
                <Paper
                  onClick={() => changeColorScheme(key)}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor: colorScheme === key ? scheme.primary : "transparent",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: `0 8px 25px ${scheme.primary}30`,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", gap: 0.5, mb: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: scheme.primary,
                      }}
                    />
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: scheme.secondary,
                      }}
                    />
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: scheme.accent,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" fontWeight={500}>
                    {scheme.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Current Theme Preview */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            🔍 Current Theme
          </Typography>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${colorSchemes[colorScheme].primary} 0%, ${colorSchemes[colorScheme].secondary} 100%)`,
              color: "white",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {colorSchemes[colorScheme].name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {mode === "light" ? "Light" : "Dark"} Mode
            </Typography>
          </Paper>
        </Box>

        {/* Reset Button */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<RefreshIcon />}
          onClick={resetTheme}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          Reset to Default
        </Button>

        <Box sx={{ mt: 3, p: 2, borderRadius: 2, background: "rgba(92, 141, 137, 0.1)" }}>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            💡 <strong>Tip:</strong> Your theme preferences are automatically saved and will persist across sessions!
          </Typography>
        </Box>
      </Drawer>
    </>
  )
}
