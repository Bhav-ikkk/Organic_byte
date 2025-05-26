"use client"

import { Grid, Box, Typography } from "@mui/material"
import ProductCard from "./product-card"

export default function ProductList({ products }) {
  if (!products || products.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography>No products found. Try adjusting your filters.</Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  )
}
