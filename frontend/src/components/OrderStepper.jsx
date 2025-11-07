const STATUS_STEPS = ["placed", "accepted", "preparing", "out_for_delivery", "delivered"]

export default function OrderStepper({ order }) {
  const currentIndex = STATUS_STEPS.indexOf(order.status)
  const steps = Array.isArray(order.steps) ? order.steps : []

  const getStepTimestamp = (stepName) => {
    const step = steps.find((s) => s.step === stepName)
    return step ? new Date(step.timestamp).toLocaleString() : null
  }

  return (
    <div className="py-6">
      <div className="flex items-center">
        {STATUS_STEPS.map((status, idx) => {
          const isCompleted = idx <= currentIndex
          const isCurrent = idx === currentIndex

          return (
            <div key={status} className="flex items-center flex-1">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                } ${isCurrent ? "ring-2 ring-blue-400" : ""}`}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>

              {/* Line */}
              {idx < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 transition ${idx < currentIndex ? "bg-green-500" : "bg-gray-300"}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Labels & Times */}
      <div className="flex justify-between mt-4 text-sm">
        {STATUS_STEPS.map((status) => (
          <div key={status} className="text-center flex-1">
            <p className="font-medium capitalize text-gray-900">{status.replace(/_/g, " ")}</p>
            <p className="text-xs text-gray-500">{getStepTimestamp(status) ? getStepTimestamp(status) : "-"}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
