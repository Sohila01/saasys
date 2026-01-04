# Quick Vercel Deployment Guide

## Prerequisites
- Vercel account (create at https://vercel.com if needed)
- GitHub repository connected to Vercel

## Step 1: Connect GitHub Repository to Vercel

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Select "Import Git Repository"
4. Search for and select `https://github.com/Sohila01/saasys`
5. Click "Import"

## Step 2: Configure Environment Variables

In the Vercel dashboard, go to Settings → Environment Variables and add:

```
VITE_API_URL=https://your-backend-api.com/api/v1
VITE_SUPABASE_URL=https://zupngmmhtpnkyxcjhnoo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

To get these values:
- **VITE_API_URL**: Backend API URL (e.g., https://nexus-backend.railway.app/api/v1)
- **VITE_SUPABASE_URL**: From Supabase project settings
- **VITE_SUPABASE_ANON_KEY**: From Supabase project settings → API

## Step 3: Build Settings

The `vercel.json` is already configured with:
- Build Command: `npm install && npm run build`
- Output Directory: `dist`
- Framework: `vite`

## Step 4: Deploy Backend

Deploy the backend to Railway or similar service:

1. Connect `backend/` to Railway or Heroku
2. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `JWT_SECRET`
   - `JWT_EXPIRY`
   - `DATABASE_URL` (if using separate DB)

3. Database migrations will run automatically

## Step 5: Update API URLs

Once backend is deployed, update `VITE_API_URL` in Vercel to point to your backend deployment.

## Automatic Deployments

Once connected:
- **Production**: Pushes to `master` branch auto-deploy to production
- **Preview**: Every PR gets a preview deployment

## Troubleshooting

If build fails:
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Check that all npm dependencies are installed
4. Ensure `dist/` is being generated correctly

## Deployment Status

- ✅ Frontend ready for Vercel
- ✅ Code pushed to GitHub
- ⏳ Backend needs separate deployment (Railway/Heroku)
- ⏳ Environment variables need to be configured

## Next Steps

1. Create Vercel account and import GitHub repo
2. Deploy backend to Railway/Heroku
3. Update environment variables
4. Test production deployment
