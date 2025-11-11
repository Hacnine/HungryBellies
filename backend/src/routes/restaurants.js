import express from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate, authorizeRoles } from "../middlewares/auth.js"

const router = express.Router()
const prisma = new PrismaClient()

// ============= PUBLIC ROUTES =============

// Get all restaurants with filters
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      cuisine,
      priceRange,
      rating,
      isVegetarian,
      isVegan,
      isHalal,
      isFeatured,
      search,
      sortBy = "rating"
    } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    // Build filter
    const where = {
      isActive: true,
      isOpen: true
    }

    if (cuisine) where.cuisine = { hasSome: cuisine.split(',') }
    if (priceRange) where.priceRange = priceRange
    if (rating) where.rating = { gte: parseFloat(rating) }
    if (isVegetarian === 'true') where.isVegetarian = true
    if (isVegan === 'true') where.isVegan = true
    if (isHalal === 'true') where.isHalal = true
    if (isFeatured === 'true') where.isFeatured = true
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Sorting
    const orderBy = {}
    if (sortBy === 'rating') orderBy.rating = 'desc'
    else if (sortBy === 'totalOrders') orderBy.totalOrders = 'desc'
    else if (sortBy === 'newest') orderBy.createdAt = 'desc'

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          logo: true,
          coverImage: true,
          cuisine: true,
          priceRange: true,
          rating: true,
          totalRatings: true,
          deliveryFee: true,
          minOrderAmount: true,
          avgDeliveryTime: true,
          isVegetarian: true,
          isVegan: true,
          isHalal: true,
          isFeatured: true,
          features: true,
          tags: true
        }
      }),
      prisma.restaurant.count({ where })
    ])

    res.json({
      restaurants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    res.status(500).json({ error: "Failed to fetch restaurants" })
  }
})

// Get featured restaurants
router.get("/featured", async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        isFeatured: true
      },
      orderBy: { rating: 'desc' },
      take: 10
    })
    res.json(restaurants)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured restaurants" })
  }
})

// Get restaurant by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: req.params.slug },
      include: {
        foodItems: {
          where: { isActive: true, isAvailable: true },
          orderBy: { orderCount: 'desc' }
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true, profileImage: true }
            }
          }
        }
      }
    })

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    res.json(restaurant)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant" })
  }
})

// Get restaurant menu
router.get("/:id/menu", async (req, res) => {
  try {
    const { category, isVegetarian, isVegan, isGlutenFree, search } = req.query

    const where = {
      restaurantId: req.params.id,
      isActive: true,
      isAvailable: true
    }

    if (category) where.category = category
    if (isVegetarian === 'true') where.isVegetarian = true
    if (isVegan === 'true') where.isVegan = true
    if (isGlutenFree === 'true') where.isGlutenFree = true
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const foodItems = await prisma.foodItem.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { orderCount: 'desc' }
      ]
    })

    res.json(foodItems)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu" })
  }
})

// ============= OWNER ROUTES =============

// Create restaurant (Restaurant Owner)
router.post("/", authenticate, authorizeRoles("restaurant_owner", "admin"), async (req, res) => {
  try {
    const {
      name,
      description,
      logo,
      coverImage,
      phone,
      email,
      address,
      cuisine,
      priceRange,
      operatingHours,
      deliveryFee,
      minOrderAmount,
      features,
      businessLicense,
      foodLicense,
      taxId
    } = req.body

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    const restaurant = await prisma.restaurant.create({
      data: {
        ownerId: req.user.userId,
        name,
        slug,
        description,
        logo,
        coverImage,
        phone,
        email,
        address,
        cuisine,
        priceRange,
        operatingHours,
        deliveryFee: parseFloat(deliveryFee) || 2.99,
        minOrderAmount: parseFloat(minOrderAmount) || 10,
        features: features || [],
        businessLicense,
        foodLicense,
        taxId,
        isActive: false, // Requires admin approval
        isVerified: false
      }
    })

    res.status(201).json({
      message: "Restaurant created successfully. Awaiting admin approval.",
      restaurant
    })
  } catch (error) {
    console.error("Restaurant creation error:", error)
    res.status(500).json({ error: "Failed to create restaurant" })
  }
})

// Update restaurant (Owner or Admin)
router.put("/:id", authenticate, authorizeRoles("restaurant_owner", "admin"), async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.params.id }
    })

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    // Check ownership (unless admin)
    if (req.user.role !== "admin" && restaurant.ownerId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" })
    }

    const updated = await prisma.restaurant.update({
      where: { id: req.params.id },
      data: req.body
    })

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: "Failed to update restaurant" })
  }
})

// Get my restaurants (Owner)
router.get("/my/restaurants", authenticate, authorizeRoles("restaurant_owner"), async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { ownerId: req.user.userId },
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
            foodItems: true
          }
        }
      }
    })
    res.json(restaurants)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurants" })
  }
})

// Get restaurant analytics (Owner)
router.get("/:id/analytics", authenticate, authorizeRoles("restaurant_owner", "admin"), async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const where = {
      restaurantId: req.params.id
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const [
      totalOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      avgOrderValue,
      topItems
    ] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.count({ where: { ...where, status: 'delivered' } }),
      prisma.order.count({ where: { ...where, status: 'cancelled' } }),
      prisma.order.aggregate({
        where: { ...where, status: 'delivered' },
        _sum: { total: true }
      }),
      prisma.order.aggregate({
        where: { ...where, status: 'delivered' },
        _avg: { total: true }
      }),
      prisma.foodItem.findMany({
        where: { restaurantId: req.params.id },
        orderBy: { orderCount: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          orderCount: true,
          image: true,
          price: true
        }
      })
    ])

    res.json({
      totalOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      avgOrderValue: avgOrderValue._avg.total || 0,
      topItems
    })
  } catch (error) {
    console.error("Analytics error:", error)
    res.status(500).json({ error: "Failed to fetch analytics" })
  }
})

// ============= ADMIN ROUTES =============

// Approve/Verify restaurant (Admin only)
router.patch("/:id/verify", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const { isVerified, isActive } = req.body

    const restaurant = await prisma.restaurant.update({
      where: { id: req.params.id },
      data: {
        isVerified: isVerified !== undefined ? isVerified : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    })

    res.json({
      message: "Restaurant status updated",
      restaurant
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to update restaurant status" })
  }
})

export default router
