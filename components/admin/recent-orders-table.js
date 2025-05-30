import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
  Button,
} from "@mui/material"
import { Visibility as VisibilityIcon } from "@mui/icons-material"
import Link from "next/link"

export default function RecentOrdersTable({ orders = [] }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      processing: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "error",
    }
    return colors[status] || "default"
  }

  // If no orders, show a message
  if (!orders || orders.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No recent orders found
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  #{order.id.slice(-6)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{order.customer}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {order.email}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{new Date(order.date).toLocaleDateString()}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(order.date).toLocaleTimeString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  ${order.total.toFixed(2)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status)}
                  size="small"
                  sx={{ textTransform: "capitalize" }}
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  component={Link}
                  href={`/admin/orders?id=${order.id}`}
                  size="small"
                  startIcon={<VisibilityIcon fontSize="small" />}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
