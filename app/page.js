import { Box } from "@mui/material"
import Navbar from "@/components/navbar"
import HeroBanner from "@/components/hero-banner"
import FeaturedProducts from "@/components/featured-products"
import AboutSection from "@/components/about-section"
import BenefitsSection from "@/components/benefits-section"
import TestimonialsSection from "@/components/testimonials-section"
import NewsletterSection from "@/components/newsletter-section"
import Footer from "@/components/footer"

export const metadata = {
  title: "Organic Biscuits - Handcrafted with Love",
  description:
    "Delicious organic biscuits made with natural ingredients. Experience the perfect blend of taste and health.",
}

export default function Home() {
  return (
    <Box>
      <Navbar />
      <HeroBanner />
      <FeaturedProducts />
      <BenefitsSection />
      <AboutSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </Box>
  )
}
