import { Box, Container, Grid, Typography, Divider, Chip } from "@mui/material"
import { notFound } from "next/navigation"
import Navbar from "@/components/navbar"
import ProductGallery from "@/components/product-gallery"
import ProductReviews from "@/components/product-reviews"
import RelatedProducts from "@/components/related-products"
import AddToCartButton from "@/components/add-to-cart-button"
import Footer from "@/components/footer"

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} - Organic Biscuits`,
    description: product.description,
  }
}

async function getProduct(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ProductGallery images={product.images || [product.image]} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>

              <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
                ${product.price.toFixed(2)}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                {product.categories?.map((category) => (
                  <Chip key={category} label={category} size="small" />
                ))}
              </Box>

              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Ingredients:
                </Typography>
                <Typography variant="body2">
                  {product.ingredients ||
                    "Organic flour, organic butter, organic sugar, organic eggs, natural flavors."}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Nutritional Information:
                </Typography>
                <Typography variant="body2">
                  {product.nutritionalInfo || "Calories: 120 per serving, Fat: 5g, Carbs: 15g, Protein: 2g"}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Availability:
                  <Chip
                    label={product.stock > 0 ? "In Stock" : "Out of Stock"}
                    color={product.stock > 0 ? "success" : "error"}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                {product.stock <= 5 && product.stock > 0 && (
                  <Typography variant="body2" color="warning.main">
                    Only {product.stock} left in stock - order soon!
                  </Typography>
                )}
              </Box>

              <AddToCartButton product={product} />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        <ProductReviews productId={params.id} />

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            You May Also Like
          </Typography>
          <RelatedProducts currentProductId={params.id} />
        </Box>
      </Container>
      <Footer />
    </Box>
  )
}
