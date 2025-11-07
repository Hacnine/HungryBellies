import { useOrderSocket } from "../hooks/useOrderSocket"
import OrderStepper from "./OrderStepper"

export default function LiveOrderTracking({ orderId, initialOrder }) {
  const { order, driver, driverLocation, isConnected } = useOrderSocket(orderId)
  const displayOrder = order || initialOrder

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div
        className={`p-3 rounded-lg text-sm font-medium ${
          isConnected ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
        }`}
      >
        {isConnected ? "🔴 Live Updates Enabled" : "⚪ Connecting..."}
      </div>

      {/* Order Status Stepper */}
      {displayOrder && (
        <div className="bg-gray-50 rounded-lg p-6">
          <OrderStepper order={displayOrder} />
        </div>
      )}

      {/* Driver Info */}
      {driver && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Driver Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-700">Name:</span>
              <span className="font-bold">{driver.driverName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Phone:</span>
              <span className="font-bold">{driver.driverPhone}</span>
            </div>
            {driver.vehicle && (
              <div className="flex justify-between">
                <span className="text-blue-700">Vehicle:</span>
                <span className="font-bold">{driver.vehicle}</span>
              </div>
            )}
            {driver.licensePlate && (
              <div className="flex justify-between">
                <span className="text-blue-700">License Plate:</span>
                <span className="font-bold">{driver.licensePlate}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Driver Location */}
      {driverLocation && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-purple-900 mb-2">Driver Location</h3>
          <p className="text-sm text-purple-700">
            Latitude: {driverLocation.latitude.toFixed(4)}, Longitude: {driverLocation.longitude.toFixed(4)}
          </p>
          <p className="text-xs text-purple-600 mt-2">
            Updated: {new Date(driverLocation.timestamp).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  )
}
