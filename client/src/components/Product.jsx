import React from "react";
import { Link } from "react-router-dom";
import { 
  Card,
  CardMedia,
  Typography,
  Box,
  Chip,
} from "@mui/material";

const Product = ({
  title,
  link,
  imgSrc,
  price,
  discount,
}) => {
  const discountedPrice = price - (price * (discount / 100));

  return (
    <Box sx={{ width: '100%', maxWidth: 345, position: 'relative', mb: 4 }}>
      {/* Main Card with Image */}
      <Card 
        sx={{ 
          width: '100%',
          position: 'relative',
          transition: 'transform 0.3s ease-in-out',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-5px)',
          }
        }}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <Chip
            label={`${discount}% OFF`}
            color="error"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
              fontWeight: 'bold'
            }}
          />
        )}

        {/* Image Container with Link */}
        <Link to={link} style={{ textDecoration: 'none' }}>
          <CardMedia
            component="img"
            height="380"
            image={imgSrc}
            alt={title}
            sx={{
              objectFit: 'cover',
              cursor: 'pointer'
            }}
          />
        </Link>
      </Card>

      {/* Title Box - Floating */}
      <Box 
        sx={{ 
          mt: 2,
          textAlign: 'left',
        }}
      >
        <Typography 
          sx={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#000',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Price Box - Floating */}
      <Box 
        sx={{ 
          mt: 1,
          textAlign: 'left',
        }}
      >
        {discount > 0 ? (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
            <Typography
              sx={{ 
                color: '#E41E31',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              PKR {discountedPrice.toFixed(0)}
            </Typography>
            <Typography
              sx={{ 
                textDecoration: 'line-through',
                color: '#666',
                fontSize: '0.875rem',
              }}
            >
              PKR {price}
            </Typography>
          </Box>
        ) : (
          <Typography
            sx={{ 
              color: '#000',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            PKR {price}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Product;