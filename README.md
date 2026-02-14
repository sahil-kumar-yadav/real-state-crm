# Real Estate CRM - Production Ready Application

A complete, production-ready Customer Relationship Management (CRM) system built with Next.js 14, PostgreSQL, and Prisma ORM. Designed for real estate agencies to manage properties, agents, leads, site visits, and commissions with ease.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0+-blueviolet)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178c6)
![Prisma](https://img.shields.io/badge/Prisma-5.7+-2d3748)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🏢 Property Management
- ✅ Add, edit, and manage unlimited properties
- ✅ Multiple property types (Apartment, Villa, Commercial, Land, House, Penthouse)
- ✅ Upload and manage multiple property images
- ✅ Track property status (Available, Sold, Rented, Under Offer, Off Market)
- ✅ Assign agents to properties
- ✅ Property search and filtering by city, type, status, price

### 👥 Lead Management
- ✅ Capture buyer/seller/renter inquiries
- ✅ Track lead source (Facebook, Website, WhatsApp, Referral, Email)
- ✅ Lead status workflow (New → Contacted → Closed)
- ✅ Budget range tracking
- ✅ Activity timeline (calls, meetings, proposals)
- ✅ AI-powered follow-up suggestions

### 📅 Visit Scheduling
- ✅ Schedule property visits with lead and agent assignment
- ✅ Visit status tracking (Scheduled, Completed, No-show, Rescheduled)
- ✅ Reminder system for upcoming visits
- ✅ Feedback and ratings after visits
- ✅ Automated reminders

### 💰 Commission Tracking
- ✅ Auto-calculate commissions based on property price
- ✅ Commission percentage management per agent
- ✅ Payment status tracking (Pending, Paid, On Hold)
- ✅ Payment method and reference tracking
- ✅ Commission history and reports

### 👨‍💼 Agent Management
- ✅ Role-based access control (Admin, Agent, Client)
- ✅ Agent performance dashboard
- ✅ Track closed deals per agent
- ✅ Total commission earned tracking
- ✅ Agent specialization tags

### 📊 Analytics & Reporting
- ✅ Real-time dashboard with key metrics
- ✅ Leads conversion metrics
- ✅ Revenue tracking
- ✅ Agent performance charts
- ✅ Customizable reports

### 🔒 Security & Authentication
- ✅ NextAuth.js with JWT tokens
- ✅ Secure password hashing (bcryptjs)
- ✅ Role-based authorization
- ✅ Protected API routes
- ✅ Session management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 12+ (or Supabase account)
- Git

### Installation

1. **Clone and Setup**
   ```bash
   cd /workspaces/real-state-crm
   npm install
   ```

2. **Configure Database**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit .env.local with your database URL
   # Example: postgresql://user:password@localhost:5432/real_estate_crm
   ```

3. **Initialize Database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed database with sample data (optional)
   npx prisma db seed
   ```

4. **Generate NextAuth Secret**
   ```bash
   openssl rand -base64 32
   # Copy output to NEXTAUTH_SECRET in .env.local
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser

### 📝 Demo Credentials

For testing, use these credentials to login:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@recrm.com | password123 |
| Agent | agent@recrm.com | password123 |

---

## 📁 Project Structure

```
real-estate-crm/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Main application
│   └── components/       # Reusable components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── validations.ts    # Zod validation schemas
│   └── utils.ts          # Helper functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Sample data seeding
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

---

## 🔧 Environment Configuration

Update `.env.local` with your configuration:

```env
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://user:password@localhost:5432/real_estate_crm"
DIRECT_URL="postgresql://user:password@localhost:5432/real_estate_crm"

# ============================================
# AUTHENTICATION
# ============================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# ============================================
# API ENDPOINTS
# ============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# ============================================
# OPTIONAL: AI SERVICES
# ============================================
OPENAI_API_KEY="sk-..."  # For AI suggestions

# ============================================
# OPTIONAL: PAYMENT (Stripe)
# ============================================
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# ============================================
# OPTIONAL: COMMUNICATIONS
# ============================================
# For Email
SENDGRID_API_KEY="SG..."

# For WhatsApp/SMS (Twilio)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
```

---

## 📚 API Documentation

### Authentication
```bash
# Register
POST /api/auth/register
Body: { email, password, firstName, lastName, phone }

# Login (via NextAuth)
POST /api/auth/[...nextauth]
```

### Properties
```bash
# List properties
GET /api/properties?page=1&limit=10&search=&status=AVAILABLE&city=

# Create property
POST /api/properties
Body: { title, type, price, address, city, agentId, ... }

# Get property details
GET /api/properties/{id}

# Update property
PUT /api/properties/{id}

# Delete property
DELETE /api/properties/{id}
```

### Leads
```bash
# List leads
GET /api/leads?page=1&limit=10&status=NEW&source=FACEBOOK

# Create lead
POST /api/leads
Body: { firstName, lastName, phone, email, type, source, ... }

# Get AI follow-up suggestion
GET /api/leads/{id}/follow-up

# Add activity
POST /api/leads/{id}/activities
Body: { type, title, notes }
```

### Property Visits
```bash
# Schedule visit
POST /api/visits
Body: { leadId, propertyId, assignedAgentId, scheduledAt }

# Update visit status
PUT /api/visits/{id}
Body: { status, feedback, rating }
```

### Commissions
```bash
# List commissions
GET /api/commissions?agentId=&status=PENDING

# Create commission
POST /api/commissions
Body: { agentId, propertyId, percentage }

# Mark as paid
PUT /api/commissions/{id}
Body: { status: "PAID", paymentMethod, paymentRef }
```

See [ARCHITECTURE.md](./ARCHITECTURE.md#api-routes--endpoints) for complete API documentation.

---

## 🎨 UI/UX Features

### Modern Dashboard
- Clean, intuitive interface with intuitive navigation
- Dark mode support (coming soon)
- Fully responsive design (Mobile, Tablet, Desktop)
- Real-time data updates

### Component Library
- Reusable React components
- Beautiful badge system
- Custom form inputs
- Status indicators
- Data tables with sorting and filtering

### Performance
- Fast page loads with Next.js optimization
- Image lazy loading
- Database query optimization with indexes
- Pagination for large datasets

---

## 🔐 Security Features

- ✅ **Authentication**: Secure JWT-based session management
- ✅ **Authorization**: Role-based access control (RBAC)
- ✅ **Data Validation**: Zod schema validation on all inputs
- ✅ **SQL Injection Prevention**: Prisma ORM parameterized queries
- ✅ **Password Security**: Bcrypt hashing with salt rounds
- ✅ **CORS Protection**: Configured CORS headers
- ✅ **Rate Limiting**: Coming soon
- ✅ **Audit Logging**: Coming soon

---

## 📱 Multi-Tenant Scalability

The system is designed to scale for multiple real estate agencies:

### Organization Level
- Each organization has its own data isolation
- Separate agent limit based on subscription plan
- Custom branding support (coming soon)

### Agent Management
- Multi-agent collaboration
- Lead assignment and reassignment
- Performance tracking per agent

### Database Optimization
- Indexed queries for fast lookups
- Pagination for large datasets
- Connection pooling with Supabase

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect GitHub repository directly to Vercel dashboard.

### Deploy to Other Platforms

#### AWS
- Use AWS RDS for PostgreSQL
- Deploy Next.js to AWS Amplify or EC2

#### Railway
- One-click PostgreSQL setup
- Simple GitHub integration
- [railway.app](https://railway.app)

#### DigitalOcean
- App Platform for Next.js
- Managed PostgreSQL database
- Affordable pricing

See [ARCHITECTURE.md](./ARCHITECTURE.md#deployment-guide) for detailed deployment guide.

---

## 🔄 Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name add_new_field

# Apply migrations in production
npx prisma migrate deploy

# View migration status
npx prisma migrate status

# Reset database (development only)
npx prisma migrate reset
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

---

## 📈 Performance Optimization

### Implemented
- ✅ Image optimization with Next.js Image
- ✅ Database query optimization
- ✅ Pagination for list endpoints
- ✅ Server-side rendering where beneficial
- ✅ CSS-in-JS with Tailwind (minimal bundle size)

### Coming Soon
- ⏳ Caching layer (Redis)
- ⏳ GraphQL API
- ⏳ Service workers for offline support
- ⏳ Advanced analytics

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Verify .env.local has correct DATABASE_URL
# Check PostgreSQL is running
psql $DATABASE_URL -c "SELECT 1"
```

### Prisma Generation Issues
```bash
# Regenerate Prisma client
npx prisma generate --force

# Clear cache
rm -rf node_modules/.prisma
npm install
```

### NextAuth Not Working
```bash
# Verify NEXTAUTH_SECRET is set
# Generate new secret: openssl rand -base64 32
# Check NEXTAUTH_URL matches your domain
```

---

## 📚 Documentation

- [Architecture & Design](./ARCHITECTURE.md) - Complete system design
- [API Documentation](./ARCHITECTURE.md#api-routes--endpoints) - All endpoints
- [Database Schema](./ARCHITECTURE.md#database-schema--er-diagram) - ER diagram
- [Deployment Guide](./ARCHITECTURE.md#deployment-guide) - Production setup

---

## 🔄 Roadmap

### Phase 1 (Current) ✅
- Core CRM features
- Property, Lead, Visit management
- Commission tracking
- Basic analytics

### Phase 2 (Q2 2024)
- Advanced AI suggestions with OpenAI
- Email automation
- WhatsApp integration
- SMS reminders

### Phase 3 (Q3 2024)
- Mobile app (React Native)
- Advanced reporting
- Custom workflows
- Zapier integration

### Phase 4 (Q4 2024)
- Multi-language support
- Multiple currency support
- Advanced permissions system
- Custom fields

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 💬 Support

- 📧 Email: support@recrm.example.com
- 📱 WhatsApp: +91 XXXXX XXXXX
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/real-estate-crm/issues)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for excellent ORM
- Tailwind CSS for beautiful styling
- NextAuth.js for authentication

---

## 📊 Key Statistics

- **Total Database Models**: 13
- **API Endpoints**: 30+
- **Authentication Methods**: 1 (Extensible)
- **Role-Based Permissions**: 3 levels
- **Timezone Support**: Global
- **Multi-language Ready**: Yes (Coming soon)

---

**Built with ❤️ for Real Estate Agencies**

**Last Updated**: February 2024 | **Version**: 1.0.0 - Production Ready
