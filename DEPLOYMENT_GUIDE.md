# Deployment Guide

## Prerequisites

- Docker & Docker Compose installed
- SSH access to staging/production servers
- GitHub repository with secrets configured
- Docker registry (Docker Hub, ECR, or private registry)
- Stripe account with API keys
- Email service (Gmail, SendGrid, etc.)

## Step 1: Prepare Servers

### Staging Server
\`\`\`bash
# SSH into staging server
ssh user@staging.example.com

# Create app directory
mkdir -p /app
cd /app

# Create .env files
cat > .env.staging << EOF
DATABASE_URL=mongodb://mongo:27017/food_delivery_staging
REDIS_URL=redis://redis:6379
JWT_SECRET=$(openssl rand -base64 32)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FRONTEND_ORIGIN=https://staging.fooddelivery.com
EOF

# Copy docker-compose.staging.yml
# (This will be done by the deployment script)
\`\`\`

### Production Server
\`\`\`bash
# SSH into production server
ssh user@production.example.com

# Create app directory
mkdir -p /app
cd /app

# Create .env files with production credentials
cat > .env.production << EOF
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/food_delivery
REDIS_URL=redis://redis-cluster:6379
JWT_SECRET=$(openssl rand -base64 32)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxx
FRONTEND_ORIGIN=https://fooddelivery.com
EOF
\`\`\`

## Step 2: Configure GitHub Secrets

In your GitHub repository settings, add these secrets:

\`\`\`
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password
DOCKER_REGISTRY=docker.io/your_username

STAGING_SERVER_HOST=staging.example.com
STAGING_SERVER_USER=deploy_user
STAGING_SSH_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----

PRODUCTION_SERVER_HOST=production.example.com
PRODUCTION_SERVER_USER=deploy_user
PRODUCTION_SSH_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----

SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
\`\`\`

## Step 3: Generate SSH Keys

\`\`\`bash
# On your local machine
ssh-keygen -t rsa -b 4096 -f deploy_key -N ""

# Copy public key to servers
ssh-copy-id -i deploy_key.pub user@staging.example.com
ssh-copy-id -i deploy_key.pub user@production.example.com

# Copy private key content to GitHub secret
cat deploy_key | base64
\`\`\`

## Step 4: Deploy

### Automatic Deployment

**To Staging**:
\`\`\`bash
git push origin develop
\`\`\`

**To Production**:
\`\`\`bash
git push origin main
\`\`\`

The GitHub Actions workflows will automatically:
1. Run tests
2. Build Docker image
3. Push to registry
4. Deploy to server
5. Notify Slack on completion

### Manual Deployment

\`\`\`bash
# SSH to server
ssh user@server.example.com

# Pull latest image
docker pull your_registry/food-delivery-app:staging

# Update services
docker-compose -f docker-compose.staging.yml pull
docker-compose -f docker-compose.staging.yml up -d

# View logs
docker-compose logs -f api

# Run migrations if needed
docker-compose exec api npx prisma migrate deploy
\`\`\`

## Monitoring

### Check Service Status
\`\`\`bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f api
docker-compose logs -f mongo
docker-compose logs -f redis

# Check API health
curl http://localhost:4000/health
\`\`\`

### Database Backups

\`\`\`bash
# Backup MongoDB
docker-compose exec mongo mongodump --out /backup

# Restore MongoDB
docker-compose exec mongo mongorestore /backup
\`\`\`

### Scaling

To scale services in production:

\`\`\`bash
# Update docker-compose.production.yml
services:
  api:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
\`\`\`

## Troubleshooting

### API won't start
\`\`\`bash
# Check logs
docker-compose logs api

# Verify environment variables
docker-compose exec api env | grep DATABASE_URL

# Check database connection
docker-compose exec mongo mongo --eval "db.adminCommand('ping')"
\`\`\`

### Database connection issues
\`\`\`bash
# Verify MongoDB is running
docker-compose exec mongo mongosh

# Check Redis connection
docker-compose exec redis redis-cli ping
\`\`\`

### Payment webhook failing
1. Verify Stripe webhook secret in .env
2. Check ngrok/tunnel for local testing: `ngrok http 4000`
3. Add webhook URL to Stripe dashboard: `https://your_domain/payments/webhook`

## Rollback

\`\`\`bash
# Deploy previous version
docker pull your_registry/food-delivery-app:staging-v1.0.0
docker-compose up -d --force-recreate
\`\`\`

## Performance Tuning

### MongoDB
\`\`\`js
// Create indexes
db.orders.createIndex({ userId: 1, createdAt: -1 })
db.orders.createIndex({ status: 1 })
\`\`\`

### Redis Caching
\`\`\`js
// Cache frequently accessed data
await redis.setex(`menu:${id}`, 3600, JSON.stringify(menu))
\`\`\`

### API Rate Limiting
\`\`\`js
const rateLimit = require('express-rate-limit')
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))
