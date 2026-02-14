# 📋 Quick Reference Card

Print this out or bookmark for quick access!

---

## 🚀 Quick Start Commands

```bash
npm install                    # Install dependencies
npm run dev                   # Start development server
npx prisma generate          # Generate Prisma client
npx prisma db push           # Push schema to database
npx prisma db seed           # Add sample data
npx prisma studio            # Open database GUI
npm run build                # Production build
npm start                    # Start production server
```

---

## 🌐 API Base URL

**Development**: `http://localhost:3000/api`
**Production**: `https://yourdomain.com/api`

---

## 📡 API Endpoints Quick Reference

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/[...nextauth]` | NextAuth endpoints |

### Properties
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/properties` | List properties |
| POST | `/properties` | Create property |
| GET | `/properties/{id}` | Get property details |
| PUT | `/properties/{id}` | Update property |
| DELETE | `/properties/{id}` | Delete property |

### Leads
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/leads` | List leads |
| POST | `/leads` | Create lead |
| GET | `/leads/{id}` | Get lead details |
| PUT | `/leads/{id}` | Update lead |
| POST | `/leads/{id}/activities` | Add activity |
| GET | `/leads/{id}/follow-up` | Get AI suggestions |

### Visits
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/visits` | List visits |
| POST | `/visits` | Schedule visit |
| GET | `/visits/{id}` | Get visit details |
| PUT | `/visits/{id}` | Update visit status |
| DELETE | `/visits/{id}` | Cancel visit |

### Commissions
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/commissions` | List commissions |
| POST | `/commissions` | Create commission |
| GET | `/commissions/{id}` | Get commission |
| PUT | `/commissions/{id}` | Update commission |

### Analytics (Admin)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/analytics/dashboard` | Dashboard stats |
| GET | `/analytics/agent-performance` | Agent metrics |

---

## 🗂️ Database Models

| Model | Fields | Purpose |
|-------|--------|---------|
| **User** | id, email, password, firstName, lastName, role | User accounts |
| **AgentDetails** | userId, employeeId, commissionRate, status | Agent info |
| **Property** | title, type, price, status, address, city, agentId | Properties |
| **PropertyImage** | propertyId, url, isPrimary | Property photos |
| **Lead** | firstName, lastName, email, phone, type, source, status | Leads |
| **Activity** | leadId, type, title, notes, createdAt | Lead timeline |
| **PropertyVisit** | leadId, propertyId, agentId, status, scheduledAt | Visits |
| **Commission** | agentId, propertyId, percentage, commissionAmount, status | Commissions |

---

## 🔐 User Roles & Permissions

### ADMIN
- ✅ Full system access
- ✅ Manage all properties and leads
- ✅ Manage agents and users
- ✅ View analytics
- ✅ Create commissions

### AGENT
- ✅ Manage own properties
- ✅ Manage assigned leads
- ✅ Schedule visits
- ✅ View own commissions
- ❌ Cannot manage other agents
- ❌ Cannot access analytics

### CLIENT (Future)
- ✅ View own leads
- ✅ View assigned properties
- ❌ Cannot create/edit

---

## 🔑 Environment Variables Checklist

```env
□ DATABASE_URL              # PostgreSQL connection
□ DIRECT_URL                # Direct PostgreSQL URL
□ NEXTAUTH_URL              # Your app URL
□ NEXTAUTH_SECRET           # Generated secret (32+ chars)
□ NEXT_PUBLIC_APP_URL       # Public app URL
□ NEXT_PUBLIC_API_URL       # Public API URL
□ OPENAI_API_KEY            # (Optional) For AI features
□ STRIPE_SECRET_KEY         # (Optional) For payments
□ SENDGRID_API_KEY          # (Optional) For emails
```

---

## 📁 Key File Locations

