const { PrismaClient } = require("@prisma/client")
const bcryptjs = require("bcryptjs")

const prisma = new PrismaClient()

async function seed() {
  try {
    console.log("Seeding database...")

    // Clear existing data
    await prisma.coupon.deleteMany()
    await prisma.order.deleteMany()
    await prisma.menu.deleteMany()
    await prisma.driver.deleteMany()
    await prisma.user.deleteMany()

    // Create admin user
    const adminPassword = await bcryptjs.hash("admin123", 10)
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@fooddelivery.com",
        password: adminPassword,
        role: "admin",
      },
    })
    console.log("Created admin user:", admin.email)

    // Create test user
    const userPassword = await bcryptjs.hash("user123", 10)
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "user@fooddelivery.com",
        password: userPassword,
        role: "user",
      },
    })
    console.log("Created test user:", user.email)

    // Create menu items
    const categories = ["Burgers", "Pizza", "Salads", "Desserts", "Drinks"]
    const menuItems = [
      { name: "Classic Burger", description: "Beef burger with cheese", price: 8.99, category: "Burgers" },
      { name: "Double Burger", description: "Double patty burger", price: 10.99, category: "Burgers" },
      { name: "Margherita Pizza", description: "Classic tomato and cheese", price: 12.99, category: "Pizza" },
      { name: "Pepperoni Pizza", description: "Pepperoni and cheese", price: 13.99, category: "Pizza" },
      { name: "Caesar Salad", description: "Fresh romaine and croutons", price: 7.99, category: "Salads" },
      { name: "Chocolate Cake", description: "Homemade chocolate cake", price: 5.99, category: "Desserts" },
      { name: "Coca Cola", description: "Cold soft drink", price: 2.49, category: "Drinks" },
    ]

    for (const item of menuItems) {
      await prisma.menu.create({
        data: {
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          available: true,
        },
      })
    }
    console.log("Created", menuItems.length, "menu items")

    // Create drivers
    const drivers = [
      {
        name: "John Driver",
        email: "john@drivers.com",
        phone: "555-0001",
        vehicle: "Honda Civic",
        licensePlate: "ABC123",
      },
      {
        name: "Jane Driver",
        email: "jane@drivers.com",
        phone: "555-0002",
        vehicle: "Toyota Prius",
        licensePlate: "XYZ789",
      },
    ]

    for (const driver of drivers) {
      await prisma.driver.create({
        data: {
          name: driver.name,
          email: driver.email,
          phone: driver.phone,
          vehicle: driver.vehicle,
          licensePlate: driver.licensePlate,
          available: true,
        },
      })
    }
    console.log("Created", drivers.length, "drivers")

    // Create coupons
    const coupons = [
      {
        code: "WELCOME10",
        description: "10% off for new users",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderValue: 15,
      },
      {
        code: "SAVE15",
        description: "15% off on orders over $50",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minOrderValue: 50,
      },
      { code: "FLAT5", description: "$5 off your order", discountType: "FIXED", discountValue: 5, minOrderValue: 20 },
    ]

    for (const coupon of coupons) {
      await prisma.coupon.create({
        data: {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minOrderValue: coupon.minOrderValue,
          maxUses: 100,
          active: true,
        },
      })
    }
    console.log("Created", coupons.length, "coupons")

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
