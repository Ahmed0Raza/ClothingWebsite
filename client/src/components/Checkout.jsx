import React from 'react'
import clsx from "clsx"

import CheckoutForm from "./CheckoutForm"
import PageHeader from './PageHeader';

export default function CheckoutModal({ onCancel, onSuccess }) {
  return (
    <div className={clsx(
      "fixed inset-0 z-40 overflow-auto",
      "flex justify-center items-center",
      "w-screen h-screen bg-black/40",
    )}>
      <div className={clsx(
        "relative w-full max-w-md",
        "p-4 m-auto rounded-lg shadow-lg",
        "bg-gray-200 text-gray-800/80",
      )}>
        <PageHeader h3>Checkout</PageHeader>
        <hr className="w-full border-1 rounded-full border-gray-500/10 my-3" />
        <section className="flex flex-col">
          <CheckoutForm onCancel={onCancel} onSuccess={onSuccess} />
        </section>
      </div>
    </div>
  )
}
