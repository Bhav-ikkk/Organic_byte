import { Box } from "@mui/material"
import Navbar from "@/components/navbar"
import HeroBanner from "@/components/hero-banner"
import FeaturedProducts from "@/components/featured-products"
import ProductShowcase from "@/components/product-showcase"
import BenefitsSection from "@/components/benefits-section"
import TestimonialsSection from "@/components/testimonials-section"
import NewsletterSection from "@/components/newsletter-section"
import Footer from "@/components/footer"

export const metadata = {
  title: "Organic Biscuits - Handcrafted Artisan Delights",
  description:
    "Premium organic biscuits handcrafted with love. Experience the perfect harmony of taste, tradition, and wellness in every bite.",
}

export default function Home() {
  return (
    <Box>
      <Navbar />
      <HeroBanner />
      <FeaturedProducts />
      <ProductShowcase />
      <BenefitsSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </Box>
  )
}
