import React, { useContext } from 'react';
import Product from "@/components/Product";
import { CartContext } from "@/App";

export default function ProductList({ products, onAddToCart }) {
  const { cart } = useContext(CartContext);
 
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full justify-items-center">
     
      {products.map(product => (
        <Product
          key={product._id}
          title={product.title}
          imgSrc={product.images && product.images[0]} 
          price={product.price}
          discount={product.discountPercentage}
          link={`/product/${product._id}`}
          onAddToCart={() => onAddToCart(product)}
          isInCart={cart.products.some(p => p.id === product._id)}
        />					
      ))}
    </div>
  );
}
