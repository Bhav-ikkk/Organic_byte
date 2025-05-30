"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Grid, Paper, Card, CardContent, CircularProgress, Alert, Button } from "@mui/material"
import {
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import AdminHeader from "@/components/admin/admin-header"
import RecentOrdersTable from "@/components/admin/recent-orders-table"
import SalesChart from "@/components/admin/sales-chart"
import TopSellingProducts from "@/components/admin/top-selling-products"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/admin/dashboard")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch dashboard data")
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError(err.message || "An error occurred while fetching dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading && !stats) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    )
  }

  // Use placeholder data if stats is null
  const dashboardStats = stats || {
    totalSales: 12580,
    totalOrders: 156,
    totalCustomers: 89,
    lowStockProducts: 5,
    recentOrders: [],
    salesData: [],
    topSellingProducts: [],
  }

  return (
    <Box>
      <AdminHeader title="Dashboard" />

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={fetchDashboardData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "primary.light",
                    borderRadius: "50%",
                    p: 1.5,
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AttachMoneyIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Sales
                  </Typography>
                  <Typography variant="h6">${dashboardStats.totalSales.toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "success.light",
                    borderRadius: "50%",
                    p: 1.5,
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShoppingCartIcon color="success" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                  <Typography variant="h6">{dashboardStats.totalOrders}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "info.light",
                    borderRadius: "50%",
                    p: 1.5,
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonIcon color="info" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Customers
                  </Typography>
                  <Typography variant="h6">{dashboardStats.totalCustomers}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "warning.light",
                    borderRadius: "50%",
                    p: 1.5,
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <InventoryIcon color="warning" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Low Stock Products
                  </Typography>
                  <Typography variant="h6">{dashboardStats.lowStockProducts}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Chart */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="500">
              Sales Overview
            </Typography>
            <SalesChart data={dashboardStats.salesData} />
          </Paper>
        </Grid>

        {/* Top Selling Products */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="500">
              Top Selling Products
            </Typography>
            <TopSellingProducts products={dashboardStats.topSellingProducts} />
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="500">
              Recent Orders
            </Typography>
            <RecentOrdersTable orders={dashboardStats.recentOrders} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
