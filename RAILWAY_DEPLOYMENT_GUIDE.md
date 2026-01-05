# 🚀 Railway Backend Deployment Guide

## Automatic Deployment Setup (Recommended)

### Step 1: Configure GitHub Secrets
1. Go to your GitHub repository: https://github.com/Sohila01/saasys
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `RAILWAY_TOKEN`
5. Value: `d399a7b7-5399-42fb-b904-eb3df186180e`
6. Click **Add secret**

✅ Now the GitHub Actions workflow will automatically deploy on every push to `backend/`

---

## Manual Deployment (Alternative)

### Step 1: Create Railway Project
1. Go to https://railway.app
2. Click **Create a new project**
3. Select **GitHub** and authorize
4. Choose repository: `Sohila01/saasys`

### Step 2: Add Backend Service
1. Click **Add service**
2. Select **GitHub Repo**
3. Select the same repo
4. Set root directory: `backend/`
5. Build command: `npm install && npm run build`
6. Start command: `npm run start:prod`

### Step 3: Add Environment Variables
Click **Variables** and add:

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://zupngmmhtpnkyxcjhnoo.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cG5nbW1odHBua3l4Y2pobm9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUxMzE1MCwiZXhwIjoyMDgzMDg5MTUwfQ.e06IEV-VLyYUWCD-SGnfOwF-mIAUJKgK5A4A_pVnxz4
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cG5nbW1odHBua3l4Y2pobm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MTMxNTAsImV4cCI6MjA4MzA4OTE1MH0.IL2FxjVD5bJ6JUBDP2ZPBaWxZ6L6B206ovEpbhUIilg
JWT_SECRET=nexus-saas-platform-production-jwt-secret-2024-highly-secure-key
JWT_EXPIRATION=7d
FRONTEND_URL=https://nexus-saas-platform.vercel.app
```

### Step 4: Deploy
Click **Deploy** and wait for completion

---

## Get Backend URL

After deployment, Railway will provide a URL like:
```
https://nexus-saas-backend.up.railway.app
```

Update Vercel with this URL:
1. Go to https://vercel.com/dashboard
2. Select **nexus-saas-platform** project
3. Go to **Settings → Environment Variables**
4. Update `VITE_API_URL` to: `https://[RAILWAY_URL]/api`
5. Save and Redeploy

---

## Current Status

✅ Frontend: https://nexus-saas-platform.vercel.app
⏳ Backend: Waiting for Railway deployment
✅ Database: Supabase configured
✅ GitHub: All code pushed

