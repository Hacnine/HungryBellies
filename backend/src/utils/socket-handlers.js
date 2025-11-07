import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

// Emit order update to all connected clients
async function emitOrderUpdate(io, orderId, updatedOrder) {
  io.to(orderId).emit("order:update", updatedOrder)
  console.log(`[Socket] Order ${orderId} updated:`, updatedOrder.status)
}

// Emit driver location update to order room
async function emitDriverLocation(io, orderId, location) {
  io.to(orderId).emit("driver:location", {
    latitude: location.latitude,
    longitude: location.longitude,
    timestamp: new Date().toISOString(),
  })
  console.log(`[Socket] Driver location updated for order ${orderId}`)
}

// Emit driver assigned notification
async function emitDriverAssigned(io, orderId, driver) {
  io.to(orderId).emit("driver:assigned", {
    driverId: driver.id,
    driverName: driver.name,
    driverPhone: driver.phone,
    vehicle: driver.vehicle,
    licensePlate: driver.licensePlate,
  })
  console.log(`[Socket] Driver ${driver.id} assigned to order ${orderId}`)
}

// Handle admin order status update with real-time notification
async function handleOrderStatusUpdate(io, orderId, newStatus) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
      steps: {
        push: { step: newStatus, timestamp: new Date().toISOString() },
      },
    },
  })

  await emitOrderUpdate(io, orderId, order)
}

// Handle driver assignment
async function handleDriverAssignment(io, orderId, driverId) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { driverId },
  })

  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
  })

  await emitDriverAssigned(io, orderId, driver)
}

export {
  emitOrderUpdate,
  emitDriverLocation,
  emitDriverAssigned,
  handleOrderStatusUpdate,
  handleDriverAssignment,
}
