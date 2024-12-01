import React, { useContext, useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import { useSearchParams, useParams, useLocation } from "react-router-dom";

import ProductList from "@/ui/ProductList";
import Container from "@/components/Container";
import Button from "@/components/Button";
import DropDown, { Select, Option } from "@/components/DropDown";
import useClickOutside from "@/hooks/useClickOutside";
import api from "../api";
import { CartContext, UserContext } from "@/App";

const sortOptions = [
  "new",
  // "popular",
  // "price: low to high",
  // "price: high to low",
];

const host=  import.meta.env.VITE_API_HOST




export default function ProductsPage() {
  const { cartDispatch } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const { gender, category } = useParams();
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState(0);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const dropDownRef = useClickOutside(() => setShowSortOptions(false));
  const location = useLocation();

  const isDiscountRoute = location.pathname.includes('discount');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url;
        
        if (isDiscountRoute) {
          url = `${host}/products/discount`;
          if (gender) {
            url += `/${gender}`;
          }
          if (category) {
            url += `/${category}`;
          }
        } else {
          url = `${host}/products/api`;
          if (gender) {
            url += `/${gender}`;
          }
          if (category) {
            url += `/${category}`;
          }
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${isDiscountRoute ? 'discounted ' : ''}products`);
        }

        const data = await response.json();
        const productData = isDiscountRoute ? data.data : data;
        setProducts(productData);

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [gender, category, isDiscountRoute]);

  useEffect(() => {
    sortProducts(sort);
  }, [sort]);

  const sortProducts = (sortType) => {
    switch (sortType) {
      case 1:
        setProducts([...products].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)));
        break;
      case 2:
        setProducts([...products].sort((a, b) => a.price - b.price));
        break;
      case 3:
        setProducts([...products].sort((a, b) => b.price - a.price));
        break;
      default:
        return;
    }
  };

  const getFilteredProducts = () => {
    let filteredProducts;
    if (gender) {
      filteredProducts = products.filter(
        (product) => product.gender && product.gender.toLowerCase() === gender.toLowerCase()
      );
    } else if (category) {
      filteredProducts = products.filter(
        (product) => product.category && product.category.toLowerCase() === category.toLowerCase()
      );
    } else {
      filteredProducts = products;
    }
    return filteredProducts;
  };

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      const resp = await api.addProductsToCart([{ productID: product._id, quantity }]);
      if (resp.status === "ok") {
        cartDispatch({ type: "ADD_PRODUCTS", payload: [{ ...product, quantity }] });
      }
    } else {
      cartDispatch({ type: "ADD_PRODUCTS", payload: [{ ...product, quantity }] });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 flex items-center justify-end">
          <div className="relative" ref={dropDownRef}>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <Button
                secondary
                className="text-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                onClick={() => setShowSortOptions((prev) => !prev)}
              >
                <span className="flex items-center">
                  {sortOptions[sort]} 
                  <ChevronDown className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </div>

            {showSortOptions && (
              <DropDown
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                onClick={() => setShowSortOptions(false)}
              >
                <Select className="py-1">
                  {sortOptions.map((option, i) => (
                    <Option 
                      key={option} 
                      onClick={() => setSort(i)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {option}
                    </Option>
                  ))}
                </Select>
              </DropDown>
            )}
          </div>
        </div>

        <div className="w-full">
          <ProductList 
            products={getFilteredProducts()} 
            onAddToCart={addToCart}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          />
        </div>
      </div>
    </main>
  );
}
