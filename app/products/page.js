import { Box, Container, Typography, Grid, Pagination } from "@mui/material"
import Navbar from "@/components/navbar"
import ProductList from "@/components/product-list"
import ProductFilters from "@/components/product-filters"
import Footer from "@/components/footer"

export const metadata = {
  title: "Organic Biscuits - Shop",
  description: "Browse our collection of delicious organic biscuits",
}

async function getProducts(searchParams) {
  const params = new URLSearchParams()

  if (searchParams.category) {
    params.append("category", searchParams.category)
  }

  if (searchParams.sort) {
    params.append("sort", searchParams.sort)
  }

  if (searchParams.page) {
    params.append("page", searchParams.page)
  } else {
    params.append("page", "1")
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    return { products: [], totalPages: 1 }
  }
}

export default async function ProductsPage({ searchParams }) {
  const { products, totalPages } = await getProducts(searchParams)
  const currentPage = Number.parseInt(searchParams.page || "1")

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          All Products
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <ProductFilters />
          </Grid>

          <Grid item xs={12} md={9}>
            <ProductList products={products} />

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination count={totalPages} page={currentPage} color="primary" size="large" siblingCount={1} />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}
