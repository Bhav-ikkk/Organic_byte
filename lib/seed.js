import { PrismaClient } from "@prisma/client"
import { hashPassword } from "./auth.js"

const prisma = new PrismaClient()

const categories = [
  {
    name: "Chocolate",
    slug: "chocolate",
    description: "Rich chocolate biscuits and cookies made with premium cocoa",
    image: "/images/categories/chocolate.jpg",
  },
  {
    name: "Vanilla",
    slug: "vanilla",
    description: "Classic vanilla flavored treats with real vanilla beans",
    image: "/images/categories/vanilla.jpg",
  },
  {
    name: "Nuts & Seeds",
    slug: "nuts",
    description: "Nutty and crunchy varieties packed with healthy nuts",
    image: "/images/categories/nuts.jpg",
  },
  {
    name: "Fruit",
    slug: "fruit",
    description: "Fruity and refreshing options with real fruit pieces",
    image: "/images/categories/fruit.jpg",
  },
  {
    name: "Gluten Free",
    slug: "gluten-free",
    description: "Delicious gluten-free alternatives for everyone",
    image: "/images/categories/gluten-free.jpg",
  },
  {
    name: "Vegan",
    slug: "vegan",
    description: "Plant-based options without compromising on taste",
    image: "/images/categories/vegan.jpg",
  },
]

