"use client"

import { Box, Container, Grid, Typography, Link, IconButton, Divider } from "@mui/material"
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import { useTheme } from "@/contexts/theme-context"

export default function Footer() {
  const { t } = useTranslation()
  const { mode } = useTheme()

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              {t("organicBiscuits")}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t("handcraftedOrganic")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              {t("quickLinks")}
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              {t("home")}
            </Link>
            <Link href="/products" color="inherit" display="block" sx={{ mb: 1 }}>
              {t("shop")}
            </Link>
            <Link href="/about" color="inherit" display="block" sx={{ mb: 1 }}>
              {t("about")}
            </Link>
            <Link href="/contact" color="inherit" display="block" sx={{ mb: 1 }}>
              {t("contact")}
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              {t("contactUs")}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationIcon sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">123 Organic Lane, Biscuit Town</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PhoneIcon sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">+1 (555) 123-4567</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EmailIcon sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">info@organicbiscuits.com</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.2)" }} />

        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} {t("organicBiscuits")}. {t("allRightsReserved")}
        </Typography>
      </Container>
    </Box>
  )
}
