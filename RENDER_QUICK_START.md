# 🚀 Render Backend Deployment - Quick Start Guide

## ✅ Your Render Token is Ready!

Token: `re_Td6pXdjK_GnmMCMUgUJh3SLiHqFJKJX32`

---

## 🎯 Easy 5-Minute Setup:

### Step 1: Go to Render Dashboard
https://dashboard.render.com

### Step 2: Create a New Web Service
1. Click **New +** button (top right)
2. Click **Web Service**
3. Click **Connect a Repository**

### Step 3: Connect GitHub
1. Select: **Sohila01/saasys**
2. Click **Connect**

### Step 4: Configure Service

Fill in these values:

| Field | Value |
|-------|-------|
| **Name** | `nexus-saas-backend` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start:prod` |
| **Plan** | `Free` |

### Step 5: Add Environment Variables

Click **Advanced → Add Environment Variable** and add each one:

```
NODE_ENV = production
PORT = 3000

SUPABASE_URL = https://zupngmmhtpnkyxcjhnoo.supabase.co
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cG5nbW1odHBua3l4Y2pobm9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUxMzE1MCwiZXhwIjoyMDgzMDg5MTUwfQ.e06IEV-VLyYUWCD-SGnfOwF-mIAUJKgK5A4A_pVnxz4

SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cG5nbW1odHBua3l4Y2pobm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MTMxNTAsImV4cCI6MjA4MzA4OTE1MH0.IL2FxjVD5bJ6JUBDP2ZPBaWxZ6L6B206ovEpbhUIilg

JWT_SECRET = nexus-saas-platform-production-jwt-secret-2024-highly-secure-key

JWT_EXPIRATION = 7d

FRONTEND_URL = https://nexus-saas-platform.vercel.app
```

### Step 6: Deploy!
Click **Create Web Service** and wait...

---

## ⏳ What Happens Next:

1. **Building** (2-3 minutes)
   - Render pulls code from GitHub
   - Installs dependencies
   - Builds the project

2. **Deploying** (1-2 minutes)
   - Starts the server
   - Runs health checks

3. **Live!** 🎉
   - You'll get a URL like: `https://nexus-saas-backend.onrender.com`

---

## 🎯 Final Step: Update Vercel

After Render gives you the URL (e.g., `https://nexus-saas-backend.onrender.com`):

1. Go to **Vercel Dashboard**
2. Select **nexus-saas-platform**
3. **Settings → Environment Variables**
4. Update: `VITE_API_URL = https://nexus-saas-backend.onrender.com/api`
5. Click **Save**
6. Click **Redeploy**

---

## 📊 Your Architecture:

```
User's Browser
    ↓ (HTTPS)
    ↓
https://nexus-saas-platform.vercel.app (Frontend)
    ↓ API Calls ↓
    ↓
https://nexus-saas-backend.onrender.com (Backend API)
    ↓
Supabase PostgreSQL
```

---

## ✅ Done! Your App is Live:

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | https://nexus-saas-platform.vercel.app | ✅ Live |
| Backend | https://nexus-saas-backend.onrender.com | ⏳ Building |
| Database | Supabase | ✅ Ready |
| Code | GitHub | ✅ Updated |

---

## 🆘 Troubleshooting:

### Build Failed?
1. Check Render Build Logs
2. Make sure `backend/package.json` exists
3. Verify `npm run build` works locally

### Port Error?
- Render assigns port automatically, ignore PORT env var

### CORS Error?
- Check `FRONTEND_URL` is set correctly
- Verify CORS in Backend

### Still Have Issues?
- Check: https://github.com/Sohila01/saasys/issues
- Render Support: https://render.com/docs

