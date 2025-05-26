"use client"

import { useState } from "react"
import { Box, Button, Typography, CircularProgress, Alert } from "@mui/material"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

export default function PaymentForm({ onPaymentComplete }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return
    }

    setProcessing(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)

      const { error, paymentIntent } = await stripe.confirmCardPayment(undefined, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // You can add billing details here if needed
          },
        },
      })

      if (error) {
        setError(`Payment failed: ${error.message}`)
        setProcessing(false)
        return
      }

      if (paymentIntent.status === "succeeded") {
        setSucceeded(true)
        setProcessing(false)

        // Call the callback with payment result
        onPaymentComplete({
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
        })
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError("An unexpected error occurred. Please try again.")
      setProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="subtitle1" gutterBottom>
        Card Details
      </Typography>

      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          p: 2,
          mb: 2,
        }}
      >
        <CardElement options={cardElementOptions} />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={processing || !stripe || succeeded}
        sx={{ mt: 2 }}
      >
        {processing ? <CircularProgress size={24} /> : succeeded ? "Payment Successful" : "Pay Now"}
      </Button>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
        * This is a test payment. No actual charges will be made.
        <br />
        Test Card: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3 digits
      </Typography>
    </Box>
  )
}
