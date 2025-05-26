"use client"

import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
} from "@mui/material"
import { Notifications as NotificationsIcon, Settings as SettingsIcon, Home as HomeIcon } from "@mui/icons-material"
import Link from "next/link"
import { useState } from "react"

export default function AdminHeader({ title, breadcrumbs = [] }) {
  const [notificationsAnchor, setNotificationsAnchor] = useState(null)

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget)
  }

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null)
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>

        <Box>
          <IconButton onClick={handleNotificationsOpen}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notificationsAnchor}
            open={Boolean(notificationsAnchor)}
            onClose={handleNotificationsClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleNotificationsClose}>
              <ListItemText primary="New Order #1234" secondary="Just now" />
            </MenuItem>
            <MenuItem onClick={handleNotificationsClose}>
              <ListItemText primary="Low Stock Alert" secondary="Chocolate Chip Biscuits - 5 left" />
            </MenuItem>
            <MenuItem onClick={handleNotificationsClose}>
              <ListItemText primary="Payment Received" secondary="Order #1233 - $45.99" />
            </MenuItem>
          </Menu>

          <IconButton component={Link} href="/admin/settings">
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>

      <Breadcrumbs aria-label="breadcrumb">
        <MuiLink
          component={Link}
          href="/admin"
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </MuiLink>

        {breadcrumbs.map((crumb, index) => (
          <MuiLink
            key={index}
            component={Link}
            href={crumb.href}
            underline="hover"
            color={index === breadcrumbs.length - 1 ? "text.primary" : "inherit"}
            aria-current={index === breadcrumbs.length - 1 ? "page" : undefined}
          >
            {crumb.label}
          </MuiLink>
        ))}
      </Breadcrumbs>
    </Box>
  )
}
