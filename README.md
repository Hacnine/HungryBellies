# Food Delivery App - Complete Full-Stack Implementation

A production-ready full-stack food delivery platform with 6 phases of development completed.

**Tech Stack:**
- **Frontend:** React 18 + Vite + Redux Toolkit + Socket.IO Client + Stripe.js + Tailwind CSS
- **Backend:** Express.js + Prisma ORM + MongoDB + Redis + Socket.IO + Stripe API + Nodemailer
- **DevOps:** Docker + Docker Compose + GitHub Actions + CI/CD Pipelines
- **Real-time:** Socket.IO for live order tracking and driver location updates
- **Payments:** Stripe integration with webhook support
- **Testing:** Jest + Supertest

## All 6 Phases Complete

- **Phase 1:** ✅ Auth System (JWT + Roles)
- **Phase 2:** ✅ Menu CRUD + Cart + Checkout
- **Phase 3:** ✅ Orders Management + Admin Panel
- **Phase 4:** ✅ Stripe Payments + Email Notifications
- **Phase 5:** ✅ Real-time Socket.IO + Driver Tracking
- **Phase 6:** ✅ Coupons + Tests + CI/CD + Deployment

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- pnpm or npm

### Setup

1. **Clone and install:**
   \`\`\`bash
   git clone <repository>
   cd food-delivery-app
   npm install
   \`\`\`

2. **Start Docker services:**
   \`\`\`bash
   npm run docker:up
   \`\`\`

3. **Initialize database:**
   \`\`\`bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   \`\`\`

4. **Configure environment variables:**
   \`\`\`bash
   # Backend
   cp apps/api/.env.example apps/api/.env
   
   # Frontend
   cp apps/web/.env.example apps/web/.env
   \`\`\`

5. **Start development servers:**
   \`\`\`bash
   npm run dev
   \`\`\`

**Access the app:**
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

**Test credentials (seeded):**
- Admin: admin@fooddelivery.com / admin123
- User: user@fooddelivery.com / user123

## Project Structure

\`\`\`
food-delivery-app/
├── apps/
│   ├── api/                    # Express backend
│   │   ├── src/
│   │   │   ├── routes/         # API endpoints
│   │   │   ├── middlewares/    # Auth, error handling
│   │   │   ├── utils/          # Helpers & socket handlers
│   │   │   ├── tests/          # Jest tests
│   │   │   └── index.js
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── migrations/
│   │   ├── scripts/
│   │   │   └── seed.js         # Database seeding
│   │   └── package.json
│   └── web/                    # React frontend
│       ├── src/
│       │   ├── components/     # Reusable components
│       │   ├── pages/          # Page components
│       │   ├── store/          # Redux slices
│       │   ├── api/            # API client
│       │   ├── hooks/          # Custom hooks
│       │   └── App.jsx
│       └── package.json
├── .github/
│   └── workflows/              # CI/CD pipelines
│       ├── test.yml
│       ├── staging-deploy.yml
│       └── production-deploy.yml
├── docker-compose.yml          # Development
├── docker-compose.staging.yml  # Staging
├── docker-compose.production.yml # Production
├── Dockerfile
├── README.md
├── SETUP_GUIDE.md              # Detailed setup instructions
├── DEPLOYMENT_GUIDE.md         # Deployment documentation
└── package.json
\`\`\`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

### Menu Management
- `GET /menu` - Get all menu items
- `GET /menu/categories` - Get categories
- `POST /menu` - Create item (admin)
- `PUT /menu/:id` - Update item (admin)
- `DELETE /menu/:id` - Delete item (admin)

### Orders
- `POST /orders` - Place new order
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/status` - Update status (admin)

### Coupons
- `POST /coupons/validate` - Validate coupon code
- `POST /coupons/create` - Create coupon (admin)
- `GET /coupons/list` - List coupons (admin)
- `PUT /coupons/:id` - Update coupon (admin)
- `DELETE /coupons/:id` - Delete coupon (admin)

### Payments
- `POST /payments/create-intent` - Create Stripe PaymentIntent
- `POST /payments/webhook` - Stripe webhook handler