const products = [
  {
    name: "Chocolate Chip Delight",
    slug: "chocolate-chip-delight",
    description:
      "Rich organic chocolate chips in every bite, made with premium Belgian chocolate and organic flour. A perfect balance of sweetness and texture that melts in your mouth.",
    price: 4.99,
    originalPrice: 6.99,
    image: "/images/chocolate-chip.png",
    images: ["/images/chocolate-chip.png", "/images/chocolate-chip-2.jpg", "/images/chocolate-chip-3.jpg"],
    stock: 25,
    category: "chocolate",
    categories: ["chocolate", "bestseller"],
    isFeatured: true,
    ingredients:
      "Organic flour, organic butter, organic sugar, Belgian chocolate chips (cocoa mass, sugar, cocoa butter, vanilla), organic eggs, vanilla extract, sea salt, baking powder",
    nutritionalInfo: {
      servingSize: "2 biscuits (30g)",
      calories: 120,
      fat: "6g",
      saturatedFat: "3.5g",
      carbs: "15g",
      fiber: "1g",
      sugar: "8g",
      protein: "2g",
      sodium: "85mg",
    },
    allergens: ["Gluten", "Dairy", "Eggs"],
    benefits: ["Organic", "No Artificial Flavors", "Handcrafted", "Premium Chocolate"],
    weight: "200g",
    dimensions: "15cm x 10cm x 5cm",
    rating: 4.8,
    reviewCount: 124,
  },
  {
    name: "Vanilla Bean Dreams",
    slug: "vanilla-bean-dreams",
    description:
      "Pure Madagascar vanilla in buttery perfection, crafted with real vanilla beans. These shortbread-style biscuits offer a delicate, aromatic experience.",
    price: 3.99,
    originalPrice: 5.49,
    image: "/images/vanilla-shortbread.png",
    images: ["/images/vanilla-shortbread.png", "/images/vanilla-shortbread-2.jpg", "/images/vanilla-shortbread-3.jpg"],
    stock: 18,
    category: "vanilla",
    categories: ["vanilla", "classic"],
    isFeatured: true,
    ingredients:
      "Organic flour, organic butter, organic sugar, Madagascar vanilla beans, organic eggs, sea salt, natural vanilla extract",
    nutritionalInfo: {
      servingSize: "3 biscuits (25g)",
      calories: 110,
      fat: "7g",
      saturatedFat: "4g",
      carbs: "12g",
      fiber: "0.5g",
      sugar: "5g",
      protein: "1g",
      sodium: "65mg",
    },
    allergens: ["Gluten", "Dairy", "Eggs"],
    benefits: ["Organic", "Real Vanilla Beans", "Traditional Recipe", "Artisan Made"],
    weight: "180g",
    dimensions: "15cm x 10cm x 4cm",
    rating: 4.5,
    reviewCount: 86,
  },
  {
    name: "Almond Crunch Heaven",
    slug: "almond-crunch-heaven",
    description:
      "Roasted almonds with organic honey glaze, perfect for nut lovers. These gluten-free treats are packed with protein and natural goodness.",
    price: 5.99,
    originalPrice: 7.99,
    image: "/images/almond-cookies.png",
    images: ["/images/almond-cookies.png", "/images/almond-cookies-2.jpg", "/images/almond-cookies-3.jpg"],
    stock: 8,
    category: "nuts",
    categories: ["nuts", "gluten-free"],
    isFeatured: true,
    ingredients:
      "Almond flour, organic almonds, organic honey, organic coconut oil, vanilla extract, sea salt, organic coconut sugar",
    nutritionalInfo: {
      servingSize: "2 biscuits (35g)",
      calories: 150,
      fat: "12g",
      saturatedFat: "3g",
      carbs: "10g",
      fiber: "3g",
      sugar: "6g",
      protein: "5g",
      sodium: "45mg",
    },
    allergens: ["Tree Nuts"],
    benefits: ["Gluten-Free", "High Protein", "Natural Sweeteners", "Keto-Friendly"],
    weight: "220g",
    dimensions: "15cm x 10cm x 6cm",
    rating: 4.7,
    reviewCount: 43,
  },
  {
    name: "Oatmeal Raisin Classic",
    slug: "oatmeal-raisin-classic",
    description:
      "Hearty oatmeal cookies with organic raisins and a hint of cinnamon. A wholesome treat that brings back childhood memories.",
    price: 4.49,
    originalPrice: 5.99,
    image: "/images/oatmeal-raisin.png",
    images: ["/images/oatmeal-raisin.png", "/images/oatmeal-raisin-2.jpg"],
    stock: 12,
    category: "fruit",
    categories: ["fruit", "healthy"],
    isFeatured: false,
    ingredients:
      "Organic oats, organic flour, organic butter, organic brown sugar, organic raisins, organic eggs, cinnamon, vanilla extract, baking soda, sea salt",
    nutritionalInfo: {
      servingSize: "2 biscuits (40g)",
      calories: 130,
      fat: "5g",
      saturatedFat: "2.5g",
      carbs: "20g",
      fiber: "2g",
      sugar: "10g",
      protein: "3g",
      sodium: "95mg",
    },
    allergens: ["Gluten", "Dairy", "Eggs"],
    benefits: ["Organic", "High Fiber", "Natural Sweeteners", "Whole Grains"],
    weight: "190g",
    dimensions: "15cm x 10cm x 5cm",
    rating: 4.3,
    reviewCount: 52,
  },
  {
    name: "Lemon Zest Biscuits",
    slug: "lemon-zest-biscuits",
    description:
      "Refreshing lemon zest biscuits made with organic lemons. Light, citrusy, and perfect with afternoon tea.",
    price: 4.29,
    originalPrice: 5.79,
    image: "/images/lemon-zest.png",
    images: ["/images/lemon-zest.png", "/images/lemon-zest-2.jpg"],
    stock: 15,
    category: "fruit",
    categories: ["fruit", "citrus"],
    isFeatured: false,
    ingredients:
      "Organic flour, organic butter, organic sugar, organic lemon zest, organic lemon juice, organic eggs, sea salt, baking powder",
    nutritionalInfo: {
      servingSize: "3 biscuits (30g)",
      calories: 115,
      fat: "5g",
      saturatedFat: "3g",
      carbs: "16g",
      fiber: "1g",
      sugar: "7g",
      protein: "2g",
      sodium: "75mg",
    },
    allergens: ["Gluten", "Dairy", "Eggs"],
    benefits: ["Organic", "Natural Citrus", "Refreshing", "Light & Crispy"],
    weight: "175g",
    dimensions: "15cm x 10cm x 4cm",
    rating: 4.4,
    reviewCount: 38,
  },
  {
    name: "Coconut Macaroons",
    slug: "coconut-macaroons",
    description:
      "Chewy coconut macaroons made with organic coconut flakes. Naturally sweet and completely vegan-friendly.",
    price: 6.99,
    originalPrice: 8.99,
    image: "/images/coconut-macaroons.png",
    images: ["/images/coconut-macaroons.png", "/images/coconut-macaroons-2.jpg"],
    stock: 20,
    category: "coconut",
    categories: ["gluten-free", "vegan"],
    isFeatured: true,
    ingredients:
      "Organic coconut flakes, organic coconut milk, organic maple syrup, organic vanilla extract, sea salt, organic coconut oil",
    nutritionalInfo: {
      servingSize: "2 macaroons (30g)",
      calories: 140,
      fat: "10g",
      saturatedFat: "8g",
      carbs: "12g",
      fiber: "3g",
      sugar: "9g",
      protein: "2g",
      sodium: "25mg",
    },
    allergens: [],
    benefits: ["Gluten-Free", "Vegan", "Natural Sweeteners", "Coconut Oil"],
    weight: "160g",
    dimensions: "15cm x 10cm x 4cm",
    rating: 4.9,
    reviewCount: 67,
  },
  {
    name: "Double Chocolate Fudge",
    slug: "double-chocolate-fudge",
    description:
      "Indulgent double chocolate biscuits with fudge pieces. For serious chocolate lovers who want the ultimate treat.",
    price: 7.49,
    originalPrice: 9.99,
    image: "/images/double-chocolate.png",
    images: ["/images/double-chocolate.png", "/images/double-chocolate-2.jpg"],
    stock: 14,
    category: "chocolate",
    categories: ["chocolate", "premium"],
    isFeatured: true,
    ingredients:
      "Organic flour, organic cocoa powder, organic butter, organic dark chocolate, organic sugar, organic eggs, vanilla extract, sea salt",
    nutritionalInfo: {
      servingSize: "2 biscuits (35g)",
      calories: 160,
      fat: "8g",
      saturatedFat: "5g",
      carbs: "18g",
      fiber: "2g",
      sugar: "12g",
      protein: "3g",
      sodium: "90mg",
    },
    allergens: ["Gluten", "Dairy", "Eggs"],
    benefits: ["Organic", "Premium Chocolate", "Rich Flavor", "Artisan Made"],
    weight: "200g",
    dimensions: "15cm x 10cm x 5cm",
    rating: 4.6,
    reviewCount: 89,
  },
  {
    name: "Ginger Snap Classics",
    slug: "ginger-snap-classics",
    description:
      "Traditional ginger snaps with warming spices. Crispy, spicy, and perfect for dunking in your favorite beverage.",
    price: 3.79,
    originalPrice: 4.99,
    image: "/images/ginger-snaps.png",
    images: ["/images/ginger-snaps.png", "/images/ginger-snaps-2.jpg"],
    stock: 22,
    category: "spice",
    categories: ["spice", "traditional"],
    isFeatured: false,
    ingredients:
      "Organic flour, organic molasses, organic butter, organic sugar, fresh ginger, cinnamon, cloves, nutmeg, baking soda, sea salt",
    nutritionalInfo: {
      servingSize: "4 biscuits (25g)",
      calories: 100,
      fat: "3g",
      saturatedFat: "2g",
      carbs: "17g",
      fiber: "1g",
      sugar: "8g",
      protein: "1g",
      sodium: "85mg",
    },
    allergens: ["Gluten", "Dairy"],
    benefits: ["Organic", "Warming Spices", "Traditional Recipe", "Low Fat"],
    weight: "170g",
    dimensions: "15cm x 10cm x 4cm",
    rating: 4.2,
    reviewCount: 31,
  },
]

