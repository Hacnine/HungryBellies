"use client"

import { useSelector, useDispatch } from "react-redux"
import { removeFromCart, updateQuantity } from "../store/cartSlice"
import { useNavigate } from "react-router-dom"

export default function CartSidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total } = useSelector((state) => state.cart)

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Cart is empty</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Cart Summary</h3>

      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                className="px-2 py-1 bg-gray-200 rounded text-sm"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                className="px-2 py-1 bg-gray-200 rounded text-sm"
              >
                +
              </button>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="px-2 py-1 bg-red-200 text-red-700 rounded text-sm ml-2"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
      >
        Proceed to Checkout
      </button>
    </div>
  )
}
