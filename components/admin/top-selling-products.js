import React from "react"
import { List, ListItem, Typography, Box, LinearProgress, Divider } from "@mui/material"

export default function TopSellingProducts({ products = [] }) {
  // If no products or empty array, show placeholder data
  const displayProducts =
    products.length > 0
      ? products
      : [
          {
            id: "1",
            name: "Chocolate Chip Biscuits",
            sales: 245,
            revenue: 1223.55,
          },
          {
            id: "2",
            name: "Vanilla Shortbread",
            sales: 189,
            revenue: 754.11,
          },
          {
            id: "3",
            name: "Almond Butter Cookies",
            sales: 156,
            revenue: 934.44,
          },
          {
            id: "4",
            name: "Coconut Macaroons",
            sales: 134,
            revenue: 936.66,
          },
        ]

  // Find the highest sales value for percentage calculation
  const maxSales = Math.max(...displayProducts.map((product) => product.sales))

  return (
    <List disablePadding>
      {displayProducts.map((product, index) => (
        <React.Fragment key={product.id}>
          <ListItem disablePadding sx={{ py: 1 }}>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" fontWeight="medium">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.sales} units
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(product.sales / maxSales) * 100}
                sx={{ height: 6, borderRadius: 1, mb: 1 }}
              />
              <Typography variant="body2" color="primary" fontWeight="medium">
                ${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>
          </ListItem>
          {index < displayProducts.length - 1 && <Divider sx={{ my: 1 }} />}
        </React.Fragment>
      ))}
    </List>
  )
}
