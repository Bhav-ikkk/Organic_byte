"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Grid, Paper, Card, CardContent, CircularProgress, Alert } from "@mui/material"
import {
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material"
import AdminHeader from "@/components/admin/admin-header"
import RecentOrdersTable from "@/components/admin/recent-orders-table"
import SalesChart from "@/components/admin/sales-chart"
import TopSellingProducts from "@/components/admin/top-selling-products"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}. Please try again later.</Alert>
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

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "primary.light",
                    borderRadius: "50%",
                    p: 1.5,
                    mr: 2,
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
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "success.light",
                    borderRadius: "50%",
                    p: 1.5,
                    mr: 2,
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
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "info.light",
                    borderRadius: "50%",
                    p: 1.5,
                    mr: 2,
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
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "warning.light",
                    borderRadius: "50%",
                    p: 1.5,
                    mr: 2,
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
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sales Overview
            </Typography>
            <SalesChart data={dashboardStats.salesData} />
          </Paper>
        </Grid>

        {/* Top Selling Products */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Top Selling Products
            </Typography>
            <TopSellingProducts products={dashboardStats.topSellingProducts} />
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <RecentOrdersTable orders={dashboardStats.recentOrders} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}