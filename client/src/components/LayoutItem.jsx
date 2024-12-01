import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { 
  Card,
  CardMedia,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from 'lucide-react'
const LayoutCard = ({ children, className }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx("min-w-[180px] sm:min-w-[200px] md:min-w-[240px]", "rounded-xl", className)}
    >
      {children}
    </motion.div>
  );
};

const LayoutProduct = ({ title, images, price, category, discountPercentage = 0, productId }) => {
  const discountedPrice = price - (price * (discountPercentage / 100));

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Link to={`/product/${productId}`} style={{ textDecoration: 'none' }}>
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <Card sx={{ 
            width: '100%',
            position: 'relative',
            boxShadow: 'none',
          }}>
            {discountPercentage > 0 && (
              <Chip
                label={`${discountPercentage}% OFF`}
                color="error"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                  height: '20px',
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            )}

            <CardMedia
              component="img"
              image={images[0]}
              alt={title}
              sx={{
                height: {
                  xs: '240px',
                  sm: '280px',
                  md: '300px'
                },
                objectFit: 'cover',
                cursor: 'pointer'
              }}
            />
          </Card>

          <Box sx={{ mt: 1, textAlign: 'left' }}>
            <Typography 
              sx={{
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.8rem',
                  md: '0.875rem'
                },
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

          <Box sx={{ mt: 0.5, textAlign: 'left' }}>
            {discountPercentage > 0 ? (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                <Typography
                  sx={{ 
                    color: '#E41E31',
                    fontSize: {
                      xs: '0.75rem',
                      sm: '0.8rem',
                      md: '0.875rem'
                    },
                    fontWeight: 500,
                  }}
                >
                  PKR {discountedPrice.toFixed(0)}
                </Typography>
                <Typography
                  sx={{ 
                    textDecoration: 'line-through',
                    color: '#666',
                    fontSize: {
                      xs: '0.7rem',
                      sm: '0.75rem',
                      md: '0.8rem'
                    },
                  }}
                >
                  PKR {price}
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{ 
                  color: '#000',
                  fontSize: {
                    xs: '0.75rem',
                    sm: '0.8rem',
                    md: '0.875rem'
                  },
                  fontWeight: 500,
                }}
              >
                PKR {price}
              </Typography>
            )}
          </Box>
        </motion.div>
      </Link>
    </Box>
  );
};

const ProductSection = ({ title, products, containerRef }) => {
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftButton(scrollLeft > 10);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => currentRef.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!products || products.length === 0) return null;
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-6 relative"
    >
      <h2 className="text-lg md:text-xl font-bold mb-4 text-center">
        {title}
      </h2>
      
      <div className="relative">
      
{showLeftButton && (
  <button
    onClick={() => scroll('left')}
    className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 
    bg-white/80 shadow-sm rounded-full p-1.5 
    hover:bg-white hover:shadow-md transition-all duration-300 
    flex items-center justify-center"
    aria-label="Scroll left"
  >
    <ChevronLeft className="w-4 h-4 text-gray-600" />
  </button>
)}

{showRightButton && (
  <button
    onClick={() => scroll('right')}
    className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 
    bg-white/80 shadow-sm rounded-full p-1.5 
    hover:bg-white hover:shadow-md transition-all duration-300 
    flex items-center justify-center"
    aria-label="Scroll right"
  >
    <ChevronRight className="w-4 h-4 text-gray-600" />
  </button>
)}




        <div
          ref={containerRef}
          className="flex gap-2 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-3 pl-2 pr-3 -mx-3 md:mx-0 md:px-0"
          style={{ 
            scrollBehavior: 'smooth', 
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: '0.5rem'
          }}
        >
          {products.map((product) => (
            <div key={product._id} style={{ scrollSnapAlign: 'start' }}>
              <LayoutCard>
                <LayoutProduct
                  title={product.title}
                  category={product.category}
                  images={product.images}
                  price={product.price}
                  discountPercentage={product.discountPercentage}
                  productId={product._id}
                />
              </LayoutCard>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const LayoutItem = () => {
  const API_HOST = import.meta.env.VITE_API_HOST
  const [discountProducts, setDiscountProducts] = useState([]);
  const [menProducts, setMenProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  
  const scrollContainerRefs = {
    discount: useRef(null),
    men: useRef(null),
    women: useRef(null)
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [discountRes, menRes, womenRes] = await Promise.all([
          fetch(`${API_HOST}/products/discount`),
          fetch(`${API_HOST}/products/api/men`),
          fetch(`${API_HOST}/products/api/women`)
        ]);

        const discountData = await discountRes.json();
        const menData = await menRes.json();
        const womenData = await womenRes.json();

        setDiscountProducts(discountData.data || []);
        setMenProducts(menData || []);
        setWomenProducts(womenData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-4 mt-8"
    >
      <div className="space-y-4">
        {discountProducts.length > 0 && (
          <ProductSection
            title="Special Offers"
            products={discountProducts}
            containerRef={scrollContainerRefs.discount}
          />
        )}
        {menProducts.length > 0 && (
          <ProductSection
            title="Men's Collection"
            products={menProducts}
            containerRef={scrollContainerRefs.men}
          />
        )}
        {womenProducts.length > 0 && (
          <ProductSection
            title="Women's Collection"
            products={womenProducts}
            containerRef={scrollContainerRefs.women}
          />
        )}
      </div>
    </motion.div>
  );
};

export default LayoutItem;
export { LayoutCard, LayoutProduct };