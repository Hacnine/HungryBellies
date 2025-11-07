import express from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate, requireRole } from "../middlewares/auth.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get all orders (admin only)
router.get("/orders", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

// Get order by id (admin only)
router.get("/orders/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } })
    if (!order) return res.status(404).json({ error: "not found" })
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

// Update order status (admin only)
router.put("/orders/:id/status", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ["placed", "accepted", "preparing", "out_for_delivery", "delivered", "cancelled"]

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: "invalid status" })
    }

    const order = await prisma.order.findUnique({ where: { id: req.params.id } })
    if (!order) return res.status(404).json({ error: "not found" })

    // Add new step
    const steps = Array.isArray(order.steps) ? order.steps : []
    steps.push({
      step: status,
      timestamp: new Date().toISOString(),
    })

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status, steps },
    })

    res.json(updated)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "server error" })
  }
})

// Get dashboard stats (admin only)
router.get("/stats", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const totalOrders = await prisma.order.count()
    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
    })
    const totalUsers = await prisma.user.count()
    const totalMenuItems = await prisma.menu.count()

    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
    })

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalUsers,
      totalMenuItems,
      ordersByStatus,
    })
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

export default router
