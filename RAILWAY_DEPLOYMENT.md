# Backend Deployment to Railway

## Prerequisites
- Railway account (create at https://railway.app)
- GitHub repository (already pushed)

## Step 1: Create Railway Project

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access GitHub
5. Select `Sohila01/saasys` repository
6. Select the `backend` service

## Step 2: Configure Build Settings

Railway should auto-detect:
- Framework: NestJS
- Start command: `npm run start:prod`
- Build command: `npm run build`
- Root directory: `backend/`

If not auto-detected, set manually:
```
Build Command: npm run build
Start Command: npm run start:prod
```

## Step 3: Set Environment Variables

In Railway project settings, add these variables:

```env
NODE_ENV=production
PORT=3000

# Supabase
SUPABASE_URL=https://zupngmmhtpnkyxcjhnoo.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRY=7d

# Frontend URL
FRONTEND_URL=https://your-vercel-domain.vercel.app
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

## Step 4: Deploy

1. Connect your GitHub account to Railway
2. Railway automatically deploys when you push to `master` branch
3. View logs in Railway dashboard

## Step 5: Get API URL

Once deployed:
1. Go to Railway project settings
2. Copy the domain (e.g., `https://nexus-backend-prod.railway.app`)
3. Update `VITE_API_URL` in Vercel to: `https://your-domain/api/v1`

## Environment Variables Needed

| Variable | Value | Notes |
|----------|-------|-------|
| SUPABASE_URL | From Supabase | Project URL |
| SUPABASE_KEY | From Supabase | Anon key (public) |
| SUPABASE_SERVICE_ROLE_KEY | From Supabase | Service role key (private) |
| JWT_SECRET | Generate random | Min 32 characters |
| JWT_EXPIRY | 7d | Token validity period |
| NODE_ENV | production | Set for production |
| FRONTEND_URL | Vercel domain | For CORS |
| CORS_ORIGIN | Vercel domain | Allowed origins |

## Database Setup

Railway can host PostgreSQL:
1. Click "Add Service" in Railway
2. Select "PostgreSQL"
3. Database will be auto-created
4. Run migrations using the connection string

OR use Supabase PostgreSQL (already set up) - no additional DB needed.

## Monitoring

In Railway dashboard:
- View live logs
- Monitor CPU/Memory usage
- Check recent deployments
- Set up alerts for failures

## Troubleshooting

**Port already in use:**
- Railway sets `PORT` environment variable automatically
- App should use `process.env.PORT || 3000`

**Build fails:**
- Check build logs in Railway
- Ensure `npm run build` works locally
- Check that `backend/package.json` exists

**Environment variables not working:**
- Restart deployment after adding variables
- Variables take effect on next deploy
- Check Railway → Project → Variables tab

## Auto-deployments

Once connected:
- **Production**: Every push to `master` auto-deploys
- **Staging**: Create PR for preview deployments
- **Logs**: View real-time logs in Railway dashboard

## Next Steps

1. Create Railway account
2. Connect GitHub repo
3. Set environment variables
4. Deploy
5. Test API endpoints
6. Update Vercel with backend API URL
