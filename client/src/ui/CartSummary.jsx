import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from "@/App"
import Input from "@/components/Input"
import Button from "@/components/Button"
import { Link, useLocation } from 'react-router-dom'

export default function CartSummary({ subtotal, charges, onCheckout }) {
    const [coupon, setCoupon] = useState('')
    const [appliedDiscount, setAppliedDiscount] = useState(0)
    const [isCouponApplied, setIsCouponApplied] = useState(false)
    const location = useLocation()

    const { cart } = useContext(CartContext)

    const chargesTotal = charges.reduce((sum, c) => sum + c.amount, 0)

    const handleApplyCoupon = () => {
        if (coupon.toUpperCase() === "FREESHIPPING" && !isCouponApplied) {
            cart.deliveryCharges = 0
            setAppliedDiscount(250)
            setIsCouponApplied(true)
        } else {
            cart.deliveryCharges = 250
        }
    }

    useEffect(() => {
        cart.deliveryCharges = 250
    }, [cart])

    const isCheckoutPage = location.pathname.includes('/checkout')

    return (
        <div className="bg-white border border-gray-200 p-6 w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-black mb-4 uppercase">
                Cart Summary
            </h2>

            {isCheckoutPage && (
                <div className="text-sm text-gray-500 italic mb-4">
                    Hint: Use "FREESHIPPING" coupon for free delivery
                </div>
            )}

            <div className="space-y-3">
                <div className="flex justify-between text-black">
                    <span>Subtotal</span>
                    <span className="font-medium">PKR {subtotal.toLocaleString()}</span>
                </div>

                {charges.map(charge => (
                    <div key={charge.name} className="flex justify-between text-gray-700">
                        <span>{charge.name}</span>
                        <span>PKR {charge.amount.toLocaleString()}</span>
                    </div>
                ))}

                {isCouponApplied && (
                    <div className="flex justify-between text-green-600">
                        <span>Free Shipping Discount</span>
                        <span>-PKR {appliedDiscount.toLocaleString()}</span>
                    </div>
                )}

                <div className="flex justify-between text-lg font-semibold text-black border-t border-gray-200 pt-4">
                    <span>Total</span>
                    <span>PKR {(subtotal + chargesTotal - appliedDiscount).toLocaleString()}</span>
                </div>
            </div>

            {isCheckoutPage && (
                <div className="mt-6 flex space-x-3">
                    <Input
                        placeholder="Enter Coupon Code"
                        className="flex-grow"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        disabled={isCouponApplied}
                    />
                    <Button
                        className="px-4 border border-black text-black bg-transparent hover:bg-gray-200"
                        onClick={handleApplyCoupon}
                        disabled={isCouponApplied || coupon === ''}
                    >
                        {isCouponApplied ? 'Applied' : 'Apply'}
                    </Button>
                </div>
            )}

            {!isCheckoutPage && (
                <Link
                    to={{
                        pathname: "/checkout",
                        state: { subtotal, charges },
                    }}
                    className="block mt-6"
                >
                    <Button
                        className="w-full py-3 text-lg border border-black text-white bg-black hover:bg-gray-200"
                        onClick={onCheckout}
                    >
                        Proceed to Checkout
                    </Button>
                </Link>
            )}
        </div>
    )
}
