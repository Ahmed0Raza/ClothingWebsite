import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext, CartContext } from '@/App'
import RegisterForm from "@/ui/RegisterForm"
import api from '@/api'

export default function RegisterPage() {
    const {setUser} = useContext(UserContext)
    const {cart} = useContext(CartContext)
    const navigate = useNavigate()
    
    const handleRegister = async userData => {
        const resp = await api.registerUser(userData)
        if (resp.status == "ok") {
            const loginResp = await api.loginUser(userData)
            if (loginResp.status == "ok") {
                setUser(api.getUser())
                await api.createUserCart(cart.products.map(p => ({
                    productID: p.id, 
                    quantity: p.quantity
                })))

                if (cart.products.length) {
                    navigate("/cart")
                } else {
                    navigate("/account")
                }
            }
        }
        return resp
    }

    return (
        <main className="flex justify-center items-center min-h-[calc(100vh-12rem)] bg-white">
            <div className="w-full max-w-md p-8 bg-white shadow-md">
                <h3 className="text-2xl font-bold text-center mb-8 text-black">
                    Create a new account
                </h3>
                <div className="w-full">
                    <RegisterForm 
                        onSubmit={handleRegister}
                        className="w-full space-y-4"
                    />
                </div>
            </div>
        </main>
    )
}