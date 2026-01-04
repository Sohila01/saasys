# NEXUS Backend Deployment Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- Git repository set up
- Vercel account (for frontend) or similar
- Railway/Render account (for backend) or similar

## Environment Setup

### 1. Backend Environment Variables (`.env`)

Create a `.env` file in the `backend/` directory with:

```env
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# JWT
JWT_SECRET=your-32-character-minimum-secret-key
JWT_EXPIRATION=7d

# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Email (Optional - for SendGrid integration)
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@nexus.local
```

### 2. Frontend Environment Variables (`.env.local`)

Create `.env.local` in the root directory:

```env
VITE_API_URL=https://your-backend-api.com/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Local Development

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend (in another terminal)
npm run dev
```

Access:
- Frontend: http://localhost:5173
- API: http://localhost:3000/api/v1
- Swagger Docs: http://localhost:3000/api/docs

## Production Deployment

### Option 1: Railway.app (Recommended)

1. **Connect GitHub repository:**
   - Go to railway.app
   - Create new project
   - Connect your GitHub repo

2. **Configure environment:**
   - In Railway dashboard, add environment variables from `.env`
   - Set `NODE_ENV=production`

3. **Deploy:**
   ```bash
   cd backend
   npm run build
   npm start
   ```

4. **Get public URL:**
   - Railway will provide `https://your-api-*.railway.app`
   - Update frontend VITE_API_URL

### Option 2: Render.com

1. **Create Web Service:**
   - New → Web Service
   - Connect GitHub repo
   - Select `nexus-saas-platform` repo

2. **Build & Start Commands:**
   - Build: `cd backend && npm install && npm run build`
   - Start: `cd backend && npm start`

3. **Environment Variables:**
   - Add all variables from `.env` in Render dashboard

4. **Deploy:**
   - Click Deploy
   - Get public URL

### Option 3: Heroku (Legacy)

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create nexus-api

# Set environment variables
heroku config:set NODE_ENV=production -a nexus-api
heroku config:set JWT_SECRET=your-secret -a nexus-api
# ... set other variables

# Deploy
git push heroku main
```

## Database Setup

### 1. Create Supabase Project
- Go to supabase.com
- Create new project
- Get credentials

### 2. Initialize Database Schema
```bash
# Use existing supabase-schema.sql
psql -h your-db-host -U postgres -d postgres -f supabase-schema.sql
```

Or run manually in Supabase SQL Editor:
- Copy contents of `supabase-schema-complete.sql`
- Paste in Supabase SQL Editor
- Execute

### 3. Enable Row Level Security (RLS)

All tables should have RLS enabled with policies:

```sql
-- Example RLS policy
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_records ON records
  FOR SELECT USING (
    tenant_id = auth.jwt() ->> 'tenant_id'
  );

CREATE POLICY insert_records ON records
  FOR INSERT WITH CHECK (
    tenant_id = auth.jwt() ->> 'tenant_id'
  );
```

## Backend API Structure

### Authentication Endpoints
- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

### Data Endpoints (with JWT required)
- `GET /api/v1/data/:moduleSlug` - List records
- `POST /api/v1/data/:moduleSlug` - Create record
- `GET /api/v1/data/:moduleSlug/:recordId` - Get record
- `PATCH /api/v1/data/:moduleSlug/:recordId` - Update record
- `DELETE /api/v1/data/:moduleSlug/:recordId` - Delete record

### Configuration
- `GET /api/v1/config/modules` - List modules
- `GET /api/v1/config/modules/:moduleId/fields` - Get module fields

### Other Endpoints
- Tenants, Dashboards, Notifications, Attachments, Comments, Suppliers, Workflows

## SSL/TLS Certificate

### For Railway/Render
- Automatically provided with HTTPS domain

### For Custom Domain
1. Get domain (e.g., from Namecheap, GoDaddy)
2. Point to deployment URL
3. Configure SSL in dashboard

## Monitoring & Logs

### Railway
- Logs tab in dashboard
- Real-time monitoring available

### Render
- Logs tab in service dashboard
- Error tracking

## Health Check

Test deployment:
```bash
curl https://your-api.com/api/v1/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-05T00:00:00.000Z"
}
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Environment Variables Not Loaded
- Check `.env` file exists in correct location
- Verify all required variables are set
- Restart dev server

### Database Connection Error
- Verify SUPABASE_URL and keys are correct
- Check Supabase project is accessible
- Ensure RLS policies allow connections

### JWT Errors
- Verify JWT_SECRET is set (minimum 32 chars)
- Check token expiration time
- Ensure Authorization header format is `Bearer <token>`

## Performance Optimization

### Frontend
- Vite production build
- Lazy load routes
- Code splitting enabled

### Backend
- Connection pooling via Supabase
- RLS reduces data returned
- JWT validation cached

## Security Checklist

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] SUPABASE_SERVICE_KEY not exposed in frontend
- [ ] RLS policies enabled on all tables
- [ ] CORS configured for frontend domain
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Environment variables not in git
- [ ] Error messages don't leak sensitive data

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm install && npm run build
      - run: npm start
```

## Rollback

If deployment fails:
- Railway: Click "Rollback" to previous deployment
- Render: Deploy previous commit
- Heroku: `heroku releases:rollback`

## Next Steps

1. Test login at https://your-frontend.com
2. Verify API connectivity in Swagger
3. Test multi-tenant isolation
4. Load test with concurrent users
5. Set up monitoring alerts
6. Configure backup strategy

## Support

For issues:
1. Check logs in deployment dashboard
2. Verify environment variables
3. Test locally first
4. Review API documentation
5. Contact support team
