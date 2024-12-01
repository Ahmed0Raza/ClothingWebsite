import React from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function Newsletter() {
  return (
    <Box
      sx={{
        textAlign: "center",
        bgcolor: "grey.900",
        color: "grey.300",
        mt: 4,
        py: 4,
        px: 2,
        borderRadius: 1,
      }}
    >
      <Typography variant="h6" gutterBottom color="white">
        Newsletter Sign-Up
      </Typography>
      <Typography variant="body2" gutterBottom>
        Sign up for exclusive updates, new arrivals & insider-only discounts.
      </Typography>
      <Box
        component="form"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Your Email"
          sx={{
            bgcolor: "white",
            borderRadius: 1,
            minWidth: { xs: "100%", sm: "300px" },
          }}
        />
        <Button variant="contained" color="primary" sx={{ minWidth: "120px", mt: { xs: 1, sm: 0 } }}>
          Subscribe
        </Button>
      </Box>
    </Box>
  );
}
