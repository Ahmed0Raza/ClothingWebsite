import React, { useEffect, useState } from 'react';
import { Plus, Minus, Trash } from "lucide-react";
import api from "@/api";

export default function CartItem({
  cartkey,
  imgSrc,
  name,
  price,
  discount,
  size,
  color,
  quantity,
  setQuantity
}) {
  const [maxQuantity, setMaxQuantity] = useState(null);
  const [isMaxQuantityReached, setIsMaxQuantityReached] = useState(false);

  // Truncate name if longer than 8 characters
  const truncatedName = name.length > 8 ? `${name.slice(0, 8)}...` : name;

  const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;

  useEffect(() => {
    const fetchMaxQuantity = async () => {
      try {
        const response = await api.checkProductQuantity(cartkey);
        const maxQuantity = response.quantity;
        setMaxQuantity(maxQuantity);
        setIsMaxQuantityReached(quantity >= maxQuantity);
      } catch (error) {
        console.error("Failed to fetch max quantity:", error);
      }
    };

    fetchMaxQuantity();
  }, [cartkey, quantity]);
  
  useEffect(() => {
    if (maxQuantity !== null) {
      setIsMaxQuantityReached(quantity >= maxQuantity);
    }
  }, [quantity, maxQuantity]);

  return (
    <div className="flex items-center bg-white shadow-sm rounded-lg p-3 space-x-3">
      <section className="w-24 h-24 flex-shrink-0">
        <img
          className="w-full h-full object-contain rounded-none"
          src={imgSrc}
          alt={`${name}`}
        />
      </section>

      <section className="flex-grow flex flex-col space-y-1">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{truncatedName}</h3>

        <div className="flex justify-between items-center">
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Price:</span>
              {discount > 0 ? (
                <span className="text-red-500 font-medium">
                  PKR {discountedPrice.toFixed(2)}
                </span>
              ) : (
                <span className="text-gray-800 font-medium">
                  PKR {price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Color:</span>
              <div
                className="h-3 w-3 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Size:</span>
              <span className="text-gray-800">{size}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              {quantity > 1 ? (
                <Minus
                  className="text-gray-600 cursor-pointer hover:text-gray-800"
                  size={16}
                  onClick={() => setQuantity(quantity - 1)}
                />
              ) : (
                <Trash
                  className="text-red-500 cursor-pointer hover:text-red-600"
                  size={16}
                  onClick={() => setQuantity(quantity - 1)}
                />
              )}

              <span className="text-xs text-gray-800 px-2">{quantity}</span>

              <Plus
                className={`text-gray-600 cursor-pointer hover:text-gray-800 ${isMaxQuantityReached ? 'text-gray-300 cursor-not-allowed filter blur-sm' : ''}`}
                size={16}
                onClick={() => {
                  if (!isMaxQuantityReached) {
                    setQuantity(quantity + 1);
                  }
                }}
                disabled={isMaxQuantityReached}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}