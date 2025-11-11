import express from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middlewares/auth.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get my notifications
router.get("/", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {
      userId: req.user.userId
    }

    if (isRead !== undefined) {
      where.isRead = isRead === 'true'
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId: req.user.userId,
          isRead: false
        }
      })
    ])

    res.json({
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" })
  }
})

// Mark notification as read
router.patch("/:id/read", authenticate, async (req, res) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id }
    })

    if (!notification || notification.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" })
    }

    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: "Failed to update notification" })
  }
})

// Mark all as read
router.patch("/read-all", authenticate, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user.userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    res.json({ message: "All notifications marked as read" })
  } catch (error) {
    res.status(500).json({ error: "Failed to update notifications" })
  }
})

// Delete notification
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id }
    })

    if (!notification || notification.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" })
    }

    await prisma.notification.delete({
      where: { id: req.params.id }
    })

    res.json({ message: "Notification deleted" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" })
  }
})

// Helper function to send notification
export async function sendNotification(userId, type, title, message, data = {}, channels = ['in_app']) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data,
        channels,
        isSent: true,
        sentAt: new Date()
      }
    })

    // Here you would integrate with push notification services (Firebase, OneSignal, etc.)
    // For now, just create the database record

    return notification
  } catch (error) {
    console.error("Failed to send notification:", error)
    return null
  }
}

export default router
