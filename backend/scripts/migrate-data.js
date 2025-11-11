import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function migrateData() {
  console.log("🚀 Starting data migration to comprehensive schema...")
  console.log("")

  try {
    // 1. Migrate Users - Add new fields
    console.log("📊 Migrating users...")
    const users = await prisma.user.findMany()
    let userCount = 0

    for (const user of users) {
      // Generate unique referral code
      const referralCode = `${user.name.substring(0, 4).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          referralCode,
          loyaltyPoints: 0,
          loyaltyTier: 'Bronze',
          walletBalance: 0,
          emailVerified: false,
          phoneVerified: false,
          isActive: true,
          phone: user.phone || null,
          profileImage: null,
          dateOfBirth: null,
          lastLogin: null,
          preferences: null,
          socialLogin: null
        }
      })
      userCount++
    }
    console.log(`✅ Migrated ${userCount} users with loyalty and wallet features`)
    console.log("")

    // 2. Create default restaurant for existing menu items
    console.log("🏪 Creating default restaurant...")
    const adminUser = users.find(u => u.role === 'admin') || users[0]
    
    const defaultRestaurant = await prisma.restaurant.create({
      data: {
        ownerId: adminUser.id,
        name: "HungryBelly Main Kitchen",
        slug: "hungrybelly-main-kitchen",
        description: "Our flagship restaurant serving delicious food from various cuisines",
        logo: "/icon/logo.png",
        coverImage: "/featured/featured1.jpg",
        phone: "+1234567890",
        email: "kitchen@hungrybelly.com",
        address: {
          street: "123 Main Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
          latitude: 40.7128,
          longitude: -74.0060
        },
        cuisine: ["American", "Italian", "Asian", "Mexican"],
        priceRange: "$$",
        operatingHours: {
          monday: { open: "09:00", close: "22:00", isOpen: true },
          tuesday: { open: "09:00", close: "22:00", isOpen: true },
          wednesday: { open: "09:00", close: "22:00", isOpen: true },
          thursday: { open: "09:00", close: "22:00", isOpen: true },
          friday: { open: "09:00", close: "23:00", isOpen: true },
          saturday: { open: "10:00", close: "23:00", isOpen: true },
          sunday: { open: "10:00", close: "21:00", isOpen: true }
        },
        deliveryFee: 3.99,
        minOrderAmount: 10.00,
        maxDeliveryDistance: 10,
        avgDeliveryTime: 30,
        rating: 4.5,
        totalRatings: 0,
        totalReviews: 0,
        totalOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        isOpen: true,
        isVegetarian: false,
        isVegan: false,
        isHalal: false,
        features: ["Free WiFi", "Parking Available", "Outdoor Seating", "Takeout"],
        tags: ["Popular", "Fast Delivery", "Family Friendly"],
        deliveryZones: []
      }
    })
    console.log(`✅ Created default restaurant: ${defaultRestaurant.name}`)
    console.log("")

    // 3. Migrate Menu items to FoodItem model
    console.log("🍔 Migrating menu items to FoodItem model...")
    const existingMenuItems = await prisma.menu.findMany()
    let foodItemCount = 0

    for (const item of existingMenuItems) {
      await prisma.foodItem.create({
        data: {
          restaurantId: defaultRestaurant.id,
          createdBy: adminUser.id,
          name: item.name,
          description: item.description || "Delicious food item",
          image: item.image,
          images: item.image ? [item.image] : [],
          category: item.category || "Main Course",
          subcategory: null,
          tags: [],
          cuisine: null,
          price: item.price,
          originalPrice: null,
          discount: 0,
          isOnSale: false,
          nutrition: null,
          ingredients: null,
          allergens: [],
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          isHalal: false,
          spiceLevel: null,
          stock: 100,
          isAvailable: item.available,
          isActive: true,
          preparationTime: 20,
          servingSize: "1 person",
          addons: null,
          customizations: null,
          rating: 4.0,
          totalRatings: 0,
          isFeatured: false,
          isPopular: false,
          orderCount: 0
        }
      })
      foodItemCount++
    }
    console.log(`✅ Migrated ${foodItemCount} menu items`)
    console.log("")

    // 4. Migrate existing Orders
    console.log("📦 Migrating orders...")
    const orders = await prisma.order.findMany()
    let orderCount = 0

    for (const order of orders) {
      // Generate order number if missing
      const date = new Date(order.createdAt)
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      const orderNumber = order.orderNumber || `ORD-${dateStr}-${randomNum}`

      await prisma.order.update({
        where: { id: order.id },
        data: {
          orderNumber,
          restaurantId: defaultRestaurant.id,
          subtotal: order.total || 0,
          deliveryFee: 3.99,
          serviceFee: 0,
          tax: (order.total || 0) * 0.08,
          discount: 0,
          tip: 0,
          paymentMethod: order.paid ? 'card' : 'cash',
          paymentStatus: order.paid ? 'completed' : 'pending',
          transactionId: null,
          estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000),
          actualDeliveryTime: order.status === 'delivered' ? order.updatedAt : null,
          deliveryInstructions: null,
          contactless: false,
          restaurantRating: null,
          driverRating: null,
          reviewed: false,
          cancelledAt: order.status === 'cancelled' ? order.updatedAt : null,
          cancelledBy: order.status === 'cancelled' ? 'user' : null,
          cancellationReason: null,
          refundAmount: null,
          refundStatus: null,
          scheduledFor: null
        }
      })
      orderCount++
    }
    console.log(`✅ Migrated ${orderCount} orders`)
    console.log("")

    // 5. Migrate Drivers
    console.log("🚗 Migrating drivers...")
    const drivers = await prisma.driver.findMany()
    let driverCount = 0

    for (const driver of drivers) {
      await prisma.driver.update({
        where: { id: driver.id },
        data: {
          userId: null,
          profileImage: null,
          dateOfBirth: null,
          vehicleModel: null,
          vehicleColor: null,
          driverLicense: null,
          vehicleRegistration: null,
          insurance: null,
          documentsVerified: false,
          onlineStatus: driver.available ? 'online' : 'offline',
          currentLocation: null,
          totalRatings: 0,
          totalOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
          acceptanceRate: 100,
          totalEarnings: 0,
          pendingEarnings: 0,
          availableBalance: 0,
          workingHours: null,
          preferredZones: [],
          isActive: true,
          isVerified: false,
          joinedAt: driver.createdAt,
          lastActiveAt: null
        }
      })
      driverCount++
    }
    console.log(`✅ Migrated ${driverCount} drivers`)
    console.log("")

    // 6. Create sample promotions
    console.log("🎁 Creating sample promotions...")
    await prisma.promotion.create({
      data: {
        restaurantId: defaultRestaurant.id,
        title: "Welcome Bonus",
        description: "Get 20% off on your first order!",
        image: null,
        promoCode: "WELCOME20",
        discountType: "percentage",
        discountValue: 20,
        maxDiscount: 10,
        minOrderAmount: 15,
        maxUsesPerUser: 1,
        totalMaxUses: 1000,
        usedCount: 0,
        targetUserTier: ["Bronze", "Silver", "Gold", "Platinum"],
        isGlobal: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        isActive: true
      }
    })
    console.log(`✅ Created sample promotions`)
    console.log("")

    // 7. Initialize analytics
    console.log("📈 Initializing analytics...")
    const today = new Date()
    const completedOrders = await prisma.order.findMany({
      where: { status: 'delivered' }
    })
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0)

    await prisma.analytics.create({
      data: {
        date: today,
        period: 'daily',
        totalRevenue,
        totalOrders: completedOrders.length,
        avgOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
        newUsers: users.length,
        activeUsers: users.length,
        returningUsers: 0,
        activeRestaurants: 1,
        activeDrivers: drivers.length,
        avgDeliveryTime: 30,
        topRestaurants: [{
          restaurantId: defaultRestaurant.id,
          name: defaultRestaurant.name,
          revenue: totalRevenue,
          orders: completedOrders.length
        }],
        topFoodItems: []
      }
    })
    console.log(`✅ Analytics initialized`)
    console.log("")

    console.log("🎉 Data migration completed successfully!")
    console.log("")
    console.log("📋 Migration Summary:")
    console.log(`   - Users migrated: ${userCount}`)
    console.log(`   - Restaurants created: 1`)
    console.log(`   - Food items migrated: ${foodItemCount}`)
    console.log(`   - Orders migrated: ${orderCount}`)
    console.log(`   - Drivers migrated: ${driverCount}`)
    console.log("")
    console.log("🚀 Next steps:")
    console.log("   1. Run 'npx prisma studio' to verify data")
    console.log("   2. Test the API endpoints")
    console.log("   3. Update frontend to use new features")
    console.log("   4. Train users on new features")

  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  }
}

migrateData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
