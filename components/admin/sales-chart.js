"use client"

import { Box, Typography } from "@mui/material"

export default function SalesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography>No sales data available.</Typography>
      </Box>
    )
  }

  // Simple bar chart representation
  const maxAmount = Math.max(...data.map((item) => item.amount))

  return (
    <Box sx={{ height: 300, display: "flex", alignItems: "end", gap: 1 }}>
      {data.map((item, index) => {
        const height = (item.amount / maxAmount) * 250
        return (
          <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <Typography variant="caption" sx={{ mb: 1 }}>
              ${item.amount}
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: `${height}px`,
                backgroundColor: "primary.main",
                borderRadius: 1,
                mb: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
