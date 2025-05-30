"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material"
import {
  Person as PersonIcon,
  ShoppingBag as ShoppingBagIcon,
  LocationOn as LocationOnIcon,
  Security as SecurityIcon,
} from "@mui/icons-material"
import { UserProfile } from "@clerk/nextjs"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [activeTab, setActiveTab] = useState(0)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch user orders
  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/user/orders")
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  if (!isLoaded || loading) {
    return (
      <Box>
        <Navbar />
        <Container sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress />
        </Container>
        <Footer />
      </Box>
    )
  }

  const renderProfileTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Account Settings
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <UserProfile
          appearance={{
            elements: {
              rootBox: {
                width: "100%",
              },
              card: {
                border: "none",
                boxShadow: "none",
              },
            },
          }}
        />
      </Paper>
    </Box>
  )

  const renderOrdersTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order History
      </Typography>

      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            You haven't placed any orders yet.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} component={Link} href="/products">
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="subtitle1">Order #{order.id.slice(-6)}</Typography>
                    <Chip
                      label={order.status}
                      color={
                        order.status === "Delivered"
                          ? "success"
                          : order.status === "Processing"
                            ? "info"
                            : order.status === "Shipped"
                              ? "primary"
                              : "default"
                      }
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <List dense>
                    {order.items?.map((item) => (
                      <ListItem key={item.id}>
                        <ListItemText primary={item.product?.name} secondary={`Qty: ${item.quantity}`} />
                        <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Typography variant="subtitle2">Total</Typography>
                    <Typography variant="subtitle2">${order.total?.toFixed(2)}</Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Button variant="outlined" size="small" component={Link} href={`/order/${order.id}`}>
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )

  const renderAddressesTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Saved Addresses
      </Typography>
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Address management is handled through your account settings.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => setActiveTab(0)}>
          Go to Account Settings
        </Button>
      </Paper>
    </Box>
  )

  const renderSecurityTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Security Settings
      </Typography>
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Security settings including password changes and two-factor authentication are managed through your account
          settings.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => setActiveTab(0)}>
          Go to Account Settings
        </Button>
      </Paper>
    </Box>
  )

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Account
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Tabs
                orientation="vertical"
                value={activeTab}
                onChange={handleTabChange}
                sx={{ borderRight: 1, borderColor: "divider" }}
              >
                <Tab icon={<PersonIcon />} label="Profile" />
                <Tab icon={<ShoppingBagIcon />} label="Orders" />
                <Tab icon={<LocationOnIcon />} label="Addresses" />
                <Tab icon={<SecurityIcon />} label="Security" />
              </Tabs>
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 3 }}>
              {activeTab === 0 && renderProfileTab()}
              {activeTab === 1 && renderOrdersTab()}
              {activeTab === 2 && renderAddressesTab()}
              {activeTab === 3 && renderSecurityTab()}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}
