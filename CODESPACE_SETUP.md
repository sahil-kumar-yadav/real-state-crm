# 🌐 GitHub Codespace Setup Guide

This guide is specifically for setting up the Real Estate CRM in GitHub Codespace.

---

## ✅ Codespace Quick Start (Inside Codespace)

### Step 1: Open Terminal in Codespace

VS Code terminal should already be open. If not:
- Press `Ctrl + ~` (or `Cmd + ~` on Mac)
- Click "Terminal" in top menu

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages. Takes ~2-3 minutes.

### Step 3: Setup Database URL

#### Option A: Using Supabase (Recommended)

1. Open new browser tab and visit [supabase.com](https://supabase.com)
2. Sign up/login with GitHub
3. Create new project
4. Copy CONNECTION STRING from Settings → Database
5. Back in Codespace, create `.env.local`:

```bash
cat > .env.local << 'EOF'
DATABASE_URL="paste-your-supabase-url-here"
DIRECT_URL="paste-your-direct-url-here"
NEXTAUTH_URL="https://[your-codespace-url]"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXT_PUBLIC_APP_URL="https://[your-codespace-url]"
NEXT_PUBLIC_API_URL="https://[your-codespace-url]/api"
EOF
```

#### Option B: Using Local PostgreSQL (Advanced)

Inside Codespace, PostgreSQL comes pre-installed. To use it:

```bash
# Start PostgreSQL service
sudo service postgresql start

# Create database
sudo -u postgres createdb real_estate_crm

# Create user
sudo -u postgres psql << 'EOF'
CREATE USER recrm WITH PASSWORD 'password123';
ALTER USER recrm CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE real_estate_crm TO recrm;
EOF

# Update .env.local
DATABASE_URL="postgresql://recrm:password123@localhost:5432/real_estate_crm"
DIRECT_URL="postgresql://recrm:password123@localhost:5432/real_estate_crm"
```

### Step 4: Generate NextAuth Secret

```bash
# Generate secret
openssl rand -base64 32

# You'll see output like: "abc123def456..."
# Copy this value and add to .env.local as NEXTAUTH_SECRET
```

Or let VS Code handle it:

```bash
# Open .env.local
code .env.local

# Find NEXTAUTH_SECRET line and replace placeholder
# Then save (Ctrl+S or Cmd+S)
```

### Step 5: Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with sample data
npx prisma db seed
```

### Step 6: Start Development Server

```bash
npm run dev
```

You'll see:
```
ready - started server on 0.0.0.0:3000, url: https://[your-codespace-url]
```

### Step 7: Open Application

VS Code will show a notification with a link. Click it, or:
1. Open "Ports" tab in Terminal
2. Click the link next to port 3000

---

## 🔓 Login to Application

Use demo credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@recrm.com | password123 |
| Agent | agent@recrm.com | password123 |

---

## 🗂️ File Structure (In VS Code Explorer)

```
real-estate-crm/
├── 📁 app/
│   ├── 📁 api/              # ← API endpoints here
│   ├── 📁 auth/             # ← Login/Register pages
│   ├── 📁 dashboard/        # ← Main app pages
│   ├── 📁 components/       # ← Reusable UI components
│   ├── globals.css          # ← Global styles
│   └── page.tsx             # ← Home page
├── 📁 lib/
│   ├── auth.ts              # ← Authentication setup
│   ├── prisma.ts            # ← Database client
│   └── validations.ts       # ← Input validation
├── 📁 prisma/
│   ├── schema.prisma        # ← Database models
│   └── seed.ts              # ← Sample data
├── 📄 .env.example          # ← Environment template
├── 📄 .env.local            # ← Your settings (create this)
├── 📄 package.json          # ← Dependencies
└── 📄 DEPLOYMENT.md         # ← Setup guide
```

---

## 🛠️ Common Commands

| Command | What It Does |
|---------|----------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma db push` | Push schema to database |
| `npx prisma db seed` | Add sample data |
| `npx prisma studio` | Open database GUI (port 5555) |
| `npm run lint` | Check code quality |

---

## 📝 Editing Files in Codespace

### Edit Configuration Files

```bash
# Edit environment variables
code .env.local

# Edit database schema
code prisma/schema.prisma

# Edit API route
code app/api/properties/route.ts
```

### VS Code Tips

- **Find & Replace**: `Ctrl+H` (or `Cmd+H`)
- **Format Code**: `Shift+Alt+F` (or `Shift+Option+F`)
- **Go to File**: `Ctrl+P` (or `Cmd+P`)
- **Open Terminal**: `Ctrl+~` (or `Cmd+~`)
- **Split Editor**: `Ctrl+\` (or `Cmd+\`)

---

## 🌍 Public URL Access

Codespace URLs are automatically provided. Share your app:

1. In Terminal, find line like: `https://[name]-[random].preview.app.github.dev`
2. Copy and share this link
3. Anyone with link can access your dev app

### Make It Permanent

In Codespace settings:
- Visibility: Public (so anyone with link can access)
- Port forwarding: Public

---

## 🔧 Troubleshooting in Codespace

### Port Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill process
kill -9 [PID]

# Restart server
npm run dev
```

### Database Connection Error

```bash
# Test connection
psql $DATABASE_URL -c "SELECT NOW();"

# If using local PostgreSQL
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart
```

### Out of Space

Codespace has limited storage. Clean up:

```bash
# Remove node_modules
rm -rf node_modules

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

---

## 📦 Environment Variables Template

Copy this into `.env.local`:

```env
# Database (Supabase)
DATABASE_URL="postgresql://[user]:[password]@db.[project].supabase.co:5432/postgres"
DIRECT_URL="postgresql://[user]:[password]@db.[project].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="https://[your-codespace-url]"
NEXTAUTH_SECRET="your-generated-secret-here"

# API URLs
NEXT_PUBLIC_APP_URL="https://[your-codespace-url]"
NEXT_PUBLIC_API_URL="https://[your-codespace-url]/api"

# Optional Services (add later if needed)
OPENAI_API_KEY=""
STRIPE_SECRET_KEY=""
SENDGRID_API_KEY=""
```

---

## 🔄 Updating Your Code

### Make Changes

1. Edit files in VS Code
2. Save (`Ctrl+S`)
3. Refresh browser - Next.js hot-reloads automatically

### Common Changes

#### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: "#0066cc",     // Change to your color
  secondary: "#6366f1",
}
```

#### Change App Name
Edit `app/layout.tsx`:
```tsx
export const metadata: Metadata = {
  title: "My Real Estate CRM",  // Change this
};
```

#### Add New Menu Item
Edit `app/components/layout/DashboardLayout.tsx`:
```tsx
const menuItems = [
  // ... existing items
  { label: "New Page", href: "/dashboard/new", icon: Star },
];
```

---

## 🚀 When Ready to Deploy

### Option 1: Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Click Deploy

### Option 2: Deploy to Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project
4. Connect GitHub repo
5. Add PostgreSQL database
6. Deploy

### Before Deploying

```bash
# Test build
npm run build

