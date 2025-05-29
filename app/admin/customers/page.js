"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
} from "@mui/material"
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
} from "@mui/icons-material"
import AdminHeader from "@/components/admin/admin-header"

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchCustomers()
  }, [page, rowsPerPage, searchTerm])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/admin/customers?${params}`)
      if (!response.ok) throw new Error("Failed to fetch customers")

      const data = await response.json()
      setCustomers(data.customers)
      setTotalCount(data.pagination.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getCustomerStatus = (customer) => {
    if (customer.totalOrders === 0) return { label: "New", color: "info" }
    if (customer.totalOrders >= 10) return { label: "VIP", color: "success" }
    if (customer.totalOrders >= 5) return { label: "Regular", color: "primary" }
    return { label: "Active", color: "default" }
  }

  if (loading && customers.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <AdminHeader title="Customers Management" breadcrumbs={[{ label: "Customers", href: "/admin/customers" }]} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search customers by name or email..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 400 }}
        />
      </Box>

      {/* Customers Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Total Spent</TableCell>
                <TableCell>Reviews</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => {
                const status = getCustomerStatus(customer)
                return (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ width: 40, height: 40 }}>{customer.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {customer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {customer.id.slice(-8)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">{customer.email}</Typography>
                        </Box>
                        {customer.phone && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">{customer.phone}</Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ShoppingCartIcon fontSize="small" color="action" />
                        <Typography variant="body2">{customer.totalOrders}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        ${customer.totalSpent.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <StarIcon fontSize="small" color="action" />
                        <Typography variant="body2">{customer.reviewCount}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={status.label} color={status.color} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{new Date(customer.createdAt).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setViewDialogOpen(true)
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number.parseInt(e.target.value))
            setPage(0)
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Customer Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Customer Details</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Personal Information
                      </Typography>
                      <Typography>
                        <strong>Name:</strong> {selectedCustomer.name}
                      </Typography>
                      <Typography>
                        <strong>Email:</strong> {selectedCustomer.email}
                      </Typography>
                      <Typography>
                        <strong>Phone:</strong> {selectedCustomer.phone || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Joined:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Order Statistics
                      </Typography>
                      <Typography>
                        <strong>Total Orders:</strong> {selectedCustomer.totalOrders}
                      </Typography>
                      <Typography>
                        <strong>Total Spent:</strong> ${selectedCustomer.totalSpent.toFixed(2)}
                      </Typography>
                      <Typography>
                        <strong>Reviews Written:</strong> {selectedCustomer.reviewCount}
                      </Typography>
                      <Typography>
                        <strong>Last Order:</strong>{" "}
                        {selectedCustomer.lastOrderDate
                          ? new Date(selectedCustomer.lastOrderDate).toLocaleDateString()
                          : "Never"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recent Orders
                      </Typography>
                      {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                        <Box>
                          {selectedCustomer.orders.slice(0, 5).map((order) => (
                            <Box
                              key={order.id}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                py: 1,
                                borderBottom: 1,
                                borderColor: "divider",
                              }}
                            >
                              <Typography>#{order.id.slice(-8)}</Typography>
                              <Typography>${order.totalAmount.toFixed(2)}</Typography>
                              <Chip label={order.status} size="small" />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(order.placedAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography color="text.secondary">No orders found</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
