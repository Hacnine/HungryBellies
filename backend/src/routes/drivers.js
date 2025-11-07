import express from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate, requireRole } from "../middlewares/auth.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get all available drivers (admin only)
router.get("/", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: "desc" },
    })
    res.json(drivers)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

// Get driver by id
router.get("/:id", authenticate, async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: req.params.id },
    })
    if (!driver) return res.status(404).json({ error: "not found" })
    res.json(driver)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

// Create driver (admin only)
router.post("/", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { name, email, phone, vehicle, licensePlate } = req.body
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "missing required fields" })
    }
    const driver = await prisma.driver.create({
      data: { name, email, phone, vehicle, licensePlate },
    })
    res.status(201).json(driver)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

// Update driver status/assignment (admin only)
router.put("/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { available, currentOrderId } = req.body
    const driver = await prisma.driver.update({
      where: { id: req.params.id },
      data: {
        ...(available !== undefined && { available }),
        ...(currentOrderId !== undefined && { currentOrderId }),
      },
    })
    res.json(driver)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

export default router