const sampleReviews = [
  {
    rating: 5,
    comment:
      "Absolutely delicious! The chocolate chips are perfectly distributed and the texture is amazing. Will definitely order again!",
    isVerified: true,
  },
  {
    rating: 4,
    comment: "Great quality biscuits. My kids love them for their lunch boxes. The packaging keeps them fresh.",
    isVerified: true,
  },
  {
    rating: 5,
    comment: "Best organic biscuits I've ever had! You can really taste the quality of the ingredients.",
    isVerified: false,
  },
  {
    rating: 4,
    comment: "Love the vanilla flavor - it's not too sweet and has a lovely buttery texture.",
    isVerified: true,
  },
  {
    rating: 5,
    comment: "Perfect for my gluten-free diet. Finally found biscuits that don't compromise on taste!",
    isVerified: true,
  },
  {
    rating: 4,
    comment: "The almond crunch is incredible. Great protein content too. Highly recommend!",
    isVerified: false,
  },
  {
    rating: 5,
    comment: "These coconut macaroons are heavenly! So glad they're vegan-friendly.",
    isVerified: true,
  },
  {
    rating: 4,
    comment: "Nostalgic oatmeal raisin flavor. Reminds me of my grandmother's baking.",
    isVerified: true,
  },
]

async function main() {
  console.log("🌱 Starting database seed...")

  try {
    // Clear existing data
    console.log("🧹 Cleaning existing data...")
    await prisma.review.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.payment.deleteMany()
    await prisma.order.deleteMany()
    await prisma.address.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    // Create categories
    console.log("📂 Creating categories...")
    const createdCategories = []
    for (const category of categories) {
      const created = await prisma.category.create({
        data: category,
      })
      createdCategories.push(created)
      console.log(`✅ Created category: ${created.name}`)
    }

    // Create admin user
    console.log("👤 Creating admin user...")
    const adminPassword = await hashPassword("admin123")
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@organicbiscuits.com",
        password: adminPassword,
        phone: "+1234567890",
        isAdmin: true,
      },
    })
    console.log(`✅ Created admin: ${admin.email}`)

    // Create regular users
    console.log("👥 Creating regular users...")
    const users = []
    const userPassword = await hashPassword("user123")

    const userData = [
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1987654321",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1876543210",
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "+1765432109",
      },
    ]

    for (const user of userData) {
      const created = await prisma.user.create({
        data: {
          ...user,
          password: userPassword,
          isAdmin: false,
        },
      })
      users.push(created)
      console.log(`✅ Created user: ${created.email}`)
    }

    // Create products
    console.log("🍪 Creating products...")
    const createdProducts = []
    for (const product of products) {
      const created = await prisma.product.create({
        data: product,
      })
      createdProducts.push(created)
      console.log(`✅ Created product: ${created.name}`)
    }

    // Create addresses for users
    console.log("🏠 Creating addresses...")
    const addresses = [
      {
        userId: users[0].id,
        name: "John Doe",
        phone: "+1987654321",
        address: "123 Main Street, Apt 4B",
        pincode: "12345",
        city: "New York",
        state: "NY",
        country: "USA",
        landmark: "Near Central Park",
        isDefault: true,
      },
      {
        userId: users[1].id,
        name: "Jane Smith",
        phone: "+1876543210",
        address: "456 Oak Avenue",
        pincode: "67890",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        landmark: "Next to Starbucks",
        isDefault: true,
      },
      {
        userId: users[2].id,
        name: "Mike Johnson",
        phone: "+1765432109",
        address: "789 Pine Road",
        pincode: "54321",
        city: "Chicago",
        state: "IL",
        country: "USA",
        landmark: "Near Loop",
        isDefault: true,
      },
    ]

    const createdAddresses = []
    for (const address of addresses) {
      const created = await prisma.address.create({
        data: address,
      })
      createdAddresses.push(created)
      console.log(`✅ Created address for: ${address.name}`)
    }

    // Create reviews
    console.log("⭐ Creating reviews...")
    let reviewIndex = 0
    for (const product of createdProducts) {
      // Create 2-3 reviews per product
      const numReviews = Math.floor(Math.random() * 2) + 2
      for (let i = 0; i < numReviews; i++) {
        const user = users[Math.floor(Math.random() * users.length)]
        const review = sampleReviews[reviewIndex % sampleReviews.length]

        await prisma.review.create({
          data: {
            userId: user.id,
            productId: product.id,
            rating: review.rating,
            comment: review.comment,
            isVerified: review.isVerified,
          },
        })
        reviewIndex++
      }
      console.log(`✅ Created reviews for: ${product.name}`)
    }

    // Create sample carts
    console.log("🛒 Creating sample carts...")
    for (let i = 0; i < 2; i++) {
      const user = users[i]
      const cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
      })

      // Add 2-3 items to each cart
      const numItems = Math.floor(Math.random() * 2) + 2
      for (let j = 0; j < numItems; j++) {
        const product = createdProducts[Math.floor(Math.random() * createdProducts.length)]
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: product.price,
          },
        })
      }
      console.log(`✅ Created cart for: ${user.name}`)
    }

    // Create sample orders
    console.log("📦 Creating sample orders...")
    for (let i = 0; i < 3; i++) {
      const user = users[i]
      const address = createdAddresses[i]

      const order = await prisma.order.create({
        data: {
          userId: user.id,
          shippingId: address.id,
          totalAmount: 0, // Will update after adding items
          status: ["pending", "processing", "shipped", "delivered"][Math.floor(Math.random() * 4)],
          paymentStatus: ["unpaid", "paid"][Math.floor(Math.random() * 2)],
        },
      })

      // Add order items
      let totalAmount = 0
      const numItems = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numItems; j++) {
        const product = createdProducts[Math.floor(Math.random() * createdProducts.length)]
        const quantity = Math.floor(Math.random() * 2) + 1
        const itemTotal = product.price * quantity
        totalAmount += itemTotal

        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: quantity,
            price: product.price,
            name: product.name,
            image: product.image,
          },
        })
      }

      // Update order total
      await prisma.order.update({
        where: { id: order.id },
        data: { totalAmount },
      })

      // Create payment if order is paid
      if (order.paymentStatus === "paid") {
        await prisma.payment.create({
          data: {
            orderId: order.id,
            userId: user.id,
            method: "card",
            amount: totalAmount,
            status: "completed",
            transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
            paidAt: new Date(),
          },
        })
      }

      console.log(`✅ Created order for: ${user.name} ($${totalAmount.toFixed(2)})`)
    }

    console.log("\n🎉 Database seeded successfully!")
    console.log("\n📊 Summary:")
    console.log(`👤 Users: ${users.length + 1} (including admin)`)
    console.log(`📂 Categories: ${createdCategories.length}`)
    console.log(`🍪 Products: ${createdProducts.length}`)
    console.log(`🏠 Addresses: ${createdAddresses.length}`)
    console.log(`⭐ Reviews: Created for all products`)
    console.log(`🛒 Carts: 2 sample carts`)
    console.log(`📦 Orders: 3 sample orders`)

    console.log("\n🔑 Login Credentials:")
    console.log(`👨‍💼 Admin: admin@organicbiscuits.com / admin123`)
    console.log(`👤 User 1: john@example.com / user123`)
    console.log(`👤 User 2: jane@example.com / user123`)
    console.log(`👤 User 3: mike@example.com / user123`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
