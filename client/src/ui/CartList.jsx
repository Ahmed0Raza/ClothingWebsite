import React from 'react'

import CartItem from "@/components/CartItem"

export default function CartList({ items, setItemQuantity }) {
	return (
		<>
		 
			{items.map(item => (
				<CartItem 
				key={item.uniqueCartKey} // Add unique key here
				cartkey={item.uniqueCartKey}
				imgSrc={item.image} 
				name={item.title} 
				price={item.price}
				discount={item.discountPercentage}
				size={item.size}
				color={item.color} 
				quantity={item.quantity}
				setQuantity={qty => setItemQuantity(item, qty)}
			/>
			
			))}
		</>
	)
}
