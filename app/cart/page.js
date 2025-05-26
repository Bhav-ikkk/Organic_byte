"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Divider,
  Alert,
} from "@mui/material"
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart()
  const router = useRouter()
  const [error, setError] = useState("")

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      return
    }
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id) => {
    removeFromCart(id)
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      setError("Your cart is empty. Add some products before checking out.")
      return
    }

    router.push("/checkout")
  }

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Shopping Cart
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {cart.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <ShoppingBagIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Looks like you haven't added any products to your cart yet.
            </Typography>
            <Button component={Link} href="/products" variant="contained" color="primary" sx={{ mt: 2 }}>
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ position: "relative", width: 80, height: 80, mr: 2 }}>
                              <Image
                                src={item.image || "/placeholder.svg?height=80&width=80"}
                                alt={item.name}
                                fill
                                style={{ objectFit: "cover", borderRadius: "4px" }}
                              />
                            </Box>
                            <Typography variant="subtitle1">{item.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              value={item.quantity}
                              onChange={(e) => {
                                const val = Number.parseInt(e.target.value)
                                if (!isNaN(val)) {
                                  handleQuantityChange(item.id, val)
                                }
                              }}
                              inputProps={{
                                min: 1,
                                style: { textAlign: "center" },
                              }}
                              variant="outlined"
                              size="small"
                              sx={{ width: 60, mx: 1 }}
                            />
                            <IconButton size="small" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <IconButton color="error" onClick={() => handleRemoveItem(item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button component={Link} href="/products" variant="outlined">
                  Continue Shopping
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>

                <Box sx={{ my: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body1">Subtotal</Typography>
                    <Typography variant="body1">${cartTotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body1">Shipping</Typography>
                    <Typography variant="body1">$5.00</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">${(cartTotal + 5).toFixed(2)}</Typography>
                </Box>

                <Button variant="contained" color="primary" size="large" fullWidth onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
      <Footer />
    </Box>
  )
}
