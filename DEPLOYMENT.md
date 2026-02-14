# 🚀 Complete Setup & Deployment Guide

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Database Configuration](#database-configuration)
3. [Environment Variables](#environment-variables)
4. [Deployment](#deployment)
5. [Troubleshooting](#troubleshooting)
6. [Performance Tuning](#performance-tuning)

---

## Local Development Setup

### Step 1: Clone Repository

```bash
cd /workspaces/real-state-crm

# If starting fresh
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Setup Environment Variables

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local  # or use your preferred editor
```

### Step 4: Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create/push schema to database
npx prisma db push

# (Optional) Seed database with sample data
# Update package.json prisma: { seed: "node prisma/seed.ts" }
npx prisma db seed
```

### Step 5: Generate NextAuth Secret

```bash
# Generate secret key
openssl rand -base64 32

# Copy the output and add to .env.local
# NEXTAUTH_SECRET=<your-output-here>
```

### Step 6: Start Development Server

```bash
npm run dev

# Server starts at http://localhost:3000
# API at http://localhost:3000/api
```

### Step 7: Create Admin User (if database is empty)

Use the registration form or create directly in database:

```sql
-- Run in your PostgreSQL client
INSERT INTO "User" (
  id, email, password, "firstName", "lastName", phone, role, "isActive", "createdAt", "updatedAt"
) VALUES (
  'admin-id-123',
  'admin@recrm.com',
  '$2a$10$...', -- bcrypt hash of "password123"
  'Admin',
  'User',
  '+91 9876543210',
  'ADMIN',
  true,
  NOW(),
  NOW()
);
```

Or use the seed file to populate demo data.

---

## Database Configuration

### Option 1: Local PostgreSQL

#### Install PostgreSQL

**macOS (using Homebrew)**:
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Linux**:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**Windows**:
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

#### Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE real_estate_crm;

# Create user
CREATE USER recrm_user WITH PASSWORD 'secure_password';

# Grant privileges
ALTER ROLE recrm_user SET client_encoding TO 'utf8';
ALTER ROLE recrm_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE recrm_user SET default_transaction_deferrable TO on;
ALTER ROLE recrm_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE real_estate_crm TO recrm_user;

# Exit
\q
```

#### Update .env.local

```env
DATABASE_URL="postgresql://recrm_user:secure_password@localhost:5432/real_estate_crm"
DIRECT_URL="postgresql://recrm_user:secure_password@localhost:5432/real_estate_crm"
```

### Option 2: Supabase (Recommended for Production)

Supabase is PostgreSQL as a service - simplest way to get production database.

#### Setup Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create new project
4. Choose region (select closest to your users)
5. Set password
6. Wait for project to be created (~2 minutes)

#### Get Connection String

1. In Supabase dashboard, go to Settings → Database
2. Find "Connection pooling" section
3. Copy "Connection string" (bottom one under "Connection pooling")
4. Update .env.local:

```env
DATABASE_URL="postgresql-pooling-url-from-supabase"
DIRECT_URL="postgresql-direct-url-from-supabase"
```

#### Push Schema

```bash
npx prisma db push
```

### Option 3: Railway.app (Budget-Friendly)

1. Visit [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Create new project
4. Add PostgreSQL database plugin
5. Generate credentials
6. Copy DATABASE_URL to .env.local
7. Run: `npx prisma db push`

---

## Environment Variables

### Complete Configuration

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
# Connection URL for your PostgreSQL database
DATABASE_URL="postgresql://user:password@host:5432/dbname"
# Direct connection URL (without pooling) for migrations
DIRECT_URL="postgresql://user:password@host:5432/dbname"

# ============================================
# AUTHENTICATION (NextAuth)
# ============================================
# Your application URL
NEXTAUTH_URL="http://localhost:3000"
# Or in production:
# NEXTAUTH_URL="https://yourdomain.com"

# Secret key for JWT signing (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret-here"

# ============================================
# API CONFIGURATION
# ============================================
# Public API URL (frontend can access)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# ============================================
# OPTIONAL: EXTERNAL SERVICES
# ============================================

# OpenAI API for AI-powered follow-ups
OPENAI_API_KEY="sk-proj-xxxxx"

# Stripe for payment processing
STRIPE_SECRET_KEY="sk_test_xxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# Email Service (SendGrid)
SENDGRID_API_KEY="SG.xxxxx"

#  SMS & WhatsApp (Twilio)
TWILIO_ACCOUNT_SID="ACxxxxx"
TWILIO_AUTH_TOKEN="your-token"
TWILIO_PHONE_NUMBER="+1234567890"

# ============================================
# APPLICATION CONFIG
# ============================================
NODE_ENV="development"  # development, production, test
ENVIRONMENT="development"

# ============================================
# LOGGING & DEBUG
# ============================================
DEBUG="true"
LOG_LEVEL="debug"      # debug, info, warn, error
```

### Development vs Production

**Development (.env.local)**:
```env
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
DEBUG="true"
```

**Production (.env.production)**:
```env
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"
DEBUG="false"
```

---

## Deployment

### Deploy to Vercel (Recommended)

Vercel is the creator of Next.js and offers one-click deployment.

#### Prerequisites
- GitHub account with your repository
- Database (Supabase recommended)

#### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your repository

3. **Configure Environment Variables**
   - Go to project Settings → Environment Variables
   - Add all variables from .env.local:
     - DATABASE_URL
     - DIRECT_URL
     - NEXTAUTH_URL
     - NEXTAUTH_SECRET
     - NEXT_PUBLIC_APP_URL
     - NEXT_PUBLIC_API_URL
     - (Any other API keys)

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys
   - Get your domain (e.g., `your-app.vercel.app`)

5. **Post-Deployment**
   - Update NEXTAUTH_URL to your domain
   - Run migrations: `npx prisma migrate deploy`
   - Test application at your URL

#### Custom Domain

1. In Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records at your domain registrar
4. Point to Vercel nameservers
5. Update NEXTAUTH_URL and URLs in environment

### Deploy to Railway

Railway is very beginner-friendly and includes PostgreSQL.

#### Steps

1. Sign up at [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Add PostgreSQL plugin
5. Configure:
   - Environment variables
   - PORT (usually 3000)
   - CMD: `npm run build && npm start`
6. Deploy

### Deploy to DigitalOcean

Using App Platform for Next.js + Managed Database.

#### Steps

1. Create App Platform app
2. Connect GitHub repository
3. Configure:
   - Build command: `npm run build`
   - Run command: `npm start`
4. Create Managed PostgreSQL database
5. Set DATABASE_URL to database connection string
6. Deploy

### Deploy to AWS

Using Amplify for Next.js + RDS for PostgreSQL.

#### Steps

1. Push code to GitHub
2. In AWS Amplify Console → Connect app
3. Select GitHub repository and branch
4. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       build:
         commands:
           - npm install
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```
5. Create RDS PostgreSQL instance
6. Set environment variables in Amplify console
7. Deploy

---

## Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`

```bash
# Test PostgreSQL connection
psql $DATABASE_URL -c "SELECT NOW();"

# If using Supabase, check:
# 1. Project is running (check dashboard)
# 2. Connection string is correct
# 3. IP whitelist (Supabase allows all by default)
```

**Solution**: Verify DATABASE_URL format is correct

### Prisma Issues

**Error**: `Prisma Client not found`

```bash
# Reinstall and regenerate
npm install
npx prisma generate --force
```

**Error**: `Migration pending`

```bash
# Deploy migrations
npx prisma migrate deploy

# Or push schema directly (development only)
npx prisma db push
```

### NextAuth Errors

**Error**: `Invalid callback URL`

Make sure NEXTAUTH_URL matches your domain exactly:
```env
# For localhost development
NEXTAUTH_URL="http://localhost:3000"

# For production
NEXTAUTH_URL="https://yourdomain.com"
```

**Error**: `NEXTAUTH_SECRET undefined`

```bash
# Generate new secret
openssl rand -base64 32

# Add to .env.local or Vercel environment variables
NEXTAUTH_SECRET="your-generated-value"
```

### Build Errors

**Error**: `TypeScript compilation failed`

```bash
# Check for errors
npx tsc --noEmit

# Fix errors in your code, then:
npm run build
```

**Error**: `Module not found`

```bash
# Ensure all dependencies are installed
npm install

# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

---

## Performance Tuning

### Database Optimization

```prisma
# Add indexes for frequently queried fields
model Property {
  @@index([agentId])
  @@index([status])
  @@index([city])
  @@fulltext([title, description, address])
}
```

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/property.jpg"
  alt="Property"
  width={500}
  height={300}
  priority={false}
  loading="lazy"
/>
```

### Caching Strategy

Add to API routes:
```typescript
// Cache for 5 minutes
res.setHeader('Cache-Control', 'public, s-maxage=300')

// Cache for 1 hour (CDN)
res.setHeader('Cache-Control', 'public, s-maxage=3600')
```

### Monitoring

Set up monitoring for production:

1. **Error Tracking**: [Sentry](https://sentry.io)
2. **Analytics**: Vercel Analytics
3. **Performance**: Web Vitals
4. **Logs**: Vercel Logs or custom logging

---

## Security Checklist

- ✅ Change default passwords
- ✅ Generate secure NEXTAUTH_SECRET
- ✅ Use HTTPS in production
- ✅ Set Up CSP headers
- ✅ Enable database backups
- ✅ Regular security updates
- ✅ Monitor suspicious activities
- ✅ Implement rate limiting
- ✅ Keep dependencies updated

---

## Maintenance

### Regular Tasks

```bash
# Update dependencies monthly
npm update
npm audit fix

# Check for security vulnerabilities
npm audit

# Backup database daily (automated in most services)

# Monitor logs and errors weekly
# Review performance metrics

# Update Next.js and other packages
npm outdated
```

### Database Backups

- **Supabase**: Automatic daily backups (included)
- **Railway**: Automatic backups
- **Self-hosted**: Set up automated backups

---

## Support

For issues or questions:

1. Check [README.md](./README.md)
2. Check [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Review GitHub Issues
4. Create new issue with details

---

**Last Updated**: February 2024
