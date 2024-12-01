import React, { useState, useContext } from "react";
import CartSummary from "@/ui/CartSummary";
import { CartContext } from "@/App";
import api from "@/api";
import { useNavigate } from "react-router-dom";

const pakistanCities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", 
  "Gujranwala", "Peshawar", "Quetta", "Hyderabad", "Bahawalpur", "Sargodha", 
  "Sialkot", "Sukkur", "Larkana", "Sheikhupura", "Rahim Yar Khan", "Gujrat", 
  "Jhang", "Kasur", "Mardan", "Mingora", "Okara", "Dera Ghazi Khan", 
  "Mirpur Khas", "Chiniot", "Nawabshah", "Kamoke", "Mandi Bahauddin", "Jacobabad"
];

export default function CheckoutPage() {
  const { cart, cartDispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    newsletter: false,
    city: "",
    country: "Pakistan",
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    phone: "",
    paymentMethod: "COD",
    billingSameAsShipping: true,
    billingAddress: "",
  });

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleCreateOrder = async () => {
    //console.log("chekout", cart.products)
    try {
      const address = `${formData.address}, ${formData.city}, ${formData.country}, ${formData.postalCode}`;
      const amount = cart.total + (cart.deliveryCharges || 0);
      const contact = formData.phone;
      //console.log("checkkout",cart.products)
      const resp = await api.createOrder(
        formData.firstName,
        formData.lastName,
        cart.products,
        amount,
        contact,
        address
      );
      const productIds = cart.products.map((product) => {
        const size = product.size || "defaultSize"; // Handle if size is not present
        const color = product.color || "defaultColor"; // Handle if color is not present
        const quantity = product.quantity || 1; // Default to 1 if quantity is not present
        
        return `${product.id}-${size}-${color}-${quantity}`;
      });
      
      //console.log(productIds); // This will output an array in the form of ["id1-Small-Red-2", "id2-Medium-Blue-1", ...]
            
      // ------------------reduce
      if (resp.status === "ok") {
        await api.updateProductQuantity(productIds);
        api.clearCart();
        cartDispatch({ type: "RESET" });
        setOrderSuccess(true);
        setTimeout(() => {
          navigate("/cart", { state: { message: "Your order has been placed!" } });
        }, 2000);
      } else {
        setError("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      setError("An unexpected error occurred.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    handleCreateOrder();
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white text-black">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Details Form */}
        <div className="bg-white">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Customer Details</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Contact Section */}
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border-b border-black py-2 mb-4 focus:outline-none"
              />
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-black">Email me with news and offers</span>
              </label>

              {/* Delivery Section */}
              <h3 className="text-lg font-medium mb-4">Delivery</h3>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border-b border-black py-2 mb-4 focus:outline-none"
                required
              >
                <option value="">Select city</option>
                {pakistanCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full border-b border-black py-2 mb-4 bg-gray-100"
                disabled
              />
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-1/2 border-b border-black py-2 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-1/2 border-b border-black py-2 focus:outline-none"
                  required
                />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border-b border-black py-2 mb-4 focus:outline-none"
                required
              />
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-1/2 border-b border-black py-2 focus:outline-none"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-1/2 border-b border-black py-2 focus:outline-none"
                  required
                />
              </div>

              {/* Payment Section */}
              <h3 className="text-lg font-medium mb-4">Payment</h3>
              <div className="space-y-2 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked={formData.paymentMethod === "Card"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>Debit - Credit Card</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white font-semibold py-2 px-4 hover:bg-gray-800 transition duration-300"
              >
                Complete Order
              </button>
            </form>
          </div>
        </div>

        {/* Cart Summary Section */}
        <div>
          <div className="sticky top-8">
            <CartSummary
              onCheckout={() => {}}
              subtotal={cart.total}
              charges={[{ name: "Shipping Charges", amount: 250 }]}
              discounts={[{ name: "Shipping Discount", amount: 0 }]}
            />
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6">
            <h2 className="text-xl font-semibold mb-4">Order Confirmation</h2>
            <p className="mb-4">Your order has been placed!</p>
            <button
              onClick={() => setOrderSuccess(false)}
              className="w-full bg-black text-white font-semibold py-2 px-4 hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
