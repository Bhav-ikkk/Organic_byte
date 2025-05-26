"use client"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  Box,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material"
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material"

export default function ProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current filter values from URL
  const currentCategory = searchParams.get("category") || ""
  const currentSort = searchParams.get("sort") || "newest"
  const currentMinPrice = Number.parseInt(searchParams.get("minPrice") || "0")
  const currentMaxPrice = Number.parseInt(searchParams.get("maxPrice") || "50")

  // Local state for filters
  const [category, setCategory] = useState(currentCategory)
  const [priceRange, setPriceRange] = useState([currentMinPrice, currentMaxPrice])
  const [sort, setSort] = useState(currentSort)

  // Categories for checkboxes
  const categories = [
    { id: "chocolate", name: "Chocolate" },
    { id: "vanilla", name: "Vanilla" },
    { id: "fruit", name: "Fruit" },
    { id: "nuts", name: "Nuts & Seeds" },
    { id: "gluten-free", name: "Gluten Free" },
    { id: "vegan", name: "Vegan" },
  ]

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target

    if (checked) {
      setCategory(value)
    } else {
      setCategory("")
    }
  }

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue)
  }

  const handleSortChange = (event) => {
    setSort(event.target.value)
    applyFilters({ sort: event.target.value })
  }

  const applyFilters = (overrides = {}) => {
    const params = new URLSearchParams(searchParams)

    // Apply category filter
    if (overrides.category !== undefined) {
      if (overrides.category) {
        params.set("category", overrides.category)
      } else {
        params.delete("category")
      }
    } else if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }

    // Apply price range filter
    if (overrides.priceRange) {
      params.set("minPrice", overrides.priceRange[0].toString())
      params.set("maxPrice", overrides.priceRange[1].toString())
    } else if (priceRange[0] > 0 || priceRange[1] < 50) {
      params.set("minPrice", priceRange[0].toString())
      params.set("maxPrice", priceRange[1].toString())
    } else {
      params.delete("minPrice")
      params.delete("maxPrice")
    }

    // Apply sort
    if (overrides.sort) {
      params.set("sort", overrides.sort)
    } else if (sort !== "newest") {
      params.set("sort", sort)
    } else {
      params.delete("sort")
    }

    // Reset to page 1 when filters change
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    setCategory("")
    setPriceRange([0, 50])
    setSort("newest")
    router.push(pathname)
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {categories.map((cat) => (
              <FormControlLabel
                key={cat.id}
                control={<Checkbox checked={category === cat.id} onChange={handleCategoryChange} value={cat.id} />}
                label={cat.name}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 2 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={50}
              step={1}
              marks={[
                { value: 0, label: "$0" },
                { value: 50, label: "$50" },
              ]}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Typography variant="body2">${priceRange[0]}</Typography>
              <Typography variant="body2">${priceRange[1]}</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select labelId="sort-label" value={sort} label="Sort By" onChange={handleSortChange}>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => applyFilters()} fullWidth>
          Apply Filters
        </Button>
        <Button variant="outlined" onClick={resetFilters}>
          Reset
        </Button>
      </Box>
    </Box>
  )
}
