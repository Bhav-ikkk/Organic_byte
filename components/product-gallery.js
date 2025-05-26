"use client"

import { useState } from "react"
import { Box, Grid, Paper } from "@mui/material"
import Image from "next/image"

export default function ProductGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(0)

  // If no images provided, use a placeholder
  const galleryImages = images && images.length > 0 ? images : ["/placeholder.svg?height=500&width=500"]

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 2,
          position: "relative",
          height: 400,
          overflow: "hidden",
        }}
      >
        <Image
          src={galleryImages[selectedImage] || "/placeholder.svg"}
          alt="Product"
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </Paper>

      {galleryImages.length > 1 && (
        <Grid container spacing={1}>
          {galleryImages.map((image, index) => (
            <Grid item key={index} xs={3}>
              <Paper
                elevation={0}
                onClick={() => setSelectedImage(index)}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  cursor: "pointer",
                  border: index === selectedImage ? "2px solid" : "2px solid transparent",
                  borderColor: index === selectedImage ? "primary.main" : "transparent",
                  position: "relative",
                  height: 80,
                }}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Product thumbnail ${index + 1}`}
                  fill
                  style={{ objectFit: "cover", borderRadius: "4px" }}
                  sizes="25vw"
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
