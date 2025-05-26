"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Rating, Button, TextField, Paper, Avatar, Divider } from "@mui/material"

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })

  // Mock reviews data
  useEffect(() => {
    const mockReviews = [
      {
        id: 1,
        user: "John D.",
        rating: 5,
        comment: "Absolutely delicious! Will definitely order again.",
        date: "2023-05-10",
      },
      {
        id: 2,
        user: "Sarah M.",
        rating: 4,
        comment: "Great taste and quality. Packaging could be better.",
        date: "2023-05-08",
      },
      {
        id: 3,
        user: "Mike R.",
        rating: 5,
        comment: "Best organic biscuits I've ever had!",
        date: "2023-05-05",
      },
    ]
    setReviews(mockReviews)
  }, [productId])

  const handleSubmitReview = () => {
    if (newReview.comment.trim()) {
      const review = {
        id: reviews.length + 1,
        user: "You",
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split("T")[0],
      }
      setReviews([review, ...reviews])
      setNewReview({ rating: 5, comment: "" })
    }
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Customer Reviews
      </Typography>

      {/* Add Review Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Write a Review
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            value={newReview.rating}
            onChange={(event, newValue) => {
              setNewReview({ ...newReview, rating: newValue })
            }}
          />
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Share your thoughts about this product..."
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSubmitReview}>
          Submit Review
        </Button>
      </Paper>

      {/* Reviews List */}
      {reviews.map((review, index) => (
        <Box key={review.id}>
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <Avatar sx={{ mr: 2 }}>{review.user.charAt(0)}</Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  {review.user}
                </Typography>
                <Rating value={review.rating} readOnly size="small" />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  {review.date}
                </Typography>
              </Box>
              <Typography variant="body1">{review.comment}</Typography>
            </Box>
          </Box>
          {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
        </Box>
      ))}
    </Box>
  )
}