### Admin
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/orders` - All orders
- `POST /admin/drivers` - Create driver
- `GET /admin/drivers` - List drivers

### Drivers
- `POST /drivers` - Create driver
- `GET /drivers` - List drivers
- `PUT /drivers/:id` - Update driver

## Database Schema

### User
- id (ObjectId)
- name, email, password (hashed)
- role (user/admin)
- createdAt, updatedAt

### Order
- id, userId, items (JSON)
- total, status, steps (JSON)
- paid, coupons (JSON), driverId
- createdAt, updatedAt

### Menu
- id, name, description, price, image
- category, available
- createdAt, updatedAt

### Coupon
- id, code (unique), description
- discountType (PERCENTAGE/FIXED), discountValue
- maxUses, usedCount, expiresAt, minOrderValue
- active, createdAt, updatedAt

### Driver
- id, name, email, phone
- vehicle, licensePlate, rating
- available, currentOrderId
- createdAt, updatedAt

## Real-time Features (Socket.IO)

**Client to Server:**
- `join_order` - Join order room for updates
- `leave_order` - Leave order room
- `driver:location_update` - Send driver location

**Server to Client:**
- `order:status_updated` - Order status changed
- `order:driver_assigned` - Driver assigned
- `driver:location` - Driver location update

## Testing

\`\`\`bash
# Run all tests
npm run test

# Run API tests
npm run test:api

# Run web tests
npm run test:web

# Watch mode
npm run test:watch
\`\`\`

## Deployment

### Staging (from develop branch)
\`\`\`bash
git push origin develop
\`\`\`

Automatically triggers:
1. Tests run
2. Docker image builds
3. Push to registry
4. Deploy to staging server

### Production (from main branch)
\`\`\`bash
git push origin main
\`\`\`

Same pipeline + Slack notifications

**Required GitHub Secrets:**
- `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `DOCKER_REGISTRY`
- `STAGING_SERVER_HOST`, `STAGING_SERVER_USER`, `STAGING_SSH_KEY`
- `PRODUCTION_SERVER_HOST`, `PRODUCTION_SERVER_USER`, `PRODUCTION_SSH_KEY`
- `SLACK_WEBHOOK` (optional)

## Environment Variables

### Backend (.env)
\`\`\`
DATABASE_URL=mongodb://mongo:27017/food_delivery
REDIS_URL=redis://redis:6379
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
PORT=4000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
\`\`\`

### Frontend (.env)
\`\`\`
VITE_API_URL=http://localhost:4000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
\`\`\`

## Development Scripts

\`\`\`bash
# Development
npm run dev           # Start both servers
npm run dev:api      # Start API only
npm run dev:web      # Start frontend only

# Build
npm run build        # Build both apps

# Testing
npm run test         # Run all tests
npm run test:api     # API tests
npm run test:web     # Web tests
npm run lint         # Lint code

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run seed              # Seed test data

# Docker
npm run docker:up    # Start services
npm run docker:down  # Stop services
npm run docker:logs  # View logs
npm run docker:build # Build image
\`\`\`

## Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Local development setup with troubleshooting
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment and monitoring

## Key Features

✅ **Authentication** - JWT with refresh tokens, password hashing  
✅ **Role-based Access** - Admin and user roles with middleware  
✅ **Menu Management** - Full CRUD with categories  
✅ **Shopping Cart** - Redux-managed cart state  
✅ **Order Placement** - Order creation with delivery info  
✅ **Payment Processing** - Stripe integration with webhooks  
✅ **Order Tracking** - Real-time status updates via Socket.IO  
✅ **Driver Management** - Driver assignment and location tracking  
✅ **Coupon System** - Percentage and fixed discounts with validation  
✅ **Admin Dashboard** - Order management and statistics  
✅ **Email Notifications** - Order confirmations and status emails  
✅ **CI/CD Pipelines** - Automated testing and deployment  
✅ **Docker Support** - Multi-stage builds for staging/production  

## License

MIT

## Support

For issues or questions, open a GitHub issue or check the documentation files.
