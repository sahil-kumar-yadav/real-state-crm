# Real Estate CRM - Architecture & Implementation Guide

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Database Schema & ER Diagram](#database-schema--er-diagram)
3. [Folder Structure](#folder-structure)
4. [API Routes & Endpoints](#api-routes--endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Feature Implementation](#feature-implementation)
7. [Deployment Guide](#deployment-guide)
8. [Performance & Scalability](#performance--scalability)

---

## System Architecture

### 🏗️ Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Styling**: Tailwind CSS
- **Validation**: Zod schemas
- **State Management**: Zustand (optional)
- **External Services**:
  - OpenAI API (AI follow-ups)
  - Stripe (SaaS payments)
  - SendGrid/Twilio (Communications)

### 🏛️ Architecture Layers

```
┌─────────────────────────────────────────────┐
│         Client Layer (React/Next.js)        │
│  - Pages, Components, Hooks                 │
└────────────────────┬────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│      API Layer (Next.js API Routes)         │
│  - /api/properties, /api/leads, etc.        │
│  - Authentication & Authorization           │
└────────────────────┬────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│   Business Logic Layer (Lib Functions)      │
│  - Validations, Permissions, Utilities      │
└────────────────────┬────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│      Data Access Layer (Prisma ORM)         │
│  - Database queries, Models                 │
└────────────────────┬────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│        Database Layer (PostgreSQL)          │
│  - Persistent data storage                  │
└─────────────────────────────────────────────┘
```

---

## Database Schema & ER Diagram

### ER Diagram (ASCII)

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ email       │
│ password    │
│ role        │◄──────┐
│ firstName   │       │
│ lastName    │       │
│ phone       │       │
│ isActive    │       │
│ createdAt   │       │
└─────────────┘       │
      ▲               │
      │        ┌──────┴──────────┐
      │        │                 │
      │    ┌───────────┐      ┌──────────────┐
      │    │AgentDetails│      │  Property   │
      │    ├───────────┤      ├─────────────┤
      │    │ id        │      │ id          │
      │    │ status    │      │ title       │
      │    │ commRate  │      │ type        │
      │    │ totalSales│      │ status      │
      │    └───────────┘      │ price       │
      │                       │ agentId (FK)│──┐
      │                       │ address     │  │
      │                       │ city        │  │
      │                       │ images      │  │
      │                       └─────────────┘  │
      │                            ▲           │
      │                            │           │
      │                       ┌─────────────┐  │
      │                       │PropertyImage│  │
      │                       ├─────────────┤  │
      │                       │ propertyId  │◄─┙
      │                       │ url         │
      │                       │ isPrimary   │
      │                       └─────────────┘
      │
      ├──┐
      │  │
┌─────────────┐         ┌──────────────┐
│   Lead      │         │ Activity     │
├─────────────┤◄────────├──────────────┤
│ id          │         │ leadId   (FK)│
│ firstName   │         │ type         │
│ lastName    │         │ title        │
│ email       │         │ notes        │
│ phone       │         │ createdAt    │
│ type        │         └──────────────┘
│ source      │
│ status      │         ┌──────────────────┐
│ budgetMin   │         │ PropertyVisit    │
│ budgetMax   │◄────────├──────────────────┤
│ agentId (FK)├────┐    │ leadId       (FK)│
│ propertyId  │    │    │ propertyId   (FK)│
│ createdAt   │    │    │ agentId      (FK)│
└─────────────┘    │    │ status           │
                   │    │ scheduledAt      │
                   │    │ feedback         │
                   │    └──────────────────┘
                   │
                   └──→ ┌──────────────────┐
                       │ Commission       │
                       ├──────────────────┤
                       │ agentId      (FK)│
                       │ propertyId   (FK)│
                       │ percentage       │
                       │ commissionAmount │
                       │ status           │
                       │ paidAt           │
                       └──────────────────┘
```

### Key Relationships

| Relationship | Type | Description |
|---|---|---|
| User ↔ Property | 1:M | One agent manages many properties |
| User ↔ Lead | 1:M | One agent manages many leads |
| User ↔ PropertyVisit | 1:M | One agent conducts many visits |
| Lead ↔ PropertyVisit | 1:M | One lead can have multiple visits |
| Property ↔ PropertyVisit | 1:M | One property has many visits |
| Lead ↔ Activity | 1:M | One lead has activity history |
| User ↔ Commission | 1:M | Track agent commissions |
| Property ↔ Commission | 1:M | Multiple commissions per property |

---

## Folder Structure

```
real-estate-crm/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...]nextauth]/route.ts    # NextAuth handler
│   │   │   └── register/route.ts           # Registration endpoint
│   │   ├── properties/
│   │   │   ├── route.ts                    # GET, POST properties
│   │   │   └── [id]/
│   │   │       ├── route.ts                # GET, PUT, DELETE single property
│   │   │       └── images/route.ts         # Image upload
│   │   ├── leads/
│   │   │   ├── route.ts                    # GET, POST leads
│   │   │   ├── [id]/route.ts               # GET, PUT, DELETE lead
│   │   │   ├── [id]/activities/route.ts    # Lead activities
│   │   │   └── [id]/follow-up/route.ts     # AI follow-up suggestions
│   │   ├── visits/
│   │   │   ├── route.ts                    # GET, POST visits
│   │   │   └── [id]/route.ts               # GET, PUT visit status
│   │   ├── commissions/
│   │   │   ├── route.ts                    # GET, POST commissions
│   │   │   └── [id]/route.ts               # GET, PUT commission
│   │   ├── agents/
│   │   │   ├── route.ts                    # GET agents (admin)
│   │   │   ├── [id]/performance/route.ts   # Agent performance
│   │   │   └── [id]/commissions-summary/route.ts
│   │   ├── analytics/
│   │   │   ├── dashboard/route.ts          # Admin dashboard stats
│   │   │   ├── agent-performance/route.ts  # Agent metrics
│   │   │   └── reports/route.ts            # Generate reports
│   │   └── admin/
│   │       ├── users/route.ts              # User management
│   │       └── settings/route.ts           # System settings
│   ├── auth/
│   │   ├── login/page.tsx                  # Login page
│   │   ├── register/page.tsx               # Register page
│   │   └── error/page.tsx                  # Auth errors
│   ├── dashboard/
│   │   ├── layout.tsx                      # Dashboard layout
│   │   ├── page.tsx                        # Dashboard home
│   │   ├── properties/
│   │   │   ├── page.tsx                    # Properties list
│   │   │   ├── new/page.tsx                # Add property form
│   │   │   └── [id]/
│   │   │       ├── page.tsx                # Property details
│   │   │       └── edit/page.tsx           # Edit property
│   │   ├── leads/
│   │   │   ├── page.tsx                    # Leads list
│   │   │   ├── new/page.tsx                # Add lead form
│   │   │   └── [id]/
│   │   │       ├── page.tsx                # Lead details
│   │   │       └── edit/page.tsx           # Edit lead
│   │   ├── visits/
│   │   │   ├── page.tsx                    # Visits list
│   │   │   ├── new/page.tsx                # Schedule visit
│   │   │   └── [id]/page.tsx               # Visit details
│   │   ├── commissions/
│   │   │   ├── page.tsx                    # Commissions list
│   │   │   └── [id]/page.tsx               # Commission details
│   │   ├── analytics/
│   │   │   ├── page.tsx                    # Analytics dashboard
│   │   │   └── reports/page.tsx            # Reports
│   │   └── settings/
│   │       ├── page.tsx                    # User settings
│   │       ├── profile/page.tsx            # Profile settings
│   │       └── organization/page.tsx       # Organization settings
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx         # Main dashboard wrapper
│   │   │   ├── Navbar.tsx                  # Navigation bar
│   │   │   └── Sidebar.tsx                 # Sidebar navigation
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx                # Stat card component
│   │   │   ├── PropertyCard.tsx
│   │   │   └── LeadCard.tsx
│   │   ├── forms/
│   │   │   ├── PropertyForm.tsx            # Property form
│   │   │   ├── LeadForm.tsx                # Lead form
│   │   │   └── VisitForm.tsx               # Visit form
│   │   ├── modals/
│   │   │   └── ConfirmDialog.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       └── Modal.tsx
│   ├── hooks/
│   │   ├── useUser.ts                      # Current user hook
│   │   ├── useProperties.ts                # Properties hook
│   │   ├── useLeads.ts                     # Leads hook
│   │   └── useAsync.ts                     # Generic async hook
│   ├── types/
│   │   ├── models.ts                       # Database model types
│   │   ├── api.ts                          # API response types
│   │   └── forms.ts                        # Form input types
│   ├── globals.css                         # Global styles
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Home page
│   └── providers.tsx                       # Provider wrappers
├── lib/
│   ├── auth.ts                             # NextAuth configuration
│   ├── prisma.ts                           # Prisma client
│   ├── api-response.ts                     # Response helpers
│   ├── validations.ts                      # Zod schemas
│   ├── utils.ts                            # Utility functions
│   └── constants.ts                        # App constants
├── prisma/
│   ├── schema.prisma                       # Database schema
│   ├── migrations/                         # Database migrations
│   └── seed.ts                             # Database seeding
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── middleware.ts                           # Next.js middleware
├── next.config.js                          # Next config
├── tailwind.config.js                      # Tailwind config
├── postcss.config.js                       # PostCSS config
├── tsconfig.json                           # TypeScript config
├── package.json                            # Dependencies
├── .env.example                            # Environment variables template
├── .eslintrc.json                          # ESLint config
├── README.md                               # Project documentation
└── ARCHITECTURE.md                         # This file
```

---

## API Routes & Endpoints

### Authentication
```
POST   /api/auth/register              # Register new user
POST   /api/auth/[...nextauth]         # NextAuth endpoints
GET    /api/auth/session               # Get current session
```

### Properties
```
GET    /api/properties                 # List properties (paginated)
POST   /api/properties                 # Create property
GET    /api/properties/{id}            # Get property details
PUT    /api/properties/{id}            # Update property
DELETE /api/properties/{id}            # Delete property
POST   /api/properties/{id}/images     # Upload images
```

### Leads
```
GET    /api/leads                      # List leads
POST   /api/leads                      # Create lead
GET    /api/leads/{id}                 # Get lead details
PUT    /api/leads/{id}                 # Update lead
DELETE /api/leads/{id}                 # Delete lead
GET    /api/leads/{id}/activities      # Get lead activities
POST   /api/leads/{id}/activities      # Add activity
GET    /api/leads/{id}/follow-up       # AI follow-up suggestions
```

### Property Visits
```
GET    /api/visits                     # List visits
POST   /api/visits                     # Schedule visit
GET    /api/visits/{id}                # Get visit details
PUT    /api/visits/{id}                # Update visit status
DELETE /api/visits/{id}                # Cancel visit
```

### Commissions
```
GET    /api/commissions                # List commissions
POST   /api/commissions                # Create commission
GET    /api/commissions/{id}           # Get commission
PUT    /api/commissions/{id}           # Update commission (mark paid, etc)
```

### Analytics (Admin only)
```
GET    /api/analytics/dashboard        # Dashboard statistics
GET    /api/analytics/agent-performance # Agent performance data
GET    /api/analytics/reports          # Generate reports
```

### Admin
```
GET    /api/admin/users                # List all users
POST   /api/admin/users                # Create user (admin)
PUT    /api/admin/users/{id}/role      # Change user role
DELETE /api/admin/users/{id}           # Deactivate user
```

---

## Authentication & Authorization

### Role-Based Access Control (RBAC)

| Role | Permissions |
|---|---|
| **ADMIN** | Full access. Manage all properties, leads, agents, view analytics, manage users and commissions |
| **AGENT** | Limited access. Manage own properties and assigned leads, schedule visits, view own commission |
| **CLIENT** | Read-only. View own leads and properties (future use) |

### Permission Checks

```typescript
// Helper functions in lib/utils.ts
canAccessLead(leadAgentId, userId, userRole)       // Check lead access
canAccessProperty(propertyAgentId, userId, userRole) // Check property access
canManageUser(targetRole, currentRole)              // Check user management
hasPermission(userRole, requiredRoles)              // Check role permission
```

### Middleware Protection

Routes protected by middleware (`middleware.ts`):
- `/dashboard/*` - Requires authentication
- `/admin/*` - Requires ADMIN role
- `/agent/*` - Requires AGENT or ADMIN role

---

## Feature Implementation

### 1. Property Management

**Models**: `Property`, `PropertyImage`

**Key Features**:
- Full CRUD operations
- Multiple image uploads
- Location mapping (latitude/longitude)
- Status tracking (Available, Sold, Rented, etc.)
- Agent assignment

**Implementation**:
```typescript
// Create property
POST /api/properties
Body: { title, description, type, price, address, agentId, ... }

// Filter properties
GET /api/properties?status=AVAILABLE&city=Mumbai&type=APARTMENT
```

### 2. Lead Management

**Models**: `Lead`, `Activity`

**Key Features**:
- Capture buyer/seller/renter inquiries
- Track lead source (Facebook, Website, WhatsApp, etc.)
- Activity timeline (calls, meetings, proposals)
- Status workflow (New → Contacted → Closed Won/Lost)
- Budget range tracking

**Implementation**:
```typescript
// Create lead
POST /api/leads
Body: { firstName, lastName, phone, type, source, status, budgetMin, budgetMax }

// Add activity
POST /api/leads/{id}/activities
Body: { type, title, notes }

// Get AI follow-up suggestion
GET /api/leads/{id}/follow-up
```

### 3. Visit Scheduling

**Models**: `PropertyVisit`

**Key Features**:
- Schedule property visits
- Agent assignment
- Reminder system (send email/SMS before visit)
- Visit status tracking
- Feedback & ratings

**Implementation**:
```typescript
// Schedule visit
POST /api/visits
Body: { leadId, propertyId, agentId, scheduledAt, notes }

// Update visit status
PUT /api/visits/{id}
Body: { status, feedback, rating }
```

### 4. Commission Tracking

**Models**: `Commission`

**Key Features**:
- Auto-calculate commission from property price
- Track commission percentage per agent
- Payment status (Pending, Paid, Cancelled)
- Payment method and reference tracking

**Implementation**:
```typescript
// Create commission
POST /api/commissions
Body: { agentId, propertyId, percentage }
// Auto-calculates: commissionAmount = (propertyPrice * percentage) / 100

// Mark as paid
PUT /api/commissions/{id}
Body: { status: "PAID", paidAt, paymentMethod, paymentRef }
```

### 5. AI Follow-up Automation

**Service**: OpenAI API

**Features**:
- Generate smart follow-up messages
- WhatsApp-ready formatting
- Email templates
- Time-based reminders

**Implementation**:
```typescript
// lib/ai-service.ts
async function generateFollowUpMessage(lead: Lead, property?: Property) {
  const prompt = `Generate a professional follow-up message for a real estate lead...`;
  const response = await openai.createChatCompletion({...});
  return response.choices[0].message.content;
}
```

### 6. Agent Performance Dashboard

**Features**:
- Leads generated and converted
- Total sales value
- Commission earned
- Visits conducted
- Conversion rate

---

## Deployment Guide

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Supabase account (or self-hosted PostgreSQL)
- Vercel account (for hosting)
- GitHub account (for version control)

### Step 1: Prepare Repository

```bash
# Initialize git
git init
git remote add origin https://github.com/yourusername/real-estate-crm.git

# Create .gitignore
echo "node_modules/
.env
.env.local
.env.*.local
.next/
dist/
build/" > .gitignore

# Commit initial setup
git add .
git commit -m "Initial commit: Real Estate CRM structure"
git push -u origin main
```

### Step 2: Database Setup (Supabase)

1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Note your DATABASE_URL from project settings
4. Update `.env.local`:
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[host]:5432/[db]"
   DIRECT_URL="postgresql://[user]:[password]@[host]:5432/[db]"
   ```

### Step 3: Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database (optional)
npx prisma db seed
```

### Step 4: Environment Setup

Create `.env.local` with:
```env
# Database
DATABASE_URL="your_supabase_url"
DIRECT_URL="your_supabase_direct_url"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# API URLs
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_API_URL="https://yourdomain.com/api"

# Optional Services
OPENAI_API_KEY="sk-..."
STRIPE_SECRET_KEY="sk_live_..."
SENDGRID_API_KEY="SG..."
```

### Step 5: Deploy to Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure environment variables in Vercel project settings
4. Deploy

```bash
# Or deploy via CLI
npm i -g vercel
vercel
```

### Step 6: Post-Deployment

1. Update DNS records to point to Vercel
2. Set up SSL certificate (Vercel handles this automatically)
3. Configure email service for notifications
4. Set up monitoring and error tracking (Sentry recommended)

---

## Performance & Scalability

### Database Optimization

```prisma
// Add indexes for frequently queried fields
model Property {
  @@index([agentId])
  @@index([status])
  @@index([city])
  @@fulltext([title, description, address])
}

model Lead {
  @@index([status])
  @@index([assignedAgentId])
  @@index([createdAt])
}
```

### Pagination

All list endpoints support pagination:
```bash
GET /api/properties?page=1&limit=10
```

### Caching Strategy

- Cache property listings for 5 minutes
- Cache agent performance data for 1 hour
- Use Vercel Cache-Control headers for static assets

### Database Connection Pooling

Supabase automatically handles connection pooling. For self-hosted:
```env
DATABASE_URL="postgresql://[user]:[password]@[host]:5432/[db]?schema=public"
```

### Image Optimization

- Use Next.js Image component
- Serve from CDN (Supabase/Vercel)
- Auto-resize to multiple formats
- WebP/AVIF support

### Monitoring & Logging

1. **Error Tracking**: Sentry
2. **Performance**: Vercel Analytics
3. **Logs**: Pino logger or Vercel Logs
4. **Database**: Supabase Realtime monitoring

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [NextAuth.js](https://next-auth.js.org)
- [Supabase](https://supabase.com/docs)

---

**Last Updated**: February 2024
**Version**: 1.0.0 Production Ready
