# Deploy to Vercel: nexus-saas-platform.vercel.app

## ⚡ Quick Deploy (3 Steps)

### Step 1: Go to Vercel Dashboard
```
https://vercel.com/new
```
- Sign in or create account
- Select "Import Project"

### Step 2: Import from GitHub
```
1. Click "Import Git Repository"
2. Paste repository URL:
   https://github.com/YOUR_USERNAME/nexus-saas-platform
3. Click "Continue"
```

### Step 3: Configure & Deploy
```
Framework Preset:     Vite
Build Command:        npm run build
Output Directory:     dist
Root Directory:       ./ (leave default)

Environment Variables:
  VITE_API_URL=https://nexus-api.railway.app/api/v1
  VITE_SUPABASE_URL=https://zupngmmhtpnkyxcjhnoo.supabase.co
  VITE_SUPABASE_ANON_KEY=sb_publishable_qXJrs6URUkOiTxUmzSL7Cw_0nMtWm9b
```

### Step 4: Click "Deploy"
Wait 2-3 minutes for deployment to complete.

---

## 📋 Detailed Steps

### 1. Prepare GitHub Repository

If not already done, push to GitHub:

```bash
cd nexus-saas-platform

# Check current git remote
git remote -v

# If no remote, add it
git remote add origin https://github.com/YOUR_USERNAME/nexus-saas-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Create Repository on GitHub:**
1. Go to github.com/new
2. Repository name: `nexus-saas-platform`
3. Choose Public or Private
4. Click "Create Repository"
5. Follow instructions to push existing code

### 2. Deploy Frontend to Vercel

**Option A: Connect via GitHub (Recommended)**

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select "Import Git Repository"
4. Paste: `https://github.com/YOUR_USERNAME/nexus-saas-platform`
5. Click "Continue"

**Option B: Deploy from CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd nexus-saas-platform
vercel --prod

# Or with specific project name
vercel --prod --name nexus-saas-platform
```

### 3. Configure Environment Variables in Vercel

In Vercel Dashboard:

1. Select your project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```
Name: VITE_API_URL
Value: https://nexus-api.railway.app/api/v1

Name: VITE_SUPABASE_URL
Value: https://zupngmmhtpnkyxcjhnoo.supabase.co

