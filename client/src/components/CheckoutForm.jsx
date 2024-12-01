import React, { useState, useEffect } from 'react'
import api from '../api'
import Button from './Button'
import Loader from "./Loader"
import { CheckCircle, ChevronRight, X } from 'react-feather'
import { Link } from 'react-router-dom'

export default function CheckoutForm({onCancel, onSuccess}) {
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [orderDetails, setOrderDetails] = useState({})

  useEffect(() => {
    // Fetch order details as soon as the page loads
    (async () => {
      const resp = await api.proceedCheckout()
     if (resp.status !== "error") {
        setOrderDetails(resp.finalOrder)
      }
    })()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    // Simulate payment processing delay
    setTimeout(() => {
      setProcessing(false)
      setSucceeded(true)
      onSuccess()
    }, 2000) // Simulate 2s delay for demo purposes
  }

  if (succeeded) {
    return (
      <div className='flex flex-col items-center'>
        <CheckCircle className='w-20 h-20 text-green-400' />
        <p className='text-lg font-light my-4'>Order Placed Successfully</p>
        <Link to="/orders">
          <Button link>
            <span>Go to Orders</span>
            <ChevronRight className='ml-2' />
          </Button>
        </Link>
        <Button secondary onClick={onCancel}>Close</Button>
      </div>
    )
  }

  return (
    <div>
      <section className='mb-6'>
        {orderDetails?.amount && 
          <div className='flex justify-between text-lg mt-2'>
            <h4 className='text-lg mb-2'>Final Order</h4>
            <span className='font-bold text-xl'>${orderDetails.amount}</span>
          </div>
        }
        {orderDetails?.products?.length ?
          <ul>
            {orderDetails.products.map(product => (
              <CheckoutItem 
                key={product.productID._id}
                title={product.productID.title} 
                price={product.productID.price} 
                quantity={product.quantity} 
              />
            ))}
          </ul>
          : <Loader color="bg-gray-600" />
        }
      </section>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="text-red-400 mt-2" role="alert">
            {error}
          </div>
        )}
        <Button className="w-full mt-6" disabled={processing || succeeded}>
          {processing ? <Loader /> : <span>Make Payment</span>}
        </Button>
        <Button className="w-full" secondary onClick={onCancel}>Cancel</Button>
      </form>
    </div>
  )
}

function CheckoutItem({title, price, quantity}) {
  return (
    <li className='flex justify-between'>
      <p>{title}</p>
      <div className='flex justify-between items-center'>
        {quantity > 1 &&
          <span className='inline-flex items-center text-gray-400 mr-5'>
            <X className='' />
            {quantity}
          </span>
        }
        <span className='text-lg font-light'>${quantity * price}</span>
      </div>
    </li>
  )
}
