# NEXUS SaaS Platform - One-Click Deployment

## ⚡ Quick Start (Copy & Paste These Commands)

### 1️⃣ Deploy Frontend to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy frontend
cd /path/to/nexus-saas-platform
vercel --prod
```

When prompted:
- Link to existing project? `No`
- Project name? `nexus-saas-platform` (or your choice)
- Framework? `Vite`
- Output directory? `dist`

### 2️⃣ Configure Vercel Environment Variables

```bash
vercel env add VITE_API_URL
# Enter: https://your-railway-backend-domain/api/v1

vercel env add VITE_SUPABASE_URL
# Enter: https://zupngmmhtpnkyxcjhnoo.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Enter: <copy from Supabase dashboard>

# Redeploy with new variables
vercel --prod
```

### 3️⃣ Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Link to GitHub repo
# Use: Sohila01/saasys
# Root: backend/

# Set environment variables
railway variables add SUPABASE_URL=https://zupngmmhtpnkyxcjhnoo.supabase.co
railway variables add SUPABASE_KEY=<copy-from-supabase>
railway variables add SUPABASE_SERVICE_ROLE_KEY=<copy-from-supabase>
railway variables add JWT_SECRET=<generate-random-32-char-string>
railway variables add JWT_EXPIRY=7d
railway variables add FRONTEND_URL=<your-vercel-domain>
railway variables add CORS_ORIGIN=<your-vercel-domain>

# Deploy
railway up
```

### 4️⃣ Update Frontend API URL

Once Railway backend is deployed:

```bash
# Get your Railway domain from: railway.app/dashboard

# Update Vercel environment
vercel env rm VITE_API_URL  # Remove old
vercel env add VITE_API_URL
# Enter: https://<railway-domain>/api/v1

# Redeploy
vercel --prod
```

---

## 🎯 Production URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | https://your-vercel-domain.vercel.app |
| Backend API | https://your-railway-domain.railway.app |
| API Health Check | https://your-railway-domain.railway.app/api/v1/health |
| Swagger Docs | https://your-railway-domain.railway.app/api/docs |

---

## ✅ Verification Checklist

After deployment, verify everything works:

```bash
# Test frontend loads
curl https://your-vercel-domain.vercel.app
# Should return HTML page

# Test backend health
curl https://your-railway-domain.railway.app/api/v1/health
# Should return: {"status":"ok"}

# Test API documentation
curl https://your-railway-domain.railway.app/api/docs
# Should return Swagger UI

# Test login endpoint
curl -X POST https://your-railway-domain.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## 🐛 Troubleshooting Commands

```bash
# View Vercel deployment logs
vercel logs

# View Railway logs
railway logs

# Check environment variables
vercel env ls
railway variables

# Rebuild frontend
cd nexus-saas-platform
npm run build

# Rebuild backend
cd backend
npm run build
npm run start:prod
```

---

## 📱 Test the Application

1. Visit your Vercel frontend URL
2. Click "Login"
3. Use credentials:
   - Email: `test@example.com`
   - Password: `test123` (or your test account)
4. Navigate to Admin → Schema Builder
5. Try creating a new module (this tests the fixed endpoint)

---

## 🔄 Continuous Deployment

After initial setup, deployments are automatic:

- **Frontend:** Push to `master` → Auto-deploy to Vercel
- **Backend:** Push to `master` → Auto-deploy to Railway

No manual action needed for future updates!

---

## 📞 Quick Support Commands

```bash
# Get Vercel project info
vercel project inspect

# Get Railway project info
railway project current

# List all deployments (Vercel)
vercel deployments

# List all deployments (Railway)
railway deployments

# Check backend status
curl -I https://your-backend-url/api/v1/health
```

---

**Ready to deploy? Run the commands above and you'll be live in ~5 minutes! 🚀**
