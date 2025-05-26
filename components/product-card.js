"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material"
import { useCart } from "@/contexts/cart-context"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
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
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
          <CardMedia
            component="img"
            height="200"
            image={product.image || "/placeholder.svg?height=200&width=300"}
            alt={product.name}
          />
        </Link>
        <CardContent sx={{ flexGrow: 1 }}>
          {product.stock <= 5 && product.stock > 0 && (
            <Chip label={`Only ${product.stock} left!`} size="small" color="warning" sx={{ mb: 1 }} />
          )}
          {product.stock === 0 && <Chip label="Out of Stock" size="small" color="error" sx={{ mb: 1 }} />}
          <Link href={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography gutterBottom variant="h6" component="h2">
              {product.name}
            </Typography>
          </Link>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Rating value={product.rating || 4.5} precision={0.5} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviewCount || 12})
            </Typography>
          </Box>
          <Typography variant="h6" color="primary" fontWeight="bold">
            ${product.price.toFixed(2)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" fullWidth onClick={handleAddToCart} disabled={product.stock === 0}>
            Add to Cart
          </Button>
        </CardActions>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {product.name} added to cart!
        </Alert>
      </Snackbar>
    </>
  )
}