# Check for errors
npm run lint

# Run tests (if any)
npm test
```

---

## 💾 Save Your Changes

### Commit to GitHub

```bash
# Check what changed
git status

# Add all changes
git add .

# Save with message
git commit -m "Add new feature or describe your changes"

# Push to GitHub
git push origin main
```

### Create Backup

Everything in Codespace is saved to GitHub automatically when you commit.

To backup database:
```bash
# Download database dump
pg_dump $DATABASE_URL > backup.sql

# Save to your computer (download from Codespace)
```

---

## 📊 Monitor Your Application

### Check Logs

```bash
# View terminal output
# Scroll up in Terminal tab

# Check specific route
tail -f .next/logs/api.log

# View database queries (if enabled)
grep "prisma" .next/logs/*
```

### Test API Endpoints

```bash
# In Terminal, test your API
curl http://localhost:3000/api/properties

# With authentication
curl -H "Authorization: Bearer [TOKEN]" \
     http://localhost:3000/api/properties
```

---

## 🆘 Getting Help

If something isn't working:

1. **Check the docs**:
   - [README.md](./README.md) - Overview
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Setup details
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical details

2. **Check terminal for errors**:
   - Scroll up in Terminal tab
   - Look for red error messages
   - Search for error code online

3. **Restart everything**:
   ```bash
   npm run dev    # Restart server
   ```

4. **Reset database**:
   ```bash
   npx prisma migrate reset  # WARNING: Deletes data!
   npx prisma db seed        # Add sample data again
   ```

---

## ✨ Tips & Tricks

### Auto-save Enabled
- Changes are auto-saved
- No need to manually save files
- Press Ctrl+S to be sure

### VS Code Extensions
- Install Prettier (auto-format code)
- Install ESLint (find bugs)
- Install Thunder Client (test APIs)

### Quick Navigation
- `Ctrl+K Ctrl+S` - Keyboard shortcuts
- `Ctrl+Shift+P` - Command palette
- `Ctrl+B` - Toggle file explorer

### Speed Up Development

```bash
# Use fast refresh
npm run dev

# In a separate terminal, open database GUI
npx prisma studio

# Test APIs with Thunder Client extension
```

---

## 📱 Mobile Testing

Access your Codespace app from phone:

1. Get Codespace URL from Ports tab
2. Share URL with your phone (QR code in VS Code)
3. Open on mobile browser
4. Test responsive design

---

## 🎓 Learning Resources Inside Codespace

- Hover over code → See documentation
- `Ctrl+Space` → Auto-complete with explanations
- `Ctrl+H` → Search and replace with preview
- `F12` → Open browser DevTools to debug

---

## 🔐 Security in Development

⚠️ **Important**: 

- Never commit `.env.local` to GitHub (add to `.gitignore`)
- Demo passwords are for development only
- Generate real NEXTAUTH_SECRET for production
- Change default admin credentials after setup

---

## 🎉 You're Ready!

Your GitHub Codespace is fully configured. Start with:

```bash
npm run dev
```

Then navigate to your Codespace URL in a browser.

**Happy Coding! 🚀**

---

**For More Help**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions
