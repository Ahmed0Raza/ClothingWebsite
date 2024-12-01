import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, MapPin, Phone, Mail } from "react-feather";
import { Grid, Typography, Box, IconButton } from "@mui/material";
import Newsletter from "./Newsletter";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "grey.900", color: "grey.300", py: 6, px: 4 }}>
      <Grid container spacing={4} justifyContent="space-between">
        {/* About Us Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom color="white">
            About Us
          </Typography>
          <Typography variant="body2" paragraph>
		  At [Brand Name], we believe in crafting experiences that resonate with your lifestyle. Founded in [Year], our mission is to [Insert mission, e.g., "provide high-quality, sustainable products that blend functionality with style"].

Every product we create is a reflection of our commitment to [core values, e.g., "quality, innovation, and customer satisfaction"]. Our journey started with [brief origin story], and since then, we've grown into a brand trusted by [target audience, e.g., "thousands worldwide"].

        </Typography>
        </Grid>

        {/* Useful Links Section */}
        {/* <Grid item xs={12} md={2}>
          <Typography variant="h6" gutterBottom color="white">
            Useful Links
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            {["Home", "Cart", "Men Fashion", "Women Fashion", "Track Order", "My Account", "Wishlist", "Terms"].map((link) => (
              <Box component="li" key={link} sx={{ mb: 1 }}>
                <Link to="#" style={{ textDecoration: "none", color: "inherit" }}>
                  {link}
                </Link>
              </Box>
            ))}
          </Box>
        </Grid> */}

        {/* Contact Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom color="white">
            Contact
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MapPin style={{ marginRight: 8 }} />
              <Typography variant="body2">Paxtan</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Phone style={{ marginRight: 8 }} />
              <Typography variant="body2">+92 312779232</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Mail style={{ marginRight: 8 }} />
              <Typography variant="body2">
                <a href="mailto:nimogha@gmail.com" style={{ textDecoration: "none", color: "inherit" }}>
                  mygmail@gmail.com
                </a>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Newsletter Section */}
      {/* <Newsletter /> */}

      {/* Social Media Icons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
        <IconButton color="inherit" component={Link} to="#">
          <Facebook />
        </IconButton>
        <IconButton color="inherit" component={Link} to="#">
          <Instagram />
        </IconButton>
      </Box>

      <Typography variant="body2" align="center" sx={{ mt: 4 }}>
        &copy; {new Date().getFullYear()} Your Brand. All rights reserved.
      </Typography>
    </Box>
  );
}
