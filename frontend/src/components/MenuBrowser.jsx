"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMenuItems } from "../store/menuSlice"
import { addToCart } from "../store/cartSlice"
import MenuCard from "./MenuCard"

export default function MenuBrowser() {
  const dispatch = useDispatch()
  const { items, categories, loading } = useSelector((state) => state.menu)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    dispatch(fetchMenuItems(selectedCategory))
  }, [selectedCategory, dispatch])

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Browse Menu</h2>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
            selectedCategory === null ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
              selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-500">Loading menu...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No items available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} onAddToCart={() => dispatch(addToCart(item))} />
          ))}
        </div>
      )}
    </div>
  )
}
