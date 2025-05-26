"use client"

import { useState, useEffect } from "react"
import { Grid, CircularProgress, Box } from "@mui/material"
import ProductCard from "./product-card"

export default function RelatedProducts({ currentProductId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch("/api/products?limit=4")
        if (response.ok) {
          const data = await response.json()
          // Filter out the current product and take first 3
          const relatedProducts = data.products.filter((product) => product.id !== currentProductId).slice(0, 3)
          setProducts(relatedProducts)
        }
      } catch (error) {
        console.error("Error fetching related products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [currentProductId])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
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
