"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js"
import axiosInstance from "../api/axiosInstance"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

function CheckoutFormContent({ orderId, amount, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    try {
      // Create payment intent on backend
      const { data } = await axiosInstance.post("/payments/create-payment-intent", {
        orderId,
        amount,
      })

      // Confirm payment
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {},
        },
      })

      if (stripeError) {
        setError(stripeError.message)
      } else if (paymentIntent.status === "succeeded") {
        onSuccess()
      }
    } catch (err) {
      setError(err.message || "Payment failed")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
              },
            },
          }}
        />
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
      >
        {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  )
}

export default function CheckoutForm({ orderId, amount, onSuccess }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent orderId={orderId} amount={amount} onSuccess={onSuccess} />
    </Elements>
  )
}
