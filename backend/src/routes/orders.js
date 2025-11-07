import express from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middlewares/auth.js"

const router = express.Router()
const prisma = new PrismaClient()

// Place order
router.post("/", authenticate, async (req, res) => {
  try {
    const { items, total } = req.body
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "invalid items" })
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        items,
        total: Number.parseFloat(total),
        status: "placed",
        steps: [
          {
            step: "placed",
            timestamp: new Date().toISOString(),
          },
        ],
      },
    })

    res.status(201).json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "server error" })
  }
})

// Get user orders
router.get("/", authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
    })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

// Get order by id
router.get("/:id", authenticate, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } })
    if (!order) return res.status(404).json({ error: "not found" })
    if (order.userId !== req.user.userId) return res.status(403).json({ error: "forbidden" })
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

export default router