```
Real Estate CRM
├── App Code
│   ├── app/api/             ← API endpoints (modify to add features)
│   ├── app/dashboard/       ← Dashboard pages (UI)
│   ├── app/components/      ← Reusable components (UI elements)
│   └── app/globals.css      ← Global styles
├── Configuration
│   ├── lib/auth.ts          ← Authentication settings
│   ├── lib/validations.ts   ← Input validation rules
│   ├── middleware.ts        ← Route protection
│   └── next.config.js       ← Next.js settings
├── Database
│   ├── prisma/schema.prisma ← Database models
│   ├── prisma/seed.ts       ← Sample data
│   └── lib/prisma.ts        ← Database client
├── Configuration Files
│   ├── .env.local           ← Your environment variables (CREATE THIS)
│   ├── package.json         ← Dependencies
│   ├── tsconfig.json        ← TypeScript config
│   ├── tailwind.config.js   ← Tailwind styles
│   └── .eslintrc.json       ← Code quality
└── Documentation
    ├── README.md            ← Project overview
    ├── ARCHITECTURE.md      ← System design
    ├── DEPLOYMENT.md        ← Setup guide
    └── SETUP_SUMMARY.md     ← What's included
```

---

## 🛠️ Edit/Customize Quickly

### Change App Colors
**File**: `tailwind.config.js`
```js
// Update primary color
primary: "#your-color-code",
```

### Add New Dashboard Page
1. Create file: `app/dashboard/newpage/page.tsx`
2. Copy template from existing page
3. Modify as needed
4. Update sidebar in `app/components/layout/DashboardLayout.tsx`

### Create New API Endpoint
1. Create file: `app/api/myendpoint/route.ts`
2. Export GET/POST/PUT/DELETE function
3. Use Prisma to query database
4. Return JSON response

### Add New Database Field
1. Edit `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name add_field_name`
3. Update TypeScript types if needed

---

## 🐛 Debug Checklist

| Issue | Solution |
|-------|----------|
| API not working | Check `.env.local` has correct DATABASE_URL |
| Database connection error | Test connection: `psql $DATABASE_URL` |
| NextAuth not working | Verify NEXTAUTH_SECRET is set (32+ chars) |
| Logout not working | Check NEXTAUTH_URL matches your domain |
| Port already in use | Kill process: `kill -9 $(lsof -t -i :3000)` |
| npm won't install | Clear cache: `npm cache clean --force && npm install` |
| Database out of sync | Reset: `npx prisma migrate reset` |

---

## 📊 Important Numbers

| Metric | Value |
|--------|-------|
| Database Models | 13 |
| API Endpoints | 30+ |
| User Roles | 3 |
| Property Types | 6 |
| Lead Sources | 7 |
| Commission Status Types | 4 |
| Pages | 20+ |
| Components | 50+ |

---

## 🌍 URLs to Know

| Service | URL |
|---------|-----|
| Application | `http://localhost:3000` |
| API | `http://localhost:3000/api` |
| Database GUI | `http://localhost:5555` (after `npx prisma studio`) |
| Vercel Deploy | [vercel.com](https://vercel.com) |
| Database (Supabase) | [supabase.com](https://supabase.com) |
| Next.js Docs | [nextjs.org](https://nextjs.org/docs) |
| Prisma Docs | [prisma.io](https://www.prisma.io/docs) |

---

## 🎯 Deployment Steps Summary

1. ✅ Create PostgreSQL database (Supabase recommended)
2. ✅ Get connection string
3. ✅ Update `.env.local` with database URL
4. ✅ Run `npx prisma db push`
5. ✅ Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
6. ✅ Update NEXTAUTH_URL to your domain
7. ✅ Push code to GitHub
8. ✅ Deploy to Vercel/Railway
9. ✅ Add environment variables in hosting platform
10. ✅ Test application

---

## 💡 Pro Tips

1. **Use `npx prisma studio`** to view/edit database visually
2. **Check terminal logs** for detailed error messages
3. **Test API endpoints** with curl or Thunder Client extension
4. **Use VS Code IntelliSense** - press `Ctrl+Space` for suggestions
5. **Enable auto-format** in VS Code for consistent code style
6. **Git commit frequently** to save progress
7. **Use environment variables** for sensitive data (never hardcode)

---

## 📞 Support Resources

- **Issues**: Check GitHub Issues or Discussions
- **Docs**: Read README.md, ARCHITECTURE.md, DEPLOYMENT.md
- **Search**: Google "Next.js [your question]"
- **Stack Overflow**: Tag with `next.js`, `prisma`, `nextauth`
- **Community**: Next.js Discord, Prisma Slack

---

**Last Updated**: February 2024  
**Print/Save This**: Yes! 📋
