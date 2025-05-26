import { Box, Typography, Grid, Paper } from "@mui/material"

export default function AboutSection() {
  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Why Choose Our Organic Biscuits?
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, height: "100%", backgroundColor: "background.paper" }}>
            <Typography variant="h6" gutterBottom>
              100% Organic Ingredients
            </Typography>
            <Typography variant="body1">
              We use only certified organic ingredients sourced from trusted local farmers. No pesticides, no GMOs, just
              pure natural goodness in every bite.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, height: "100%", backgroundColor: "background.paper" }}>
            <Typography variant="h6" gutterBottom>
              Handcrafted with Love
            </Typography>
            <Typography variant="body1">
              Each batch of our biscuits is carefully handcrafted using traditional methods that have been passed down
              through generations, ensuring quality and taste.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, height: "100%", backgroundColor: "background.paper" }}>
            <Typography variant="h6" gutterBottom>
              Eco-Friendly Packaging
            </Typography>
            <Typography variant="body1">
              We care about our planet as much as we care about our biscuits. All our packaging is biodegradable and
              made from recycled materials.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