Name: VITE_SUPABASE_ANON_KEY
Value: sb_publishable_qXJrs6URUkOiTxUmzSL7Cw_0nMtWm9b
```

4. Click "Save"
5. Trigger redeploy

### 4. Assign Custom Domain (Optional)

To use `nexus-saas-platform.vercel.app`:

1. In Vercel Dashboard, go to **Domains**
2. The domain might already be assigned
3. Or click "Add Domain" and enter: `nexus-saas-platform.vercel.app`
4. Vercel will auto-assign it

---

## 🔧 Build & Deploy Configuration

### vercel.json (Already Configured)
```json
{
  "version": 2,
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Build Process
1. Install dependencies: `npm install`
2. Build React app: `npm run build`
3. Output to `dist/` folder
4. Vercel uploads to CDN
5. Live at your domain

**Typical build time:** 1-2 minutes
**Deployment time:** <30 seconds

---

## 📊 Deployment Status Checks

### Check Frontend is Running
```bash
# Should return HTML
curl https://nexus-saas-platform.vercel.app/

# Should return JSON
curl https://nexus-api.railway.app/api/v1/health
```

### View Vercel Logs
1. Go to Vercel Dashboard
2. Select project
3. Go to **Deployments**
4. Click latest deployment
5. View **Build Logs** and **Function Logs**

### Common Build Issues

| Error | Solution |
|-------|----------|
| `ERR_MODULE_NOT_FOUND` | Check package.json dependencies |
| `ENOSPC` (disk full) | Usually temporary, retry |
| `TIMEOUT` | Try rebuilding |
| `ENV not defined` | Check environment variables |

---

## 🚀 Deploy Backend Separately (if needed)

If you need to deploy backend independently:

### Deploy Backend to Railway

1. Go to https://railway.app
2. New Project → Create
3. Add variables:
   ```
   SUPABASE_URL=https://zupngmmhtpnkyxcjhnoo.supabase.co
   SUPABASE_SERVICE_KEY=[your-service-key]
   JWT_SECRET=[your-secret-32-chars]
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=https://nexus-saas-platform.vercel.app
   ```
4. Deploy `backend/` folder
5. Get public URL: `https://nexus-api-xyz.railway.app`
6. Update `VITE_API_URL` in Vercel

---

## 🔄 Automatic Deployments

**Vercel automatically deploys when:**
- You push to `main` branch
- Pull request merged
- Manual redeploy triggered

**To disable auto-deploy:**
1. Vercel Dashboard → Settings
2. Git → Uncheck "Deploy on push"

---

## 📈 Performance Optimization

### Vercel Automatic Optimizations
- ✅ Image optimization
- ✅ Code splitting
- ✅ Tree shaking
- ✅ CSS minification
- ✅ JS minification
- ✅ Gzip compression
- ✅ CDN caching

### Frontend Load Time
- First visit: ~2-3 seconds
- Cached visit: <1 second

### Monitor Performance
1. Vercel Dashboard → Analytics
2. View Core Web Vitals
3. LCP, FID, CLS metrics

---

## 🔐 Environment Variables Security

**Never commit:**
- `.env` (local development)
- `.env.local`
- API keys
- Secrets

**Safe to commit:**
- `vercel.json`
- `.env.vercel` (example template only)
- `package.json`
- Source code

---

## 🧪 Testing After Deployment

### 1. Frontend Test
```bash
# Visit the domain
https://nexus-saas-platform.vercel.app

# Should show:
- Login page loaded
- No console errors
- Styling intact
```

### 2. Login Test
```
Email:    test@demo.com
Password: TestPass123!

Expected:
- Login succeeds
- Redirects to dashboard
- User data loads
```

### 3. API Test
```bash
# Test health endpoint
curl https://nexus-api.railway.app/api/v1/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2026-01-05T..."
}
```

### 4. Multi-Tenant Test
- Login as Tenant 1
- Verify you only see Tenant 1 data
- Logout
- Login as Tenant 2
- Verify you only see Tenant 2 data

---

## 🔄 Redeployment & Rollback

### Manual Redeploy
1. Vercel Dashboard → Deployments
2. Click "..." next to deployment
3. Select "Redeploy"

### Rollback to Previous Version
1. Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." → "Redeploy"

---

## 📞 Troubleshooting

### Deployment Failed
1. Check **Build Logs** in Vercel
2. Look for error messages
3. Common issues:
   - Missing dependencies
   - Port already in use (shouldn't happen on Vercel)
   - Environment variables not set

### Frontend Shows Errors
1. Open browser DevTools (F12)
2. Check **Console** tab
3. Look for error messages
4. Common issues:
   - CORS errors → check VITE_API_URL
   - 404 errors → check API endpoint

### API Not Responding
1. Check if backend is running
2. Verify VITE_API_URL is correct
3. Check backend logs
4. Verify CORS is enabled

---

## 📋 Final Checklist

Before going live:

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Build completes successfully
- [ ] Frontend loads at nexus-saas-platform.vercel.app
- [ ] Login page displays correctly
- [ ] API endpoint responds
- [ ] Login works
- [ ] Dashboard shows data
- [ ] Multi-tenant isolation verified
- [ ] No console errors
- [ ] Performance acceptable

---

## 🎉 Success!

Your NEXUS SaaS Platform is now live at:
```
https://nexus-saas-platform.vercel.app
```

- Frontend: Vercel CDN (fast!)
- Backend: Railway.app
- Database: Supabase PostgreSQL
- Auth: JWT tokens

## Next Steps

1. Share domain with team
2. Monitor performance
3. Set up error tracking
4. Plan scaling strategy
5. Implement analytics

---

## Support

- Vercel Docs: https://vercel.com/docs
- GitHub Docs: https://docs.github.com
- Troubleshooting: See error logs in Vercel Dashboard

**Deployment complete! 🚀**
