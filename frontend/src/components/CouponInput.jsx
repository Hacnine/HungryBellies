"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { validateCoupon } from "../store/couponSlice"

export function CouponInput({ orderTotal, onApply }) {
  const [code, setCode] = useState("")
  const dispatch = useDispatch()
  const { applied, error, loading } = useSelector((state) => state.coupons)

  const handleApply = async () => {
    if (!code.trim()) return
    const result = await dispatch(validateCoupon({ code, orderTotal }))
    if (result.payload) {
      onApply(result.payload)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-medium mb-3">Apply Coupon Code</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 border rounded"
          disabled={loading || !!applied}
        />
        <button
          onClick={handleApply}
          disabled={loading || !!applied}
          className="px-4 py-2 bg-checkout-yellow text-black rounded hover:bg-yellow-400 disabled:bg-gray-400"
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>

      {applied && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">{applied.description}</p>
          <p className="text-sm text-green-700">
            Discount: ${applied.discountAmount.toFixed(2)} → Final: ${applied.finalAmount.toFixed(2)}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
