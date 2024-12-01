import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "react-feather";
import { CartContext, UserContext } from "@/App";
import CartList from "@/ui/CartList";
import CartSummary from "@/ui/CartSummary";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import api from "@/api";
import CheckoutModal from "../components/Checkout";

export default function CartPage() {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const { user } = useContext(UserContext);
  const { cart, cartDispatch } = useContext(CartContext);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const setProductQuantity = async (product, quantity) => {
    const uniqueCartKey = product["uniqueCartKey"];
    const response = await api.checkProductQuantity(uniqueCartKey);

    if (quantity < 1) {
      if (user) {
        await api.removeProductFromCart(uniqueCartKey);
        cartDispatch({ type: "REMOVE_PRODUCT", payload: uniqueCartKey });
      } else {
        cartDispatch({ type: "REMOVE_PRODUCT", payload: uniqueCartKey });
      }
    } else {
      cartDispatch({ type: "SET_PRODUCT_QUANTITY", payload: { uniqueCartKey, quantity } });
      
      if (user) {
        await api.patchCart(uniqueCartKey, quantity);
      }
    }
  };

  if (!cart?.products?.length) {
    return (
      <div className="min-h-screen pt-16 pb-12 flex flex-col bg-white">
        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
            <div className="text-center">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
              <h2 className="mt-4 text-2xl font-medium text-gray-900">
                Your Shopping Cart is Empty
              </h2>
              <p className="mt-2 text-gray-500">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link to="/products">
                <Button variant="primary" className="mt-6 w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader title="Your Shopping Cart" />
        
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <CartList
              items={cart.products}
              setItemQuantity={setProductQuantity}
            />
          </div>

          <div className="lg:col-span-4">
            <CartSummary
              onCheckout={() => setShowCheckoutModal(true)}
              subtotal={cart.total || 0}
              charges={[{ name: "Shipping Charges", amount: cart.deliveryCharges || 250 }]}
            />
          </div>
        </div>

        {showCheckoutModal && (
          <CheckoutModal
            onClose={() => setShowCheckoutModal(false)}
            cart={cart}
            onCheckout={async () => {
              if (!user) {
                window.location.href = "/login?redirect=/cart";
                return;
              }
              try {
                await api.createOrder(cart);
                cartDispatch({ type: "CLEAR_CART" });
                setShowCheckoutModal(false);
              } catch (error) {
                console.error("Error creating order:", error);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}