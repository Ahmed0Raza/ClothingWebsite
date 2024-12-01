import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ZoomIn, ChevronDown, ChevronUp } from "react-feather";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import api from "../api";
import { CartContext, UserContext } from "@/App";

export default function ProductDetailsPage() {
  const { user } = useContext(UserContext);
  const { cart, cartDispatch } = useContext(CartContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [zoomedImageIndex, setZoomedImageIndex] = useState(null);
  const imageContainerRef = useRef(null);
  const zoomImageRef = useRef(null);

  const parseScqData = (SCQ) => {
    const colorMap = new Map();
    SCQ.forEach((item) => {
      const [size, color, quantity] = item.split("-");
      if (!colorMap.has(color)) {
        colorMap.set(color, []);
      }
      colorMap.get(color).push({ size, quantity: parseInt(quantity) });
    });
    return colorMap;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const resp = await api.fetchProduct(id);
        
        if (resp.status === "error") {
          setError("Product not found");
          return navigate("/404");
        }
        
        setProduct(resp);

        if (resp.SCQ) {
          const colorMap = parseScqData(resp.SCQ);
          const colors = Array.from(colorMap.keys());
          setAvailableColors(colors);
          
          if (colors.length > 0) {
            setSelectedColor(colors[0]);
            const sizes = colorMap.get(colors[0]) || [];
            setAvailableSizes(sizes);
          }
        }
      } catch (err) {
        setError("Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const colorMap = parseScqData(product.SCQ);
    const sizes = colorMap.get(color) || [];
    setAvailableSizes(sizes);
    setSelectedSize(null);
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    setIsZoomed(false);
  };

  const handleZoomToggle = (index) => {
    setZoomedImageIndex(index);
    setIsZoomed(true);
  };

  const handleZoomMove = (e) => {
    if (!zoomImageRef.current) return;

    const container = zoomImageRef.current;
    const { left, top, width, height } = container.getBoundingClientRect();
    
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    container.style.transformOrigin = `${x}% ${y}%`;
  };

  const addToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select both size and color");
      return;
    }

    const uniqueCartKey = `${id}-${selectedSize}-${selectedColor}`;
    const selectedSizeData = availableSizes.find(s => s.size === selectedSize);

    if (!selectedSizeData || selectedSizeData.quantity === 0) {
      alert("Selected size is out of stock");
      return;
    }

    try {
      if (user) {
        const resp = await api.addProductsToCart([
          {
            productID: id,
            quantity: 1,
            size: selectedSize,
            color: selectedColor,
            uniqueCartKey,
          },
        ]);

        if (resp) {
          cartDispatch({
            type: "ADD_PRODUCTS",
            payload: [
              {
                ...product,
                quantity: 1,
                size: selectedSize,
                color: selectedColor,
                uniqueCartKey,
              },
            ],
          });
        }
      } else {
        cartDispatch({
          type: "ADD_PRODUCTS",
          payload: [
            {
              ...product,
              quantity: 1,
              size: selectedSize,
              color: selectedColor,
              uniqueCartKey,
            },
          ],
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart");
    }
  };

  const renderZoomedImage = () => {
    if (zoomedImageIndex === null) return null;

    return (
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
        onClick={() => {
          setIsZoomed(false);
          setZoomedImageIndex(null);
        }}
      >
        <div className="relative w-11/12 md:w-3/4 max-w-6xl aspect-[3/4]">
          <img
            ref={zoomImageRef}
            src={product.images[zoomedImageIndex]}
            alt={`Zoomed view of ${product.title}`}
            onMouseMove={handleZoomMove}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-[2.5]"
          />
          <button 
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full"
            onClick={() => {
              setIsZoomed(false);
              setZoomedImageIndex(null);
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-800">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discountPercentage > 0
    ? product.price - product.price * (product.discountPercentage / 100)
    : product.price;

  return (
    <main className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      {/* Zoomed Image Modal */}
      {isZoomed && renderZoomedImage()}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Image Gallery */}
          <div className="flex gap-4">
            {/* Desktop Thumbnails */}
            <div className="hidden md:flex flex-col gap-2 w-24">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-24 h-24 border relative ${
                    currentImageIndex === index 
                      ? 'border-black' 
                      : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <ZoomIn 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomToggle(index);
                    }}
                    className="absolute bottom-1 right-1 text-black bg-white/70 rounded-full p-1 hover:bg-white" 
                  />
                </button>
              ))}
            </div>

            <div className="relative w-full">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <ZoomIn 
                  onClick={() => handleZoomToggle(currentImageIndex)}
                  className="absolute bottom-4 right-4 text-black bg-white/70 rounded-full p-2 hover:bg-white" 
                />
              </div>

              {/* Mobile Image Thumbnails */}
              <div className="md:hidden flex gap-2 mt-2 overflow-x-auto">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`w-16 h-16 flex-shrink-0 border ${
                      currentImageIndex === index 
                        ? 'border-black' 
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} - view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl text-gray-900 uppercase">{product.title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-red-500">
                PKR {discountedPrice.toFixed(0)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-gray-400 line-through">
                  PKR {product.price.toFixed(0)}
                </span>
              )}
            </div>

            {availableColors.length > 0 && (
              <div className="space-y-2">
                <p className="text-gray-900">Colors</p>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`px-4 py-2 text-sm border ${
                        selectedColor === color
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <p className="text-gray-900">Size: {selectedSize || 'Select Size'}</p>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(({ size, quantity }) => (
                    <button
                      key={size}
                      onClick={() => quantity > 0 ? setSelectedSize(size) : null}
                      disabled={quantity === 0}
                      className={`w-10 h-10 border ${
                        selectedSize === size
                          ? 'border-black'
                          : 'border-gray-200'
                      } ${quantity === 0 ? 'line-through text-gray-400' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

<div className="flex justify-center">
              <Button
                onClick={addToCart}
                className="w-full max-w-md flex items-center justify-center space-x-2 bg-black text-white py-3 hover:bg-gray-800 transition-colors duration-300 transform active:scale-95"
                disabled={!selectedSize || !selectedColor}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-semibold tracking-wider">Add to Cart</span>
              </Button>
            </div>

            {(!availableSizes.length || !availableColors.length) && (
              <p className="text-red-500">
                This product is currently out of stock
              </p>
            )}

            {(!availableSizes.length || !availableColors.length) && (
              <p className="text-red-500">
                This product is currently out of stock
              </p>
            )}

            {/* Description Dropdown */}
            <div className="border border-gray-200">
              <button 
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold">Product Description</span>
                {isDescriptionOpen ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {isDescriptionOpen && (
                <div 
                  className="p-4 border-t border-gray-200"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}