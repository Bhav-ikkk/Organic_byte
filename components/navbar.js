"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material"
import {
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import LanguageSwitcher from "./language-switcher"
import { useTranslation } from "react-i18next"

export default function Navbar() {
  const { cart } = useCart()
  const { user, logout } = useAuth()
  const { mode, toggleMode } = useTheme()
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0)

  const menuItems = [
    { title: t("home"), path: "/" },
    { title: t("shop"), path: "/products" },
    { title: t("about"), path: "/about" },
    { title: t("contact"), path: "/contact" },
  ]

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 700 }}>
        Organic Biscuits
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton component={Link} href={item.path} sx={{ textAlign: "center" }}>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar position="sticky" color="default" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
                background: "linear-gradient(45deg, #5c8d89, #d4a373)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Organic Biscuits
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" } }}>
              {menuItems.map((item) => (
                <Button
                  key={item.title}
                  component={Link}
                  href={item.path}
                  sx={{
                    color: "text.primary",
                    display: "block",
                    mx: 1,
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "rgba(92, 141, 137, 0.1)",
                    },
                  }}
                >
                  {item.title}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Theme Toggle */}
              <IconButton onClick={toggleMode} color="inherit">
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>

              {/* Cart */}
              <IconButton component={Link} href="/cart" color="inherit" aria-label="cart">
                <Badge badgeContent={cartItemCount} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {/* Profile */}
              <IconButton
                edge="end"
                aria-label="account"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <PersonIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          },
        }}
      >
        {user
          ? [
              user.isAdmin && (
                <MenuItem key="admin" component={Link} href="/admin" onClick={handleMenuClose}>
                  {t("adminDashboard")}
                </MenuItem>
              ),
              <MenuItem key="account" component={Link} href="/account" onClick={handleMenuClose}>
                {t("myAccount")}
              </MenuItem>,
              <MenuItem key="orders" component={Link} href="/orders" onClick={handleMenuClose}>
                {t("myOrders")}
              </MenuItem>,
              <MenuItem
                key="logout"
                onClick={() => {
                  logout()
                  handleMenuClose()
                }}
              >
                {t("logout")}
              </MenuItem>,
            ].filter(Boolean)
          : [
              <MenuItem key="login" component={Link} href="/login" onClick={handleMenuClose}>
                {t("login")}
              </MenuItem>,
              <MenuItem key="register" component={Link} href="/register" onClick={handleMenuClose}>
                {t("register")}
              </MenuItem>,
            ]}
      </Menu>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}
