"use client"

import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import MenuBrowser from "../components/MenuBrowser"
import CartSidebar from "../components/CartSidebar"

export default function HomePage() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Food Delivery</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.name}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{user?.role}</span>
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MenuBrowser />
          </div>
          <div>
            <CartSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
