"use client"

import { List, ListItem, ListItemText, Typography, Box, Divider } from "@mui/material"

export default function TopSellingProducts({ products }) {
  if (!products || products.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography>No product data available.</Typography>
      </Box>
    )
  }

  return (
    <List>
      {products.map((product, index) => (
        <Box key={product.id}>
          <ListItem sx={{ px: 0 }}>
            <ListItemText primary={product.name} secondary={`${product.sales} sold`} />
            <Typography variant="body2" color="primary" fontWeight="bold">
              ${product.revenue.toFixed(2)}
            </Typography>
          </ListItem>
          {index < products.length - 1 && <Divider />}
        </Box>
      ))}
    </List>
  )
}
