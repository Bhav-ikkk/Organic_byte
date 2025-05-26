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
import { ShoppingCart as ShoppingCartIcon, Menu as MenuIcon, Person as PersonIcon } from "@mui/icons-material"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

export default function Navbar() {
  const { cart } = useCart()
  const { user, logout } = useAuth()
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
    { title: "Home", path: "/" },
    { title: "Shop", path: "/products" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
  ]

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
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
      <AppBar position="sticky" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
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
                  sx={{ color: "text.primary", display: "block", mx: 1 }}
                >
                  {item.title}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: "flex" }}>
              <IconButton component={Link} href="/cart" color="inherit" aria-label="cart">
                <Badge badgeContent={cartItemCount} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

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
      >
        {user
          ? [
              user.isAdmin && (
                <MenuItem key="admin" component={Link} href="/admin" onClick={handleMenuClose}>
                  Admin Dashboard
                </MenuItem>
              ),
              <MenuItem key="account" component={Link} href="/account" onClick={handleMenuClose}>
                My Account
              </MenuItem>,
              <MenuItem key="orders" component={Link} href="/orders" onClick={handleMenuClose}>
                My Orders
              </MenuItem>,
              <MenuItem
                key="logout"
                onClick={() => {
                  logout()
                  handleMenuClose()
                }}
              >
                Logout
              </MenuItem>,
            ].filter(Boolean)
          : [
              <MenuItem key="login" component={Link} href="/login" onClick={handleMenuClose}>
                Login
              </MenuItem>,
              <MenuItem key="register" component={Link} href="/register" onClick={handleMenuClose}>
                Register
              </MenuItem>,
            ]}
      </Menu>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
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
