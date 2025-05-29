"use client"

import { useState, useRef, useEffect } from "react"
import { Box, Typography, Button, Rating, Chip, IconButton } from "@mui/material"
import { IconShoppingCart, IconHeart, IconEye, IconPlus, IconMinus, IconStar } from "@tabler/icons-react"
import Link from "next/link"
import { gsap } from "gsap"
import { useCart } from "@/contexts/cart-context"

export default function ProductCardPremium({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [showQuantity, setShowQuantity] = useState(false)
  const { addToCart } = useCart()

  const cardRef = useRef(null)
  const imageRef = useRef(null)
  const overlayRef = useRef(null)
  const detailsRef = useRef(null)
  const priceRef = useRef(null)
  const badgeRef = useRef(null)
  const quantityRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    const image = imageRef.current
    const overlay = overlayRef.current
    const details = detailsRef.current
    const price = priceRef.current
    const badge = badgeRef.current

    if (!card || !image || !overlay || !details || !price) return

    // Set initial states
    gsap.set(overlay, { opacity: 0, y: 20 })
    gsap.set(details, { opacity: 0, y: 30 })
    gsap.set(price, { scale: 1 })
    if (badge) gsap.set(badge, { scale: 0, rotation: -10 })

    const handleMouseEnter = () => {
      setIsHovered(true)

      const tl = gsap.timeline()

      // Card elevation with subtle scale
      tl.to(card, {
        y: -12,
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
        duration: 0.6,
        ease: "power3.out",
      })

        // Image zoom with brightness
        .to(
          image,
          {
            scale: 1.1,
            filter: "brightness(1.05) contrast(1.05)",
            duration: 0.8,
            ease: "power2.out",
          },
          0,
        )

        // Overlay slide up
        .to(
          overlay,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          0.2,
        )

        // Details fade in with stagger
        .to(
          details,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          0.3,
        )

        // Price pulse
        .to(
          price,
          {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          },
          0.4,
        )

      // Badge bounce
      if (badge) {
        tl.to(
          badge,
          {
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(2)",
          },
          0.1,
        )
      }
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      setShowQuantity(false)

      const tl = gsap.timeline()

      tl.to(card, {
        y: 0,
        scale: 1,
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        duration: 0.5,
        ease: "power3.out",
      })

        .to(
          image,
          {
            scale: 1,
            filter: "brightness(1) contrast(1)",
            duration: 0.6,
            ease: "power2.out",
          },
          0,
        )

        .to(
          overlay,
          {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: "power3.out",
          },
          0,
        )

        .to(
          details,
          {
            opacity: 0,
            y: 30,
            duration: 0.4,
            ease: "power3.out",
          },
          0,
        )

        .to(
          price,
          {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          0,
        )
    }

    card.addEventListener("mouseenter", handleMouseEnter)
    card.addEventListener("mouseleave", handleMouseLeave)

    // Initial badge animation
    if (badge) {
      gsap.to(badge, {
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: Math.random() * 0.5,
      })
    }

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (showQuantity) {
      addToCart(product, quantity)

      // Success animation
      gsap.to(e.currentTarget, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => {
          // Show success feedback
          gsap.to(cardRef.current, {
            backgroundColor: "#e8f5e8",
            duration: 0.3,
            yoyo: true,
            repeat: 1,
          })
        },
      })
    } else {
      setShowQuantity(true)
      if (quantityRef.current) {
        gsap.fromTo(
          quantityRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
        )
      }
    }
  }

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)

    gsap.to(e.currentTarget, {
      scale: 1.4,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "back.out(2)",
    })
  }

  const handleQuantityChange = (change, e) => {
    e.preventDefault()
    e.stopPropagation()
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)

    gsap.to(quantityRef.current, {
      scale: 1.1,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    })
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

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
        borderRadius: "24px",
        overflow: "hidden",
        background: "linear-gradient(145deg, #ffffff 0%, #fefefe 100%)",
        border: "1px solid rgba(0,0,0,0.06)",
        cursor: "pointer",
        height: "480px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          textDecoration: "none",
          color: "inherit",
        },
      }}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <Chip
          ref={badgeRef}
          label={`${discountPercentage}% OFF`}
          size="small"
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 4,
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
            color: "white",
            fontWeight: 700,
            fontSize: "0.75rem",
            height: "28px",
            borderRadius: "14px",
            boxShadow: "0 4px 12px rgba(255,107,107,0.4)",
          }}
        />
      )}

      {/* Featured Badge */}
      {product.featured && (
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 4,
            background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
            color: "#333",
            padding: "6px 12px",
            borderRadius: "12px",
            fontSize: "0.7rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            boxShadow: "0 4px 12px rgba(255,215,0,0.3)",
          }}
        >
          <IconStar size={12} fill="currentColor" />
          FEATURED
        </Box>
      )}

      {/* Like Button */}
      <IconButton
        onClick={handleLike}
        sx={{
          position: "absolute",
          top: discountPercentage > 0 ? 60 : 20,
          right: 20,
          zIndex: 4,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          color: isLiked ? "#ff6b6b" : "#666",
          width: 44,
          height: 44,
          border: "1px solid rgba(0,0,0,0.08)",
          "&:hover": {
            background: "rgba(255,255,255,1)",
            color: "#ff6b6b",
            transform: "scale(1.05)",
          },
        }}
      >
        <IconHeart size={20} fill={isLiked ? "currentColor" : "none"} />
      </IconButton>

      {/* Product Image Container */}
      <Box
        sx={{
          position: "relative",
          height: "320px",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${product.color || "#f8f9fa"}15 0%, ${product.color || "#f8f9fa"}08 100%)`,
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
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Hover Overlay */}
        <Box
          ref={overlayRef}
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
            padding: 3,
          }}
        >
          <Box
            ref={detailsRef}
            sx={{
              textAlign: "center",
              color: "white",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: "1.1rem" }}>
              {product.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2, lineHeight: 1.5 }}>
              {product.description}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
              <Rating value={product.rating} precision={0.1} readOnly size="small" />
              <Typography variant="caption" sx={{ ml: 1, opacity: 0.8 }}>
                ({product.reviewCount})
              </Typography>
            </Box>

            {/* Quantity Selector */}
            {showQuantity && (
              <Box
                ref={quantityRef}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mb: 2,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  padding: "8px 16px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => handleQuantityChange(-1, e)}
                  sx={{ color: "white", "&:hover": { background: "rgba(255,255,255,0.2)" } }}
                >
                  <IconMinus size={16} />
                </IconButton>
                <Typography sx={{ color: "white", fontWeight: 600, minWidth: "20px", textAlign: "center" }}>
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => handleQuantityChange(1, e)}
                  sx={{ color: "white", "&:hover": { background: "rgba(255,255,255,0.2)" } }}
                >
                  <IconPlus size={16} />
                </IconButton>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
              <Button
                variant="contained"
                size="medium"
                startIcon={showQuantity ? <IconShoppingCart size={18} /> : <IconPlus size={18} />}
                onClick={handleAddToCart}
                sx={{
                  background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.5,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(92,141,137,0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #4a7c7a 0%, #3a6b68 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(92,141,137,0.5)",
                  },
                }}
              >
                {showQuantity ? "Add to Cart" : "Quick Add"}
              </Button>

              <Button
                variant="outlined"
                size="medium"
                startIcon={<IconEye size={18} />}
                sx={{
                  borderColor: "white",
                  color: "white",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.5,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderWidth: "2px",
                  "&:hover": {
                    borderColor: "white",
                    background: "rgba(255,255,255,0.15)",
                    borderWidth: "2px",
                  },
                }}
              >
                View Details
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Product Info */}
      <Box sx={{ p: 3, height: "160px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: "#2d3748",
              fontSize: "1.1rem",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Rating value={product.rating} precision={0.1} readOnly size="small" />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
              ({product.reviewCount} reviews)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box ref={priceRef}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#5c8d89",
                  fontSize: "1.5rem",
                }}
              >
                ${product.price}
              </Typography>
              {product.originalPrice && (
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: "line-through",
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  ${product.originalPrice}
                </Typography>
              )}
            </Box>
            {product.stock <= 5 && product.stock > 0 && (
              <Typography variant="caption" sx={{ color: "#ff6b6b", fontWeight: 600 }}>
                Only {product.stock} left!
              </Typography>
            )}
          </Box>

          <IconButton
            onClick={handleAddToCart}
            sx={{
              background: "linear-gradient(135deg, #5c8d89 0%, #4a7c7a 100%)",
              color: "white",
              width: 48,
              height: 48,
              boxShadow: "0 4px 15px rgba(92,141,137,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #4a7c7a 0%, #3a6b68 100%)",
                transform: "scale(1.05)",
                boxShadow: "0 6px 20px rgba(92,141,137,0.4)",
              },
            }}
          >
            <IconPlus size={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Stock Status Indicator */}
      {product.stock === 0 && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
          }}
        >
          <Typography variant="h6" sx={{ color: "#666", fontWeight: 700 }}>
            Out of Stock
          </Typography>
        </Box>
      )}
    </Box>
  )
}
