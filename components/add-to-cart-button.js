"use client"

import { useState } from "react"
import { Box, Button, TextField, Snackbar, Alert } from "@mui/material"
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material"
import { useCart } from "@/contexts/cart-context"

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleQuantityChange = (event) => {
    const value = Number.parseInt(event.target.value)
    if (value > 0 && value <= product.stock) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpenSnackbar(false)
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          type="number"
          label="Quantity"
          value={quantity}
          onChange={handleQuantityChange}
          inputProps={{ min: 1, max: product.stock }}
          disabled={product.stock === 0}
          size="small"
          sx={{ width: 100 }}
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          sx={{ flexGrow: 1 }}
        >
          Add to Cart
        </Button>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {product.name} added to cart!
        </Alert>
      </Snackbar>
    </>
  )
}
