import { PrismaClient } from "@prisma/client"
import bcryptjs from "bcryptjs"

const prisma = new PrismaClient()

// Helper function to generate referral code
function generateReferralCode(name) {
  return name.toUpperCase().replace(/\s/g, '').slice(0, 4) + Math.random().toString(36).slice(2, 6).toUpperCase()
}

async function seed() {
  try {
    console.log("🌱 Starting database seed...")

    // Clear existing data in correct order (reverse of creation dependencies)
    console.log("🧹 Cleaning existing data...")
    await prisma.analytics.deleteMany()
    await prisma.driverEarning.deleteMany()
    await prisma.favoriteRestaurant.deleteMany()
    await prisma.promotion.deleteMany()
    await prisma.loyaltyTransaction.deleteMany()
    await prisma.walletTransaction.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.review.deleteMany()
    await prisma.inventory.deleteMany()
    await prisma.deliveryZone.deleteMany()
    await prisma.coupon.deleteMany()
    await prisma.order.deleteMany()
    await prisma.menu.deleteMany()
    await prisma.foodItem.deleteMany()
    await prisma.driver.deleteMany()
    await prisma.restaurant.deleteMany()
    await prisma.address.deleteMany() // Delete addresses before users
    await prisma.user.deleteMany()
    console.log("✅ Cleaned existing data")

    console.log("✅ Cleaned existing data")

    // ==================== CREATE USERS ====================
    console.log("\n👥 Creating users...")
    const adminPassword = await bcryptjs.hash("admin123", 10)
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@hungrybelly.com",
        password: adminPassword,
        role: "admin",
        phone: "555-0000",
        loyaltyPoints: 0,
        loyaltyTier: "Bronze",
        walletBalance: 0,
        referralCode: generateReferralCode("Admin"),
      },
    })
    console.log("✓ Created admin:", admin.email)

    // Create restaurant owners
    const ownerPassword = await bcryptjs.hash("owner123", 10)
    const owners = await Promise.all([
      prisma.user.create({
        data: {
          name: "Mario Rossi",
          email: "mario@restaurants.com",
          password: ownerPassword,
          role: "restaurant_owner",
          phone: "555-1001",
          loyaltyPoints: 0,
          loyaltyTier: "Bronze",
          walletBalance: 5000,
          referralCode: generateReferralCode("Mario Rossi"),
        },
      }),
      prisma.user.create({
        data: {
          name: "Chen Wei",
          email: "chen@restaurants.com",
          password: ownerPassword,
          role: "restaurant_owner",
          phone: "555-1002",
          loyaltyPoints: 0,
          loyaltyTier: "Bronze",
          walletBalance: 3500,
          referralCode: generateReferralCode("Chen Wei"),
        },
      }),
      prisma.user.create({
        data: {
          name: "Maria Garcia",
          email: "maria@restaurants.com",
          password: ownerPassword,
          role: "restaurant_owner",
          phone: "555-1003",
          loyaltyPoints: 0,
          loyaltyTier: "Bronze",
          walletBalance: 4200,
          referralCode: generateReferralCode("Maria Garcia"),
        },
      }),
    ])
    console.log("✓ Created restaurant owners:", owners.length)

    // Create regular users with varying loyalty tiers
    const userPassword = await bcryptjs.hash("user123", 10)
    const users = await Promise.all([
      prisma.user.create({
        data: {
          name: "John Smith",
          email: "john@users.com",
          password: userPassword,
          role: "user",
          phone: "555-2001",
          loyaltyPoints: 2500,
          loyaltyTier: "Gold",
          walletBalance: 150.50,
          referralCode: generateReferralCode("John Smith"),
          addresses: {
            create: [
              {
                street: "123 Main St",
                city: "New York",
                state: "NY",
                zipCode: "10001",
                country: "USA",
                isDefault: true
              }
            ]
          }
        },
      }),
      prisma.user.create({
        data: {
          name: "Sarah Johnson",
          email: "sarah@users.com",
          password: userPassword,
          role: "user",
          phone: "555-2002",
          loyaltyPoints: 800,
          loyaltyTier: "Silver",
          walletBalance: 75.25,
          referralCode: generateReferralCode("Sarah Johnson"),
          addresses: {
            create: [
              {
                street: "456 Oak Ave",
                city: "Los Angeles",
                state: "CA",
                zipCode: "90001",
                country: "USA",
                isDefault: true
              }
            ]
          }
        },
      }),
      prisma.user.create({
        data: {
          name: "Michael Brown",
          email: "michael@users.com",
          password: userPassword,
          role: "user",
          phone: "555-2003",
          loyaltyPoints: 150,
          loyaltyTier: "Bronze",
          walletBalance: 25.00,
          referralCode: generateReferralCode("Michael Brown"),
          addresses: {
            create: [
              {
                street: "789 Elm St",
                city: "Chicago",
                state: "IL",
                zipCode: "60601",
                country: "USA",
                isDefault: true
              }
            ]
          }
        },
      }),
    ])
    console.log("✓ Created users:", users.length)

    // ==================== CREATE RESTAURANTS ====================
    console.log("\n🍽️ Creating restaurants...")
    const restaurants = await Promise.all([
      prisma.restaurant.create({
        data: {
          name: "Mario's Italian Kitchen",
          slug: "marios-italian-kitchen",
          description: "Authentic Italian cuisine with fresh homemade pasta and wood-fired pizzas. Family recipes passed down through generations!",
          cuisine: ["Italian", "Pizza", "Pasta"],
          address: {
            street: "100 Little Italy Ave",
            city: "New York",
            state: "NY",
            zipCode: "10013",
            country: "USA"
          },
          phone: "555-3001",
          email: "info@marios.com",
          ownerId: owners[0].id,
          rating: 4.7,
          totalReviews: 328,
          priceRange: "$$",
          isActive: true,
          isVerified: true,
          operatingHours: {
            monday: { open: "11:00", close: "22:00", closed: false },
            tuesday: { open: "11:00", close: "22:00", closed: false },
            wednesday: { open: "11:00", close: "22:00", closed: false },
            thursday: { open: "11:00", close: "22:00", closed: false },
            friday: { open: "11:00", close: "23:00", closed: false },
            saturday: { open: "11:00", close: "23:00", closed: false },
            sunday: { open: "12:00", close: "21:00", closed: false }
          },
          deliveryFee: 3.99,
          minOrderAmount: 15.00,
          maxDeliveryDistance: 5.0,
          avgDeliveryTime: 37, // 30-45 min average
          logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
          coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
          tags: ["Italian", "Pizza", "Pasta", "Family Friendly"],
          isOpen: true
        },
      }),
      prisma.restaurant.create({
        data: {
          name: "Dragon Wok",
          slug: "dragon-wok",
          description: "Modern Chinese restaurant specializing in Sichuan and Cantonese dishes. Experience authentic flavors with a contemporary twist!",
          cuisine: ["Chinese", "Asian", "Noodles"],
          address: {
            street: "200 Chinatown Blvd",
            city: "San Francisco",
            state: "CA",
            zipCode: "94108",
            country: "USA"
          },
          phone: "555-3002",
          email: "hello@dragonwok.com",
          ownerId: owners[1].id,
          rating: 4.5,
          totalReviews: 256,
          priceRange: "$$",
          isActive: true,
          isVerified: true,
          operatingHours: {
            monday: { open: "11:30", close: "22:00", closed: false },
            tuesday: { open: "11:30", close: "22:00", closed: false },
            wednesday: { open: "11:30", close: "22:00", closed: false },
            thursday: { open: "11:30", close: "22:00", closed: false },
            friday: { open: "11:30", close: "23:00", closed: false },
            saturday: { open: "11:30", close: "23:00", closed: false },
            sunday: { open: "11:30", close: "22:00", closed: false }
          },
          deliveryFee: 4.99,
          minOrderAmount: 20.00,
          maxDeliveryDistance: 5.0,
          avgDeliveryTime: 42, // 35-50 min average
          logo: "https://images.unsplash.com/photo-1580612690-16e9df8d2d3f?w=800&q=80",
          coverImage: "https://images.unsplash.com/photo-1580612690-16e9df8d2d3f?w=1200&q=80",
          tags: ["Chinese", "Spicy", "Noodles", "Authentic"],
          isOpen: true
        },
      }),
      prisma.restaurant.create({
        data: {
          name: "Taco Fiesta",
          slug: "taco-fiesta",
          description: "Vibrant Mexican street food with house-made tortillas, fresh salsas, and premium meats. Every bite is a fiesta!",
          cuisine: ["Mexican", "Street Food", "Tacos"],
          address: {
            street: "300 Mission St",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90012",
            country: "USA"
          },
          phone: "555-3003",
          email: "hola@tacofiesta.com",
          ownerId: owners[2].id,
          rating: 4.8,
          totalReviews: 412,
          priceRange: "$",
          isActive: true,
          isVerified: true,
          operatingHours: {
            monday: { open: "10:00", close: "22:00", closed: false },
            tuesday: { open: "10:00", close: "22:00", closed: false },
            wednesday: { open: "10:00", close: "22:00", closed: false },
            thursday: { open: "10:00", close: "22:00", closed: false },
            friday: { open: "10:00", close: "23:30", closed: false },
            saturday: { open: "10:00", close: "23:30", closed: false },
            sunday: { open: "10:00", close: "21:00", closed: false }
          },
          deliveryFee: 2.99,
          minOrderAmount: 12.00,
          maxDeliveryDistance: 5.0,
          avgDeliveryTime: 30, // 25-35 min average
          logo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
          coverImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=80",
          tags: ["Mexican", "Tacos", "Street Food", "Spicy"],
          isOpen: true
        },
      }),
    ])
    console.log("✓ Created restaurants:", restaurants.length)
    console.log("✓ Created restaurants:", restaurants.length)

    // ==================== CREATE FOOD ITEMS ====================
    console.log("\n🍔 Creating food items...")
    const foodItems = [
      // Burgers
      {
        name: "Classic Beef Burger",
        description: "Juicy 100% Angus beef patty with fresh lettuce, tomatoes, pickles, onions, and our special sauce on a toasted sesame bun. A timeless favorite that never disappoints!",
        category: "Burgers",
        subcategory: "Beef",
        price: 12.99,
        discount: 0,
        ingredients: [
          { name: "Beef Patty", quantity: "200g" },
          { name: "Lettuce", quantity: "30g" },
          { name: "Tomato", quantity: "2 slices" },
          { name: "Pickles", quantity: "3 slices" },
          { name: "Onions", quantity: "20g" },
          { name: "Special Sauce", quantity: "2 tbsp" }
        ],
        nutrition: {
          calories: 650,
          protein: "35g",
          fat: "38g",
          carbs: "42g",
          sugar: "8g",
          fiber: "3g"
        },
        stock: 50,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        tags: ["Popular", "Beef", "Classic"],
        preparationTime: 15
      },
      {
        name: "Double Cheese Burger",
        description: "Two succulent beef patties stacked high with double cheddar cheese, crispy bacon, caramelized onions, and tangy BBQ sauce. Perfect for those with a hearty appetite!",
        category: "Burgers",
        subcategory: "Beef",
        price: 16.99,
        discount: 10,
        ingredients: [
          { name: "Beef Patty", quantity: "400g" },
          { name: "Cheddar Cheese", quantity: "4 slices" },
          { name: "Bacon", quantity: "4 strips" },
          { name: "Caramelized Onions", quantity: "40g" },
          { name: "BBQ Sauce", quantity: "3 tbsp" }
        ],
        nutrition: {
          calories: 980,
          protein: "58g",
          fat: "62g",
          carbs: "48g",
          sugar: "12g",
          fiber: "2g"
        },
        stock: 35,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
        tags: ["Premium", "Beef", "Cheese"],
        preparationTime: 18
      },
      {
        name: "Chicken Avocado Burger",
        description: "Grilled chicken breast topped with creamy avocado, crispy bacon, Swiss cheese, and garlic aioli on a brioche bun. A healthier yet indulgent option!",
        category: "Burgers",
        subcategory: "Chicken",
        price: 14.99,
        discount: 5,
        ingredients: [
          { name: "Chicken Breast", quantity: "180g" },
          { name: "Avocado", quantity: "1/2 piece" },
          { name: "Swiss Cheese", quantity: "2 slices" },
          { name: "Bacon", quantity: "2 strips" },
          { name: "Garlic Aioli", quantity: "2 tbsp" }
        ],
        nutrition: {
          calories: 720,
          protein: "42g",
          fat: "38g",
          carbs: "45g",
          sugar: "6g",
          fiber: "5g"
        },
        stock: 40,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80",
        tags: ["Healthy", "Chicken", "Avocado"],
        preparationTime: 16
      },
      // Pizzas
      {
        name: "Margherita Pizza",
        description: "Classic Italian pizza with fresh mozzarella, San Marzano tomato sauce, fresh basil, and extra virgin olive oil. Simple perfection on a wood-fired crust!",
        category: "Pizza",
        subcategory: "Vegetarian",
        price: 14.99,
        discount: 0,
        ingredients: [
          { name: "Pizza Dough", quantity: "300g" },
          { name: "Mozzarella", quantity: "200g" },
          { name: "Tomato Sauce", quantity: "150ml" },
          { name: "Fresh Basil", quantity: "10g" },
          { name: "Olive Oil", quantity: "2 tbsp" }
        ],
        nutrition: {
          calories: 820,
          protein: "32g",
          fat: "28g",
          carbs: "98g",
          sugar: "8g",
          fiber: "4g"
        },
        stock: 60,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
        tags: ["Classic", "Vegetarian", "Italian"],
        preparationTime: 20
      },
      {
        name: "Pepperoni Supreme Pizza",
        description: "Loaded with premium pepperoni, Italian sausage, bell peppers, mushrooms, onions, and a blend of mozzarella and cheddar cheese. The ultimate meat lover's dream!",
        category: "Pizza",
        subcategory: "Meat",
        price: 18.99,
        discount: 15,
        ingredients: [
          { name: "Pizza Dough", quantity: "300g" },
          { name: "Pepperoni", quantity: "100g" },
          { name: "Italian Sausage", quantity: "80g" },
          { name: "Mozzarella", quantity: "150g" },
          { name: "Bell Peppers", quantity: "50g" },
          { name: "Mushrooms", quantity: "50g" }
        ],
        nutrition: {
          calories: 1150,
          protein: "48g",
          fat: "54g",
          carbs: "102g",
          sugar: "10g",
          fiber: "5g"
        },
        stock: 45,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
        tags: ["Best Seller", "Meat", "Spicy"],
        preparationTime: 22
      },
      {
        name: "BBQ Chicken Pizza",
        description: "Grilled chicken breast, red onions, cilantro, and a smoky BBQ sauce base topped with melted cheddar and mozzarella. A unique twist on traditional pizza!",
        category: "Pizza",
        subcategory: "Chicken",
        price: 16.99,
        discount: 0,
        ingredients: [
          { name: "Pizza Dough", quantity: "300g" },
          { name: "Grilled Chicken", quantity: "150g" },
          { name: "BBQ Sauce", quantity: "100ml" },
          { name: "Red Onions", quantity: "40g" },
          { name: "Cilantro", quantity: "10g" },
          { name: "Cheddar Cheese", quantity: "100g" }
        ],
        nutrition: {
          calories: 950,
          protein: "52g",
          fat: "32g",
          carbs: "98g",
          sugar: "18g",
          fiber: "4g"
        },
        stock: 40,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
        tags: ["Popular", "Chicken", "BBQ"],
        preparationTime: 20
      },
      // Salads
      {
        name: "Caesar Salad",
        description: "Crisp romaine lettuce tossed in our homemade Caesar dressing, topped with parmesan cheese, garlic croutons, and a hint of lemon. Light yet satisfying!",
        category: "Salads",
        subcategory: "Classic",
        price: 9.99,
        discount: 0,
        ingredients: [
          { name: "Romaine Lettuce", quantity: "200g" },
          { name: "Caesar Dressing", quantity: "50ml" },
          { name: "Parmesan Cheese", quantity: "30g" },
          { name: "Croutons", quantity: "40g" },
          { name: "Lemon", quantity: "1 wedge" }
        ],
        nutrition: {
          calories: 380,
          protein: "12g",
          fat: "28g",
          carbs: "22g",
          sugar: "4g",
          fiber: "4g"
        },
        stock: 55,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
        tags: ["Healthy", "Vegetarian", "Light"],
        preparationTime: 10
      },
      {
        name: "Greek Salad",
        description: "Fresh cucumber, tomatoes, red onions, kalamata olives, and feta cheese drizzled with olive oil and oregano. A Mediterranean delight!",
        category: "Salads",
        subcategory: "Mediterranean",
        price: 11.99,
        discount: 0,
        ingredients: [
          { name: "Cucumber", quantity: "100g" },
          { name: "Tomatoes", quantity: "150g" },
          { name: "Red Onions", quantity: "30g" },
          { name: "Feta Cheese", quantity: "80g" },
          { name: "Kalamata Olives", quantity: "40g" },
          { name: "Olive Oil", quantity: "2 tbsp" }
        ],
        nutrition: {
          calories: 320,
          protein: "10g",
          fat: "24g",
          carbs: "18g",
          sugar: "8g",
          fiber: "4g"
        },
        stock: 50,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
        tags: ["Healthy", "Mediterranean", "Fresh"],
        preparationTime: 8
      },
      {
        name: "Grilled Chicken Salad",
        description: "Tender grilled chicken breast on mixed greens with cherry tomatoes, avocado, corn, and honey mustard dressing. Protein-packed and delicious!",
        category: "Salads",
        subcategory: "Protein",
        price: 13.99,
        discount: 10,
        ingredients: [
          { name: "Grilled Chicken", quantity: "150g" },
          { name: "Mixed Greens", quantity: "150g" },
          { name: "Cherry Tomatoes", quantity: "80g" },
          { name: "Avocado", quantity: "1/2 piece" },
          { name: "Corn", quantity: "50g" },
          { name: "Honey Mustard", quantity: "40ml" }
        ],
        nutrition: {
          calories: 450,
          protein: "38g",
          fat: "22g",
          carbs: "28g",
          sugar: "10g",
          fiber: "8g"
        },
        stock: 40,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
        tags: ["Healthy", "High Protein", "Chicken"],
        preparationTime: 12
      },
      // Desserts
      {
        name: "Chocolate Lava Cake",
        description: "Decadent molten chocolate cake with a gooey chocolate center, served warm with vanilla ice cream. Pure chocolate heaven!",
        category: "Desserts",
        subcategory: "Chocolate",
        price: 7.99,
        discount: 0,
        ingredients: [
          { name: "Dark Chocolate", quantity: "100g" },
          { name: "Butter", quantity: "60g" },
          { name: "Eggs", quantity: "2 pieces" },
          { name: "Flour", quantity: "30g" },
          { name: "Sugar", quantity: "50g" },
          { name: "Vanilla Ice Cream", quantity: "1 scoop" }
        ],
        nutrition: {
          calories: 520,
          protein: "8g",
          fat: "32g",
          carbs: "52g",
          sugar: "38g",
          fiber: "3g"
        },
        stock: 30,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
        tags: ["Popular", "Chocolate", "Warm"],
        preparationTime: 15
      },
      {
        name: "New York Cheesecake",
        description: "Classic creamy cheesecake with a graham cracker crust, topped with fresh strawberry sauce. Rich, smooth, and utterly indulgent!",
        category: "Desserts",
        subcategory: "Cake",
        price: 6.99,
        discount: 0,
        ingredients: [
          { name: "Cream Cheese", quantity: "200g" },
          { name: "Graham Crackers", quantity: "80g" },
          { name: "Sugar", quantity: "60g" },
          { name: "Eggs", quantity: "2 pieces" },
          { name: "Strawberry Sauce", quantity: "50ml" }
        ],
        nutrition: {
          calories: 450,
          protein: "8g",
          fat: "28g",
          carbs: "42g",
          sugar: "32g",
          fiber: "1g"
        },
        stock: 25,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=800&q=80",
        tags: ["Classic", "Creamy", "Sweet"],
        preparationTime: 10
      },
      {
        name: "Tiramisu",
        description: "Authentic Italian dessert with espresso-soaked ladyfingers layered with mascarpone cream and dusted with cocoa. A coffee lover's paradise!",
        category: "Desserts",
        subcategory: "Italian",
        price: 8.99,
        discount: 5,
        ingredients: [
          { name: "Ladyfingers", quantity: "150g" },
          { name: "Mascarpone", quantity: "250g" },
          { name: "Espresso", quantity: "100ml" },
          { name: "Cocoa Powder", quantity: "20g" },
          { name: "Sugar", quantity: "40g" }
        ],
        nutrition: {
          calories: 420,
          protein: "10g",
          fat: "24g",
          carbs: "42g",
          sugar: "28g",
          fiber: "2g"
        },
        stock: 20,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
        tags: ["Italian", "Coffee", "Elegant"],
        preparationTime: 12
      },
      // Drinks
      {
        name: "Fresh Orange Juice",
        description: "Freshly squeezed oranges packed with vitamin C. No added sugar, just pure natural goodness!",
        category: "Drinks",
        subcategory: "Fresh Juice",
        price: 4.99,
        discount: 0,
        ingredients: [
          { name: "Fresh Oranges", quantity: "4 pieces" }
        ],
        nutrition: {
          calories: 120,
          protein: "2g",
          fat: "0g",
          carbs: "28g",
          sugar: "22g",
          fiber: "0g"
        },
        stock: 100,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80",
        tags: ["Healthy", "Fresh", "Vitamin C"],
        preparationTime: 5
      },
      {
        name: "Mango Smoothie",
        description: "Creamy blend of fresh mangoes, yogurt, and honey. Tropical, refreshing, and naturally sweet!",
        category: "Drinks",
        subcategory: "Smoothie",
        price: 5.99,
        discount: 0,
        ingredients: [
          { name: "Fresh Mango", quantity: "200g" },
          { name: "Greek Yogurt", quantity: "100ml" },
          { name: "Honey", quantity: "1 tbsp" },
          { name: "Ice", quantity: "100g" }
        ],
        nutrition: {
          calories: 180,
          protein: "6g",
          fat: "2g",
          carbs: "38g",
          sugar: "32g",
          fiber: "3g"
        },
        stock: 80,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80",
        tags: ["Healthy", "Smoothie", "Tropical"],
        preparationTime: 5
      },
      {
        name: "Iced Caramel Latte",
        description: "Rich espresso combined with cold milk and sweet caramel syrup, served over ice. The perfect pick-me-up!",
        category: "Drinks",
        subcategory: "Coffee",
        price: 5.49,
        discount: 0,
        ingredients: [
          { name: "Espresso", quantity: "60ml" },
          { name: "Milk", quantity: "200ml" },
          { name: "Caramel Syrup", quantity: "30ml" },
          { name: "Ice", quantity: "150g" }
        ],
        nutrition: {
          calories: 220,
          protein: "8g",
          fat: "6g",
          carbs: "34g",
          sugar: "28g",
          fiber: "0g"
        },
        stock: 90,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80",
        tags: ["Coffee", "Cold", "Sweet"],
        preparationTime: 7
      },
      {
        name: "Lemonade",
        description: "Classic homemade lemonade with fresh lemons, mint, and just the right amount of sweetness. Perfect for hot days!",
        category: "Drinks",
        subcategory: "Cold Drinks",
        price: 3.99,
        discount: 0,
        ingredients: [
          { name: "Fresh Lemons", quantity: "3 pieces" },
          { name: "Sugar", quantity: "50g" },
          { name: "Water", quantity: "500ml" },
          { name: "Mint", quantity: "5g" },
          { name: "Ice", quantity: "100g" }
        ],
        nutrition: {
          calories: 150,
          protein: "0g",
          fat: "0g",
          carbs: "38g",
          sugar: "35g",
          fiber: "0g"
        },
        stock: 120,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f6c?w=800&q=80",
        tags: ["Refreshing", "Cold", "Citrus"],
        preparationTime: 5
      }
    ];

    // Assign food items to restaurants
    for (let i = 0; i < foodItems.length; i++) {
      const restaurantId = i < 5 ? restaurants[0].id : i < 10 ? restaurants[1].id : restaurants[2].id
      const ownerId = i < 5 ? owners[0].id : i < 10 ? owners[1].id : owners[2].id
      await prisma.foodItem.create({
        data: {
          ...foodItems[i],
          restaurantId,
          createdBy: ownerId,
          isVegetarian: foodItems[i].category === "Salads",
          isVegan: false,
          isGlutenFree: false,
          isHalal: false
        }
      })
    }
    console.log("✓ Created food items:", foodItems.length)

    console.log("✓ Created food items:", foodItems.length)

    // ==================== CREATE DRIVERS ====================
    console.log("\n🚗 Creating drivers...")
    const drivers = await Promise.all([
      prisma.driver.create({
        data: {
          name: "James Wilson",
          email: "james@drivers.com",
          phone: "555-4001",
          vehicle: "Honda Civic 2020",
          licensePlate: "ABC123",
          driverLicense: "DL123456",
          available: true,
          currentLocation: { lat: 40.7128, lng: -74.0060 },
          rating: 4.8,
          totalOrders: 245,
          totalEarnings: 3250.50
        },
      }),
      prisma.driver.create({
        data: {
          name: "Emily Davis",
          email: "emily@drivers.com",
          phone: "555-4002",
          vehicle: "Toyota Prius 2021",
          licensePlate: "XYZ789",
          driverLicense: "DL789012",
          available: true,
          currentLocation: { lat: 40.7589, lng: -73.9851 },
          rating: 4.9,
          totalOrders: 312,
          totalEarnings: 4120.75
        },
      }),
      prisma.driver.create({
        data: {
          name: "David Martinez",
          email: "david@drivers.com",
          phone: "555-4003",
          vehicle: "Ford Focus 2019",
          licensePlate: "DEF456",
          driverLicense: "DL345678",
          available: false,
          currentLocation: { lat: 40.7480, lng: -73.9862 },
          rating: 4.7,
          totalOrders: 198,
          totalEarnings: 2680.25
        },
      }),
    ])
    console.log("✓ Created drivers:", drivers.length)

    // ==================== CREATE DELIVERY ZONES ====================
    console.log("\n📍 Creating delivery zones...")
    const zones = await Promise.all([
      prisma.deliveryZone.create({
        data: {
          name: "Downtown Manhattan",
          code: "MANHATTAN_DT",
          city: "New York",
          boundaries: {
            type: "Polygon",
            coordinates: [[
              [-74.0060, 40.7128],
              [-73.9851, 40.7589],
              [-73.9855, 40.7580],
              [-74.0060, 40.7128]
            ]]
          },
          center: { latitude: 40.7358, longitude: -73.9958 },
          deliveryFee: 3.99,
          isActive: true
        }
      }),
      prisma.deliveryZone.create({
        data: {
          name: "Chinatown SF",
          code: "SF_CHINATOWN",
          city: "San Francisco",
          boundaries: {
            type: "Polygon",
            coordinates: [[
              [-122.4194, 37.7749],
              [-122.4079, 37.7937],
              [-122.4100, 37.7900],
              [-122.4194, 37.7749]
            ]]
          },
          center: { latitude: 37.7833, longitude: -122.4125 },
          deliveryFee: 4.99,
          isActive: true
        }
      })
    ])
    console.log("✓ Created delivery zones:", zones.length)

    // ==================== CREATE PROMOTIONS ====================
    console.log("\n🎉 Creating promotions...")
    const promotions = await Promise.all([
      prisma.promotion.create({
        data: {
          title: "Weekend Special - 30% Off!",
          description: "Get 30% off on all orders above $30 this weekend only!",
          promoCode: "WEEKEND30",
          discountType: "percentage",
          discountValue: 30,
          minOrderAmount: 30,
          maxDiscount: 15,
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          isActive: true,
          totalMaxUses: 500,
          usedCount: 142
        }
      }),
      prisma.promotion.create({
        data: {
          title: "First Order Bonus",
          description: "New users get $10 off on their first order!",
          promoCode: "FIRST10",
          discountType: "fixed",
          discountValue: 10,
          minOrderAmount: 20,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true,
          totalMaxUses: 1000,
          usedCount: 523,
          targetUserTier: ["All"]
        }
      }),
      prisma.promotion.create({
        data: {
          title: "Mario's Special - Free Delivery",
          description: "Free delivery on all orders from Mario's Italian Kitchen!",
          promoCode: "MARIOFREE",
          discountType: "free_delivery",
          discountValue: 0,
          minOrderAmount: 15,
          restaurantId: restaurants[0].id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          isActive: true,
          totalMaxUses: 300,
          usedCount: 87
        }
      })
    ])
    console.log("✓ Created promotions:", promotions.length)
    console.log("✓ Created promotions:", promotions.length)

    // ==================== CREATE COUPONS (old system) ====================
    console.log("\n🎫 Creating coupons...")
    const coupons = [
      {
        code: "WELCOME10",
        description: "10% off for new users",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderValue: 15,
        maxUses: 100,
        active: true
      },
      {
        code: "SAVE15",
        description: "15% off on orders over $50",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minOrderValue: 50,
        maxUses: 200,
        active: true
      },
      { 
        code: "FLAT5", 
        description: "$5 off your order", 
        discountType: "FIXED", 
        discountValue: 5, 
        minOrderValue: 20,
        maxUses: 150,
        active: true
      }
    ]

    for (const coupon of coupons) {
      await prisma.coupon.create({
        data: coupon
      })
    }
    console.log("✓ Created coupons:", coupons.length)

    // ==================== CREATE SAMPLE ORDERS ====================
    console.log("\n📦 Creating sample orders...")

    // First, get the addresses for each user
    const userAddresses = await Promise.all([
      prisma.address.findFirst({ where: { userId: users[0].id, isDefault: true } }),
      prisma.address.findFirst({ where: { userId: users[1].id, isDefault: true } }),
      prisma.address.findFirst({ where: { userId: users[2].id, isDefault: true } })
    ])

    const orders = await Promise.all([
      // Completed order
      prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-1`,
          userId: users[0].id,
          restaurantId: restaurants[0].id,
          items: [
            {
              foodItemId: "item1",
              name: "Margherita Pizza",
              quantity: 2,
              price: 14.99,
              specialInstructions: "Extra cheese please"
            }
          ],
          subtotal: 29.98,
          deliveryFee: 3.99,
          tax: 2.70,
          discount: 0,
          total: 36.67,
          status: "delivered",
          paymentStatus: "paid",
          paymentMethod: "card",
          deliveryAddress: userAddresses[0],
          driverId: drivers[0].id,
          estimatedDeliveryTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
          actualDeliveryTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
          steps: [
            { step: "placed", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), message: "Order placed" },
            { step: "confirmed", timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000), message: "Restaurant confirmed" },
            { step: "preparing", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), message: "Preparing your order" },
            { step: "ready", timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), message: "Order ready for pickup" },
            { step: "picked_up", timestamp: new Date(Date.now() - 1.25 * 60 * 60 * 1000), message: "Driver picked up" },
            { step: "on_the_way", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), message: "On the way to you" },
            { step: "delivered", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), message: "Delivered" }
          ]
        }
      }),
      // Active order
      prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-2`,
          userId: users[1].id,
          restaurantId: restaurants[1].id,
          items: [
            {
              foodItemId: "item2",
              name: "BBQ Chicken Pizza",
              quantity: 1,
              price: 16.99
            },
            {
              foodItemId: "item3",
              name: "Caesar Salad",
              quantity: 1,
              price: 9.99
            }
          ],
          subtotal: 26.98,
          deliveryFee: 4.99,
          tax: 2.88,
          discount: 0,
          total: 34.85,
          status: "in_transit",
          paymentStatus: "paid",
          paymentMethod: "wallet",
          deliveryAddress: userAddresses[1],
          driverId: drivers[1].id,
          estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
          steps: [
            { step: "placed", timestamp: new Date(), message: "Order placed" },
            { step: "confirmed", timestamp: new Date(Date.now() + 5 * 60 * 1000), message: "Restaurant confirmed" },
            { step: "preparing", timestamp: new Date(Date.now() + 10 * 60 * 1000), message: "Preparing your order" },
            { step: "ready", timestamp: new Date(Date.now() + 15 * 60 * 1000), message: "Order ready for pickup" },
            { step: "picked_up", timestamp: new Date(Date.now() + 20 * 60 * 1000), message: "Driver picked up" },
            { step: "on_the_way", timestamp: new Date(Date.now() + 25 * 60 * 1000), message: "On the way to you" }
          ]
        }
      }),
      // Pending order
      prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-3`,
          userId: users[2].id,
          restaurantId: restaurants[2].id,
          items: [
            {
              foodItemId: "item4",
              name: "Classic Burger",
              quantity: 3,
              price: 12.99
            }
          ],
          subtotal: 38.97,
          deliveryFee: 2.99,
          tax: 3.78,
          discount: 0,
          total: 45.74,
          status: "placed",
          paymentStatus: "paid",
          paymentMethod: "card",
          deliveryAddress: userAddresses[2],
          estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000),
          steps: [
            { step: "placed", timestamp: new Date(), message: "Order placed" }
          ]
        }
      })
    ])
    console.log("✓ Created orders:", orders.length)

    // ==================== CREATE REVIEWS ====================
    console.log("\n⭐ Creating reviews...")
    const reviews = await Promise.all([
      prisma.review.create({
        data: {
          userId: users[0].id,
          restaurantId: restaurants[0].id,
          orderId: orders[0].id,
          rating: 5,
          comment: "Absolutely fantastic! The pizza was fresh and delicious. Best Italian food in the city!",
          isHelpful: 12
        }
      }),
      prisma.review.create({
        data: {
          userId: users[1].id,
          restaurantId: restaurants[1].id,
          rating: 4,
          comment: "Great food and fast delivery. The noodles were authentic and flavorful.",
          isHelpful: 8
        }
      }),
      prisma.review.create({
        data: {
          userId: users[0].id,
          driverId: drivers[0].id,
          orderId: orders[0].id,
          rating: 5,
          comment: "Very professional driver. Food arrived hot and on time!",
          isHelpful: 5
        }
      })
    ])
    console.log("✓ Created reviews:", reviews.length)

    // ==================== CREATE WALLET TRANSACTIONS ====================
    console.log("\n💰 Creating wallet transactions...")
    await Promise.all([
      prisma.walletTransaction.create({
        data: {
          userId: users[0].id,
          type: "credit",
          amount: 100,
          balanceBefore: 50.50,
          balanceAfter: 150.50,
          description: "Added money to wallet",
          status: "completed"
        }
      }),
      prisma.walletTransaction.create({
        data: {
          userId: users[0].id,
          type: "cashback",
          amount: 3.67,
          balanceBefore: 146.83,
          balanceAfter: 150.50,
          orderId: orders[0].id,
          description: "Cashback from order",
          status: "completed"
        }
      }),
      prisma.walletTransaction.create({
        data: {
          userId: users[1].id,
          type: "debit",
          amount: 34.85,
          balanceBefore: 110.10,
          balanceAfter: 75.25,
          orderId: orders[1].id,
          description: "Payment for order",
          status: "completed"
        }
      })
    ])
    console.log("✓ Created wallet transactions")

    // ==================== CREATE LOYALTY TRANSACTIONS ====================
    console.log("\n🏆 Creating loyalty transactions...")
    await Promise.all([
      prisma.loyaltyTransaction.create({
        data: {
          userId: users[0].id,
          type: "earned",
          pointsEarned: 37,
          pointsRedeemed: 0,
          pointsBalance: 2537,
          description: "Points earned from order",
          orderId: orders[0].id
        }
      }),
      prisma.loyaltyTransaction.create({
        data: {
          userId: users[0].id,
          type: "earned",
          pointsEarned: 500,
          pointsRedeemed: 0,
          pointsBalance: 3037,
          description: "Referral bonus"
        }
      }),
      prisma.loyaltyTransaction.create({
        data: {
          userId: users[1].id,
          type: "redeemed",
          pointsEarned: 0,
          pointsRedeemed: 200,
          pointsBalance: 600,
          description: "Redeemed for $2 discount",
          orderId: orders[1].id
        }
      })
    ])
    console.log("✓ Created loyalty transactions")

    // ==================== CREATE NOTIFICATIONS ====================
    console.log("\n🔔 Creating notifications...")
    await Promise.all([
      prisma.notification.create({
        data: {
          userId: users[0].id,
          type: "order_update",
          title: "Order Delivered!",
          message: "Your order has been successfully delivered. Enjoy your meal!",
          data: { orderId: orders[0].id },
          isRead: true
        }
      }),
      prisma.notification.create({
        data: {
          userId: users[1].id,
          type: "order_update",
          title: "Driver is on the way",
          message: "Your order is out for delivery. Track your driver in real-time!",
          data: { orderId: orders[1].id, driverId: drivers[1].id },
          isRead: false
        }
      }),
      prisma.notification.create({
        data: {
          userId: users[0].id,
          type: "promotion",
          title: "Weekend Special - 30% Off!",
          message: "Use code WEEKEND30 to get 30% off on your next order!",
          data: { promoCode: "WEEKEND30" },
          isRead: false
        }
      })
    ])
    console.log("✓ Created notifications")

    // ==================== CREATE FAVORITES ====================
    console.log("\n❤️ Creating favorite restaurants...")
    await Promise.all([
      prisma.favoriteRestaurant.create({
        data: {
          userId: users[0].id,
          restaurantId: restaurants[0].id
        }
      }),
      prisma.favoriteRestaurant.create({
        data: {
          userId: users[0].id,
          restaurantId: restaurants[1].id
        }
      }),
      prisma.favoriteRestaurant.create({
        data: {
          userId: users[1].id,
          restaurantId: restaurants[2].id
        }
      })
    ])
    console.log("✓ Created favorite restaurants")

    // ==================== CREATE DRIVER EARNINGS ====================
    console.log("\n💵 Creating driver earnings...")
    await Promise.all([
      prisma.driverEarning.create({
        data: {
          driverId: drivers[0].id,
          orderId: orders[0].id,
          baseEarning: 5.00,
          tip: 3.00,
          bonus: 0,
          totalEarning: 8.00,
          platformFee: 1.60,
          netEarning: 6.40
        }
      }),
      prisma.driverEarning.create({
        data: {
          driverId: drivers[1].id,
          orderId: orders[1].id,
          baseEarning: 6.00,
          tip: 4.50,
          bonus: 1.50,
          totalEarning: 12.00,
          platformFee: 2.40,
          netEarning: 9.60
        }
      })
    ])
    console.log("✓ Created driver earnings")

    // ==================== CREATE ANALYTICS ====================
    console.log("\n📊 Creating analytics data...")
    await prisma.analytics.create({
      data: {
        date: new Date(),
        period: "daily",
        totalRevenue: 117.26,
        totalOrders: 3,
        avgOrderValue: 39.09,
        activeUsers: 3,
        activeRestaurants: 3,
        activeDrivers: 2,
        topRestaurants: [
          { restaurantId: restaurants[0].id, name: "Mario's Italian Kitchen", revenue: 36.67, orders: 1 },
          { restaurantId: restaurants[1].id, name: "Dragon Wok", revenue: 34.85, orders: 1 },
          { restaurantId: restaurants[2].id, name: "Taco Fiesta", revenue: 45.74, orders: 1 }
        ]
      }
    })
    console.log("✓ Created analytics data")

    console.log("\n🎉 Database seeded successfully!")
    console.log("\n📋 Summary:")
    console.log(`   Users: ${users.length + owners.length + 1} (1 admin, ${owners.length} owners, ${users.length} customers)`)
    console.log(`   Restaurants: ${restaurants.length}`)
    console.log(`   Food Items: ${foodItems.length}`)
    console.log(`   Drivers: ${drivers.length}`)
    console.log(`   Orders: ${orders.length}`)
    console.log(`   Reviews: ${reviews.length}`)
    console.log(`   Promotions: ${promotions.length}`)
    console.log(`   Coupons: ${coupons.length}`)
    console.log("\n🔐 Login Credentials:")
    console.log(`   Admin: admin@hungrybelly.com / admin123`)
    console.log(`   Owner: mario@restaurants.com / owner123`)
    console.log(`   User: john@users.com / user123`)
    console.log(`   Driver: james@drivers.com / driver123`)

  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
