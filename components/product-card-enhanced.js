"use client"

import { useState, useRef, useEffect } from "react"
import { Box, Typography, Button, Rating, Chip, IconButton } from "@mui/material"
import { IconShoppingCart, IconHeart, IconEye, IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import { gsap } from "gsap"
import { useCart } from "@/contexts/cart-context"

export default function ProductCardEnhanced({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { addToCart } = useCart()
  const cardRef = useRef(null)
  const imageRef = useRef(null)
  const overlayRef = useRef(null)
  const detailsRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    const image = imageRef.current
    const overlay = overlayRef.current
    const details = detailsRef.current

    if (!card || !image || !overlay || !details) return

    const handleMouseEnter = () => {
      setIsHovered(true)

      const tl = gsap.timeline()

      // Card elevation and scale
      tl.to(card, {
        y: -20,
        scale: 1.03,
        duration: 0.4,
        ease: "power2.out",
      })

        // Image zoom and brightness
        .to(
          image,
          {
            scale: 1.15,
            filter: "brightness(1.1)",
            duration: 0.6,
            ease: "power2.out",
          },
          0,
        )

        // Overlay fade in
        .to(
          overlay,
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          0.1,
        )

        // Details slide up
        .fromTo(
          details,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          0.2,
        )
    }

    const handleMouseLeave = () => {
      setIsHovered(false)

      const tl = gsap.timeline()

      // Card back to normal
      tl.to(card, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      })

        // Image back to normal
        .to(
          image,
          {
            scale: 1,
            filter: "brightness(1)",
            duration: 0.4,
            ease: "power2.out",
          },
          0,
        )

        // Overlay fade out
        .to(
          overlay,
          {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          0,
        )

        // Details fade out
        .to(
          details,
          {
            y: 30,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          0,
        )
    }

    card.addEventListener("mouseenter", handleMouseEnter)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)

    // Add to cart animation
    gsap.to(e.currentTarget, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    })
  }

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)

    // Heart animation
    gsap.to(e.currentTarget, {
      scale: 1.3,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "back.out(1.7)",
    })
  }

  return (
    <Box
      ref={cardRef}
      component={Link}
      href={`/products/${product.id}`}
      sx={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        position: "relative",
        borderRadius: 4,
        overflow: "hidden",
        background: "linear-gradient(135deg, #ffffff 0%, #fefae0 100%)",
        border: "1px solid rgba(0,0,0,0.08)",
        cursor: "pointer",
        height: 420,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.4s ease",
        "&:hover": {
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Product Badge */}
      {product.featured && (
        <Chip
          label="Featured"
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 3,
            background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
            color: "white",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      )}

      {/* Like Button */}
      <IconButton
        onClick={handleLike}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 3,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          color: isLiked ? "#e76f51" : "#666",
          "&:hover": {
            background: "rgba(255,255,255,1)",
            color: "#e76f51",
          },
        }}
      >
        <IconHeart size={20} fill={isLiked ? "currentColor" : "none"} />
      </IconButton>

      {/* Product Image */}
      <Box
        sx={{
          position: "relative",
          height: 280,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${product.color || "#f8f9fa"}20 0%, ${product.color || "#f8f9fa"}10 100%)`,
        }}
      >
        <Box
          ref={imageRef}
          component="img"
          src={product.image}
          alt={product.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "all 0.6s ease",
          }}
        />

        {/* Hover Overlay */}
        <Box
          ref={overlayRef}
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
            opacity: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            ref={detailsRef}
            sx={{
              textAlign: "center",
              color: "white",
              px: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              {product.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
              {product.description}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly size="small" />
              <Typography variant="caption" sx={{ ml: 1, opacity: 0.8 }}>
                ({product.reviewCount})
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<IconShoppingCart size={16} />}
                onClick={handleAddToCart}
                sx={{
                  background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<IconEye size={16} />}
                sx={{
                  borderColor: "white",
                  color: "white",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontSize: "0.8rem",
                  "&:hover": {
                    borderColor: "white",
                    background: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                View
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Product Info */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "#2d3748",
            fontSize: "1.1rem",
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Rating value={product.rating} precision={0.1} readOnly size="small" />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviewCount})
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#5c8d89",
              fontSize: "1.4rem",
            }}
          >
            ${product.price}
          </Typography>

          <IconButton
            onClick={handleAddToCart}
            sx={{
              background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
              color: "white",
              width: 36,
              height: 36,
              "&:hover": {
                background: "linear-gradient(135deg, #4a7c7a 0%, #3a6b68 100%)",
                transform: "scale(1.1)",
              },
            }}
          >
            <IconPlus size={18} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}
