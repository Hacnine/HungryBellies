# Stripe Integration Setup

## Prerequisites
1. Create a Stripe account at https://stripe.com
2. Get your API keys from Dashboard > Developers > API keys

## Backend Setup

### 1. Environment Variables
Add to `apps/api/.env`:
\`\`\`
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
\`\`\`

### 2. Install Dependencies
\`\`\`bash
cd apps/api
pnpm install
\`\`\`

### 3. Webhook Setup
Create a webhook endpoint in Stripe Dashboard:
- Go to Developers > Webhooks
- Add endpoint: `https://yourdomain.com/payments/webhook`
- Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Frontend Setup

### 1. Environment Variables
Add to `apps/web/.env`:
\`\`\`
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
VITE_API_URL=http://localhost:4000
\`\`\`

### 2. Install Dependencies
\`\`\`bash
cd apps/web
pnpm install
\`\`\`

## Testing

### Local Testing with Stripe CLI
\`\`\`bash
# Install Stripe CLI from https://stripe.com/docs/stripe-cli

# Forward webhooks to local server
stripe listen --forward-to localhost:4000/payments/webhook

# Get webhook secret and add to .env
\`\`\`

### Test Payment Info
- Card Number: 4242 4242 4242 4242
- Expiry: 12/25
- CVC: 123

## Email Configuration

### Gmail Setup
1. Enable 2FA on your Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password in `EMAIL_PASSWORD`

### Alternative Email Providers
- SendGrid: Update EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD
- Mailgun: Same setup
- AWS SES: Configure with AWS credentials
\`\`\`
</parameter>
