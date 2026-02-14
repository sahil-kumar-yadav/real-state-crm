# 📊 Real Estate CRM - System Architecture Diagram

## High-Level System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                    (Browser / Next.js)                           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Login      │  │  Dashboard   │  │   Settings   │           │
│  │   Register   │  │   Properties │  │   Admin      │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│         ↓                ↓                   ↓                    │
└─────────────────────────────────────────────────────────────────┘
                         ↓
                    HTTP/JSON
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER                                   │
│                  (Next.js Routes)                               │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  NextAuth.js              ← Authentication               │  │
│  │  /api/auth/*                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routing & Middleware     ← Route Protection             │  │
│  │  middleware.ts                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  REST Endpoints:          ← Business Logic               │  │
│  │  /api/properties          • Validation (Zod)            │  │
│  │  /api/leads               • Authorization               │  │
│  │  /api/visits              • Commission calculation      │  │
│  │  /api/commissions                                       │  │
│  │  /api/analytics                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
└─────────────────────────────────────────────────────────────────┘
                         ↓
                  Prisma ORM
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                              │
│                    (Prisma ORM)                                 │
│                                                                   │
│  • Parameterized queries   ← SQL Injection Prevention          │
│  • Type-safe database ops                                      │
│  • Connection pooling ready                                    │
└─────────────────────────────────────────────────────────────────┘
                         ↓
            PostgreSQL Connection String
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                                │
│                  (PostgreSQL)                                   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  13 Data Models                                          │  │
│  │  • User (Authentication)                                 │  │
│  │  • Property (Real estate listings)                       │  │
│  │  • Lead (Buyer/Seller inquiries)                         │  │
│  │  • PropertyVisit (Appointment scheduling)                │  │
│  │  • Commission (Payment tracking)                         │  │
│  │  And 8 more supporting models                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Relationship Diagram

```
USER MANAGEMENT
├─ User (Authentication)
│  ├─ Login/Register
│  ├─ Session Management
│  └─ Role Assignment (ADMIN/AGENT/CLIENT)
│
└─ AgentDetails
   ├─ Commission Rate
   ├─ Performance Metrics
   └─ Specializations

PROPERTY MANAGEMENT
├─ Property
│  ├─ Agent Assignment
│  ├─ Location Info
│  ├─ Pricing
│  └─ Status Tracking
│
└─ PropertyImage
   ├─ Image URLs
   ├─ Display Order
   └─ Primary Flag

LEAD MANAGEMENT  
├─ Lead
│  ├─ Lead Source (Website, Facebook, WhatsApp, etc.)
│  ├─ Lead Status (New → Contacted → Closed)
│  ├─ Budget Tracking
│  └─ Property Preference
│
├─ Activity
│  ├─ Call Log
│  ├─ Email Sent
│  ├─ Meeting Notes
│  └─ Timeline
│
└─ PropertyVisit
   ├─ Scheduled Date/Time
   ├─ Agent Assignment
   ├─ Status (Scheduled/Completed)
   └─ Feedback & Rating

COMMISSION MANAGEMENT
└─ Commission
   ├─ Agent Assignment
   ├─ Property Link
   ├─ Calculation: Price × Percentage
   ├─ Payment Status
   └─ Payment Details

REPORTING
├─ DailyMetrics
│  ├─ New Leads Count
│  ├─ Closed Deals
│  └─ Revenue Generated
│
└─ AgentPerformance
   ├─ Leads Generated
   ├─ Conversion Rate
   ├─ Total Sales Value
   └─ Commissions Earned
```

---

## API Request Flow

```
1. USER REQUEST TO NEXT.JS APP
   ┌─────────────────────────┐
   │ GET /dashboard/leads    │
   │ (User Browser)          │
   └────────────┬────────────┘
                │
                ↓
   ┌─────────────────────────────────────┐
   │ Check Authentication                │
   │ middleware.ts                       │
   │ ✓ Is user logged in?                │
   │ ✓ Is route protected?               │
   └────────────┬────────────────────────┘
                │
                ↓
   ┌──────────────────────────────────────┐
   │ Route to Component                   │
   │ app/dashboard/leads/page.tsx         │
   └────────────┬─────────────────────────┘
                │
                ↓
   ┌───────────────────────────────────────┐
   │ Component uses useEffect() to fetch   │
   │ axios.get('/api/leads?page=1')        │
   └────────────┬──────────────────────────┘
                │
                ↓

2. API ROUTE PROCESSES REQUEST
   ┌──────────────────────────────────────┐
   │ GET /api/leads/route.ts              │
   │ req → NextRequest                    │
   └────────────┬─────────────────────────┘
                │
                ↓
   ┌──────────────────────────────────────┐
   │ Authenticate with NextAuth           │
   │ getServerSession(authOptions)        │
   │ ✓ Verify JWT Token                   │
   │ ✓ Decode User Info                   │
   └────────────┬─────────────────────────┘
                │
                ↓
   ┌──────────────────────────────────────────┐
   │ Check Authorization                      │
   │ if (user.role !== "ADMIN" &&            │
   │     user.id !== lead.agentId) 403        │
   └────────────┬─────────────────────────────┘
                │
                ↓
   ┌──────────────────────────────────────────┐
   │ Validate Query Parameters                │
   │ const page = parseInt(params.page)       │
   │ const limit = parseInt(params.limit)     │
   │ Zod validation checks                    │
   └────────────┬─────────────────────────────┘
                │
                ↓
   ┌──────────────────────────────────────────┐
   │ Query Database via Prisma                │
   │ prisma.lead.findMany({                   │
   │   where: { assignedAgentId: user.id },   │
   │   skip, take, orderBy                    │
   │ })                                       │
   └────────────┬─────────────────────────────┘
                │
                ↓
   ┌──────────────────────────────────────────┐
   │ PostgreSQL Executes Query                │
   │ SELECT * FROM Lead WHERE ...             │
   │ (Indexed for performance)                │
   └────────────┬─────────────────────────────┘
                │
                ↓
   ┌──────────────────────────────────────────┐
   │ Format Response                          │
   │ paginatedResponse(leads, total, page)    │
   │ {                                        │
   │   success: true,                         │
   │   data: [ ... ],                         │
   │   pagination: { ... }                    │
   │ }                                        │
   └────────────┬─────────────────────────────┘
                │
                ↓
   ┌──────────────────────────────────────────┐
   │ Send JSON Response                       │
   │ NextResponse.json(response)              │
   │ HTTP 200 OK                              │
   └─────────────────────────────────────────┘
                │
                ↓

3. RESPONSE RETURNED TO CLIENT
   ┌──────────────────────────────────────┐
   │ Browser receives JSON                │
   │ axios response handler triggers      │
   │ Component state updates with data    │
   │ UI re-renders with leads list        │
   └─────────────────────────────────────┘
```

---

## Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    LOGIN FLOW                               │
├─────────────────────────────────────────────────────────────┤

1. User submits login form
   ├─ Email
   └─ Password

2. signIn() from NextAuth.js
   ├─ Send to /api/auth/[...nextauth]
   └─ Route: POST /api/auth/callback/credentials

3. CredentialsProvider validates
   ├─ Find user in database by email
   ├─ Compare password hash (bcrypt)
   └─ Return user object

4. NextAuth creates JWT
   ├─ Encode user info
   ├─ Sign with NEXTAUTH_SECRET
   └─ Set in session

5. Session created
   ├─ HTTP-only cookie stored
   ├─ JWT token secured
   └─ Redirect to /dashboard

└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              AUTHORIZATION FLOW                             │
├─────────────────────────────────────────────────────────────┤

For Protected Routes:
  1. User requests /admin/dashboard
  2. middleware.ts intercepts
  3. Check: Is user authenticated?
     ├─ No → Redirect to /auth/login
     └─ Yes → Continue
  4. Check: Does user have required role?
     ├─ Role needed: ADMIN
     ├─ User role: ADMIN
     └─ ✓ Access granted
  5. Route rendered

For Protected API:
  1. Client calls axios.get('/api/admin/users')
  2. API route handler receives request
  3. getServerSession() → JWT verified
  4. Check: Is user authenticated?
     ├─ No → Return 401 Unauthorized
     └─ Yes → Continue
  5. Check: Does user have permission?
     ├─ Check: user.role === "ADMIN"
     ├─ No → Return 403 Forbidden
     └─ Yes → Continue
  6. Execute database operation
  7. Return data or error

└─────────────────────────────────────────────────────────────┘

ROLE HIERARCHY:
  ADMIN     → Full system access
  ├─ View/Edit all properties
  ├─ Manage all leads
  ├─ View all analytics
  └─ Manage agents

  AGENT     → Limited access
  ├─ View/Edit own properties
  ├─ View own assigned leads
  ├─ Schedule own visits
  └─ View own commissions

  CLIENT    → Read-only (Future)
  ├─ View own properties
  ├─ View own leads
  └─ No edit access
```

---

## Database Query Optimization

```
INDEXED FIELDS (for fast queries):
├─ User
│  ├─ email (UNIQUE)
│  └─ role (For role-based filtering)
│
├─ Property
│  ├─ agentId (For agent properties)
│  ├─ status (For available/sold/rented)
│  ├─ city (For location filtering)
│  └─ title, description, address (FULLTEXT)
│
├─ Lead
│  ├─ status (For workflow stages)
│  ├─ assignedAgentId (For agent leads)
│  ├─ createdAt (For sorting new leads)
│  └─ email, phone, firstName, lastName (For search)
│
├─ PropertyVisit
│  ├─ status (For status filtering)
│  ├─ assignedAgentId (For agent visits)
│  ├─ scheduledAt (For upcoming visits)
│  └─ leadId, propertyId (For relations)
│
└─ Commission
   ├─ agentId (For agent commissions)
   ├─ status (For payment tracking)
   └─ createdAt (For date filtering)

PAGINATION IMPLEMENTED:
├─ All list endpoints
├─ Default: 10 items per page
├─ Range: 1-100 items
└─ Prevents loading large datasets
```

---

## Deployment Architecture

```
DEVELOPMENT
    │
    └─→ GitHub Repository
         │
         ├─→ Vercel (Frontend)
         │   ├─ Next.js builds automatically
         │   ├─ Deploys on every push
         │   └─ Automatic SSL/HTTPS
         │
         └─→ Supabase (Backend + Database)
             ├─ PostgreSQL managed
             ├─ Connection pooling
             ├─ Automatic backups
             └─ Direct API access

PRODUCTION FLOW:
    User Browser
         │
         ↓
    Vercel CDN (Fast global distribution)
         │
         ├─ Serves React components
         ├─ Caches static assets
         └─ Redirects API to backend
         │
         ↓
    Vercel Serverless Functions
         │
         ├─ Runs Next.js API routes
         ├─ Executes on demand
         └─ Auto-scales
         │
         ↓
    Supabase PostgreSQL
         │
         ├─ Stores data
         ├─ Handles queries
         ├─ Manages connections
         └─ Automatic backups
```

---

## Error Handling Flow

```
REQUEST FAILS:

1. Input Validation Error
   ├─ Zod schema validation fails
   ├─ Return 400 Bad Request
   └─ Include error message

2. Authentication Error
   ├─ No JWT token
   ├─ Token expired
   ├─ Return 401 Unauthorized
   └─ Redirect to login

3. Authorization Error
   ├─ User lacks required role
   ├─ Insufficient permissions
   ├─ Return 403 Forbidden
   └─ Show "Access Denied"

4. Not Found Error
   ├─ Resource doesn't exist
   ├─ Property/Lead/Visit not found
   ├─ Return 404 Not Found
   └─ Show "Not Found"

5. Server Error
   ├─ Database connection fails
   ├─ External API error
   ├─ Return 500 Server Error
   ├─ Log error for debugging
   └─ Show "Something went wrong"

ERROR RESPONSE FORMAT:
{
  "success": false,
  "error": "Database connection failed",
  "statusCode": 500
}
```

---

**Last Updated**: February 2024  
**Architecture Version**: 1.0
