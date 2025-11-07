import express from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate, requireRole } from "../middlewares/auth.js"

const router = express.Router()
const prisma = new PrismaClient()

// Admin: Create coupon
router.post("/create", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { code, description, discountType, discountValue, maxUses, expiresAt, minOrderValue } = req.body

    if (!code || !discountType || !discountValue) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        maxUses,
        usedCount: 0,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        minOrderValue: minOrderValue || 0,
        active: true,
      },
    })

    res.json(coupon)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Admin: Get all coupons
router.get("/list", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    })
    res.json(coupons)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Admin: Update coupon
router.put("/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params
    const { active, maxUses } = req.body

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...(active !== undefined && { active }),
        ...(maxUses !== undefined && { maxUses }),
      },
    })

    res.json(coupon)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Admin: Delete coupon
router.delete("/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params
    await prisma.coupon.delete({ where: { id } })
    res.json({ message: "Coupon deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Public: Validate coupon for checkout
router.post("/validate", async (req, res) => {
  try {
    const { code, orderTotal } = req.body

    if (!code) {
      return res.status(400).json({ error: "Coupon code required" })
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" })
    }

    if (!coupon.active) {
      return res.status(400).json({ error: "Coupon is inactive" })
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({ error: "Coupon has expired" })
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ error: "Coupon usage limit reached" })
    }

    if (orderTotal < coupon.minOrderValue) {
      return res.status(400).json({
        error: `Minimum order value required: $${coupon.minOrderValue}`,
      })
    }

    let discountAmount = 0
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (orderTotal * coupon.discountValue) / 100
    } else if (coupon.discountType === "FIXED") {
      discountAmount = coupon.discountValue
    }

    const finalAmount = Math.max(0, orderTotal - discountAmount)

    res.json({
      valid: true,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalAmount,
      description: coupon.description,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
