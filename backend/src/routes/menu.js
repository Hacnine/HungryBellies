import express from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate, requireRole } from "../middlewares/auth.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get all menu items
router.get("/", async (req, res) => {
  try {
    const { category } = req.query
    const where = category ? { category } : {}
    const items = await prisma.menu.findMany({ where, orderBy: { createdAt: "desc" } })
    res.json(items)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "server error" })
  }
})

// Get single menu item
router.get("/:id", async (req, res) => {
  try {
    const item = await prisma.menu.findUnique({ where: { id: req.params.id } })
    if (!item) return res.status(404).json({ error: "not found" })
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

// Create menu item (admin only)
router.post("/", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body
    if (!name || !price || !category) {
      return res.status(400).json({ error: "missing fields" })
    }
    const item = await prisma.menu.create({
      data: { name, description, price: Number.parseFloat(price), category, image, available: true },
    })
    res.status(201).json(item)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

// Update menu item (admin only)
router.put("/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { name, description, price, category, available } = req.body
    const item = await prisma.menu.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: Number.parseFloat(price) }),
        ...(category && { category }),
        ...(available !== undefined && { available }),
      },
    })
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

// Delete menu item (admin only)
router.delete("/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    await prisma.menu.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

export default router
