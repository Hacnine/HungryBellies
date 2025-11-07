"use client"

export default function MenuCard({ item, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {item.image && (
        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-40 object-cover" />
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
        {item.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>}
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</span>
          <button
            onClick={onAddToCart}
            disabled={!item.available}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition"
          >
            {item.available ? "Add" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  )
}
