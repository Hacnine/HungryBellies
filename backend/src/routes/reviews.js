import express from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middlewares/auth.js"

const router = express.Router()
const prisma = new PrismaClient()

// Submit a review
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      restaurantId,
      orderId,
      driverId,
      rating,
      foodRating,
      serviceRating,
      deliveryRating,
      title,
      comment,
      images
    } = req.body

    // Validate that user has ordered from this restaurant
    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId: req.user.userId,
          status: 'delivered'
        }
      })

      if (!order) {
        return res.status(400).json({ error: "Can only review completed orders" })
      }

      // Check if already reviewed
      const existing = await prisma.review.findFirst({
        where: {
          orderId,
          userId: req.user.userId
        }
      })

      if (existing) {
        return res.status(400).json({ error: "Order already reviewed" })
      }
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.userId,
        restaurantId,
        orderId,
        driverId,
        rating: parseFloat(rating),
        foodRating: foodRating ? parseFloat(foodRating) : null,
        serviceRating: serviceRating ? parseFloat(serviceRating) : null,
        deliveryRating: deliveryRating ? parseFloat(deliveryRating) : null,
        title,
        comment,
        images: images || []
      }
    })

    // Update restaurant rating
    if (restaurantId) {
      const reviews = await prisma.review.findMany({
        where: { restaurantId }
      })
      
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

      await prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
          rating: avgRating,
          totalRatings: reviews.length,
          totalReviews: reviews.length
        }
      })
    }

    // Update driver rating
    if (driverId) {
      const reviews = await prisma.review.findMany({
        where: { driverId }
      })
      
      const avgRating = reviews.reduce((sum, r) => sum + r.deliveryRating || r.rating, 0) / reviews.length

      await prisma.driver.update({
        where: { id: driverId },
        data: {
          rating: avgRating,
          totalRatings: reviews.length
        }
      })
    }

    // Mark order as reviewed
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          reviewed: true,
          restaurantRating: rating,
          driverRating: deliveryRating || rating
        }
      })
    }

    res.status(201).json({
      message: "Review submitted successfully",
      review
    })
  } catch (error) {
    console.error("Review submission error:", error)
    res.status(500).json({ error: "Failed to submit review" })
  }
})

// Get reviews for a restaurant
router.get("/restaurant/:restaurantId", async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {
      restaurantId: req.params.restaurantId
    }

    if (rating) {
      where.rating = parseFloat(rating)
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              profileImage: true,
              loyaltyTier: true
            }
          }
        }
      }),
      prisma.review.count({ where })
    ])

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" })
  }
})

// Get my reviews
router.get("/my", authenticate, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: {
          select: {
            name: true,
            logo: true
          }
        }
      }
    })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" })
  }
})

// Update review
router.put("/:id", authenticate, async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id }
    })

    if (!review || review.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" })
    }

    const updated = await prisma.review.update({
      where: { id: req.params.id },
      data: req.body
    })

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: "Failed to update review" })
  }
})

// Mark review as helpful
router.post("/:id/helpful", authenticate, async (req, res) => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: {
        isHelpful: { increment: 1 }
      }
    })
    res.json(review)
  } catch (error) {
    res.status(500).json({ error: "Failed to mark review as helpful" })
  }
})

// Report review
router.post("/:id/report", authenticate, async (req, res) => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: {
        isReported: true
      }
    })
    res.json({ message: "Review reported successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to report review" })
  }
})

// Restaurant owner responds to review
router.post("/:id/respond", authenticate, async (req, res) => {
  try {
    const { response } = req.body

    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
      include: {
        restaurant: true
      }
    })

    if (!review) {
      return res.status(404).json({ error: "Review not found" })
    }

    // Check if user owns the restaurant
    if (review.restaurant.ownerId !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" })
    }

    const updated = await prisma.review.update({
      where: { id: req.params.id },
      data: {
        response,
        respondedAt: new Date()
      }
    })

    res.json({
      message: "Response submitted successfully",
      review: updated
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to respond to review" })
  }
})

export default router
