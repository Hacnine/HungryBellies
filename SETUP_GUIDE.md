# Setup Guide

## Local Development Setup

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/yourusername/food-delivery-app.git
cd food-delivery-app
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables

**Backend (.env)**:
\`\`\`bash
cp apps/api/.env.example apps/api/.env
\`\`\`

Edit `apps/api/.env`:
\`\`\`
DATABASE_URL=mongodb://mongo:27017/food_delivery
REDIS_URL=redis://redis:6379
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Stripe (get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_test_your_key

# Email (Gmail example - use app password, not regular password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@fooddelivery.com

# Server
PORT=4000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
\`\`\`

**Frontend (.env)**:
\`\`\`bash
cp apps/web/.env.example apps/web/.env
\`\`\`

Edit `apps/web/.env`:
\`\`\`
VITE_API_URL=http://localhost:4000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
\`\`\`

### 4. Start Docker Services
\`\`\`bash
npm run docker:up
\`\`\`

This starts MongoDB and Redis in Docker containers.

### 5. Initialize Database
\`\`\`bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed test data
npm run seed
\`\`\`

### 6. Start Development Servers
\`\`\`bash
npm run dev
\`\`\`

Both servers will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### 7. Test the Application

**Test User Accounts** (seeded data):
\`\`\`
Admin:
- Email: admin@fooddelivery.com
- Password: admin123

User:
- Email: user@fooddelivery.com
- Password: user123
\`\`\`

**Test Stripe Payment**:
Use card number: `4242 4242 4242 4242`
Any future expiry date and any CVC

## API Documentation

### Authentication Flow

1. **Register**
\`\`\`bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'
\`\`\`

2. **Login**
\`\`\`bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
\`\`\`

Response includes `accessToken` and sets `refreshToken` in httpOnly cookie.

3. **Make Authenticated Requests**
\`\`\`bash
curl -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
\`\`\`

### Coupon Flow

1. **Create Coupon (Admin)**
\`\`\`bash
curl -X POST http://localhost:4000/coupons/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "code":"SAVE10",
    "description":"10% off",
    "discountType":"PERCENTAGE",
    "discountValue":10,
    "minOrderValue":20
  }'
\`\`\`

2. **Validate Coupon (Public)**
\`\`\`bash
curl -X POST http://localhost:4000/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code":"SAVE10",
    "orderTotal":50
  }'
\`\`\`

## Troubleshooting

### MongoDB Connection Failed
\`\`\`bash
# Check if MongoDB is running
docker ps | grep mongo

# Restart MongoDB
npm run docker:down
npm run docker:up
\`\`\`

### Port Already in Use
\`\`\`bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
\`\`\`

### Prisma Migration Issues
\`\`\`bash
# Reset database (WARNING: deletes all data)
cd apps/api
npx prisma migrate reset

# Then reseed
npm run seed
\`\`\`

### Email Not Sending
1. Enable "Less secure app access" in Gmail settings
2. Or use app-specific password: https://myaccount.google.com/apppasswords
3. Check SMTP credentials in .env

### Socket.IO Connection Issues
1. Verify FRONTEND_ORIGIN in API .env
2. Check browser console for connection errors
3. Ensure API server is running on correct port

## Development Tips

### Using Redux DevTools
Install Redux DevTools browser extension to debug state changes.

### Testing Socket.IO Events
\`\`\`javascript
// Open browser console
const socket = io('http://localhost:4000')
socket.on('connect', () => console.log('Connected'))
socket.emit('join_order', 'orderId123')
\`\`\`

### Database GUI
Install MongoDB Compass to browse database visually:
https://www.mongodb.com/products/compass

### API Testing
Use Postman or Insomnia:
- Postman: https://www.postman.com/downloads/
- Insomnia: https://insomnia.rest/download

### Code Formatting
\`\`\`bash
npm run lint
\`\`\`

## Next Steps

1. Customize branding and colors
2. Add more menu categories
3. Implement email templates
4. Set up analytics
5. Deploy to staging/production
