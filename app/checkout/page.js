"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
} from "@mui/material"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PaymentForm from "@/components/payment-form"

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx")

const steps = ["Shipping Information", "Payment Method", "Review Order"]

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const [activeStep, setActiveStep] = useState(0)
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
    country: user?.country || "US",
  })

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [clientSecret, setClientSecret] = useState("")

  // Redirect to cart if cart is empty
  if (cart.length === 0 && typeof window !== "undefined") {
    router.push("/cart")
    return null
  }

  const handleNext = async () => {
    if (activeStep === 0) {
      // Validate shipping info
      const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"]
      const missingFields = requiredFields.filter((field) => !shippingInfo[field])

      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(", ")}`)
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(shippingInfo.email)) {
        setError("Please enter a valid email address")
        return
      }

      setError("")
    }

    if (activeStep === 1) {
      if (paymentMethod === "card") {
        try {
          setLoading(true)
          // Create a payment intent on the server
          const response = await fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: Math.round((cartTotal + 5) * 100), // Convert to cents
              currency: "usd",
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to create payment intent")
          }

          const data = await response.json()
          setClientSecret(data.clientSecret)
        } catch (err) {
          setError("Failed to initialize payment. Please try again.")
          console.error("Payment initialization error:", err)
          setLoading(false)
          return
        } finally {
          setLoading(false)
        }
      }
    }

    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleShippingInfoChange = (event) => {
    const { name, value } = event.target
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value)
  }

  const handlePlaceOrder = async (paymentResult) => {
    try {
      setLoading(true)

      // Create the order on the server
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingInfo,
          paymentInfo: {
            method: paymentMethod,
            ...paymentResult,
          },
          total: cartTotal + 5,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const orderData = await response.json()

      // Clear the cart
      clearCart()

      // Redirect to order confirmation page
      router.push(`/order-confirmation/${orderData.id}`)
    } catch (err) {
      setError("Failed to place your order. Please try again.")
      console.error("Order placement error:", err)
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={shippingInfo.firstName}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={shippingInfo.lastName}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={shippingInfo.email}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={shippingInfo.city}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State/Province"
                name="state"
                value={shippingInfo.state}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Zip / Postal code"
                name="zipCode"
                value={shippingInfo.zipCode}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Country"
                name="country"
                value={shippingInfo.country}
                onChange={handleShippingInfoChange}
              />
            </Grid>
          </Grid>
        )
      case 1:
        return (
          <Box>
            <FormControl component="fieldset">
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup name="paymentMethod" value={paymentMethod} onChange={handlePaymentMethodChange}>
                <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
                <FormControlLabel value="paypal" control={<Radio />} label="PayPal" disabled />
              </RadioGroup>
            </FormControl>

            {paymentMethod === "card" && clientSecret && (
              <Box sx={{ mt: 3 }}>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm onPaymentComplete={handlePlaceOrder} />
                </Elements>
              </Box>
            )}
          </Box>
        )
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>

            <List disablePadding>
              {cart.map((item) => (
                <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                  <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity}`} />
                  <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                </ListItem>
              ))}

              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Subtotal" />
                <Typography variant="body2">${cartTotal.toFixed(2)}</Typography>
              </ListItem>

              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Shipping" />
                <Typography variant="body2">$5.00</Typography>
              </ListItem>

              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" fontWeight="bold">
                  ${(cartTotal + 5).toFixed(2)}
                </Typography>
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  {shippingInfo.firstName} {shippingInfo.lastName}
                </Typography>
                <Typography variant="body2">{shippingInfo.address}</Typography>
                <Typography variant="body2">
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                </Typography>
                <Typography variant="body2">{shippingInfo.country}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">Contact Information</Typography>
                <Typography variant="body2">Email: {shippingInfo.email}</Typography>
                <Typography variant="body2">Phone: {shippingInfo.phone}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <Typography variant="body1">{paymentMethod === "card" ? "Credit/Debit Card" : "PayPal"}</Typography>
          </Box>
        )
      default:
        return null
    }
  }

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
              {renderStepContent(activeStep)}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button onClick={handleBack} disabled={activeStep === 0 || loading}>
                  Back
                </Button>

                {activeStep < steps.length - 1 ? (
                  <Button variant="contained" color="primary" onClick={handleNext} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Next"}
                  </Button>
                ) : (
                  paymentMethod !== "card" && (
                    <Button variant="contained" color="primary" onClick={() => handlePlaceOrder({})} disabled={loading}>
                      {loading ? <CircularProgress size={24} /> : "Place Order"}
                    </Button>
                  )
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              <List disablePadding>
                {cart.map((item) => (
                  <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                    <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity}`} />
                    <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                  </ListItem>
                ))}

                <Divider sx={{ my: 1 }} />

                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary="Subtotal" />
                  <Typography variant="body2">${cartTotal.toFixed(2)}</Typography>
                </ListItem>

                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary="Shipping" />
                  <Typography variant="body2">$5.00</Typography>
                </ListItem>

                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary="Total" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    ${(cartTotal + 5).toFixed(2)}
                  </Typography>
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}
