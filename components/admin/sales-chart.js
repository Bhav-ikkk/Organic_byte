"use client"
import { Box, useTheme } from "@mui/material"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function SalesChart({ data = [] }) {
  const theme = useTheme()

  // If no data or empty array, show placeholder data
  const chartData =
    data.length > 0
      ? data
      : [
          { date: "2023-05-09", amount: 1250 },
          { date: "2023-05-10", amount: 1800 },
          { date: "2023-05-11", amount: 1600 },
          { date: "2023-05-12", amount: 2100 },
          { date: "2023-05-13", amount: 1900 },
          { date: "2023-05-14", amount: 2300 },
          { date: "2023-05-15", amount: 2050 },
        ]

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`
  }

  return (
    <Box sx={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke={theme.palette.text.secondary}
            tick={{ fontSize: 12 }}
          />
          <YAxis tickFormatter={(value) => `$${value}`} stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={formatCurrency}
            labelFormatter={formatDate}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 4,
              boxShadow: theme.shadows[3],
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}
