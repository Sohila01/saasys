# Deployment Guide - Nexus SaaS Platform

## Architecture Overview

```
┌─────────────────┐
│   Frontend      │
│   (React/Vite)  │
│   Vercel        │
└────────┬────────┘
         │
         ├─────────────────────────┐
         │                         │
         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│  Backend API     │      │  Supabase Auth   │
│  (NestJS)        │      │  (Managed)       │
│  Railway/Render  │      │                  │
└────────┬─────────┘      └──────────────────┘
         │
         ▼
┌──────────────────────────┐
│   Supabase PostgreSQL    │
│   (Database + Storage)   │
│   (Managed)              │
└──────────────────────────┘
```

---

## Phase 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Sign in
3. Create new project
4. Choose region close to users
5. Create strong database password
6. Wait for project to initialize

### 1.2 Apply Database Schema

1. Copy entire `supabase-schema-complete.sql` file
2. Go to Supabase Dashboard → SQL Editor
3. Click "New Query"
4. Paste entire SQL file
5. Click "Run"
6. Verify all tables created:
   - 17 tables created
   - 15 RLS policies enabled
   - Helper function `get_current_tenant_id()` created
   - 6 main modules seeded

### 1.3 Get Database Credentials

From Supabase Dashboard → Settings → API:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

Store these securely in environment variables.

### 1.4 Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create new bucket: `attachments`
3. Set to **Private**
4. Configure CORS:
   ```json
   {
     "allowedOrigins": ["*"],
     "allowedMethods": ["GET", "POST", "DELETE"],
     "allowedHeaders": ["*"],
     "maxAgeSeconds": 3600
   }
   ```

### 1.5 Enable Replication (for Real-time)

1. Go to Settings → Database → Replication
2. Enable replication for these tables:
   - notifications
   - comments
   - dashboards
3. Create publication for real-time updates

---

## Phase 2: Backend Deployment (NestJS API)

### 2.1 Prepare Backend Code

1. Implement all 10 modules (see BACKEND_IMPLEMENTATION.md):
   - Auth Module (login, refresh, logout)
   - Tenant Module (tenant management)
   - Config Module (schema builder)
   - Data Module (CRUD operations)
   - Dashboard Module (analytics)
   - Notifications Module (real-time)
   - Attachments Module (file upload)
   - Comments Module (discussions)
   - Suppliers Module (B2B portal)
   - Workflows Module (automation)

2. Add guards and middleware:
   - JwtAuthGuard (token validation)
   - TenantGuard (tenant isolation)
   - RoleGuard (authorization)
   - AuditMiddleware (logging)

3. Add unit tests for each module

### 2.2 Deploy to Railway

Railway is recommended for NodeJS/NestJS:

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Backend: Complete implementation"
git push origin main
```

**Step 2: Create Railway Account**
- Go to [railway.app](https://railway.app)
- Sign in with GitHub
- Authorize GitHub access

**Step 3: Create New Project**
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Find `nexus-saas-platform` repo
4. Authorize and connect

**Step 4: Configure Environment**
1. In Railway dashboard, add variables:
   ```
   SUPABASE_URL=your_url
   SUPABASE_SERVICE_KEY=your_key
   SUPABASE_ANON_KEY=your_key
   JWT_SECRET=generate_32_char_secret
   JWT_EXPIRATION=3600
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   SENDGRID_API_KEY=your_sendgrid_key
   ```

2. Set build command:
   ```bash
   npm install && npm run build
   ```

3. Set start command:
   ```bash
   npm run start:prod
   ```

**Step 5: Deploy**
- Railway automatically deploys on push to main
- Monitor logs in dashboard
- Get API URL from "Connect" section

### 2.3 Alternative: Deploy to Render

If using Render instead of Railway:

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Configure:
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
   - Environment Variables: (same as Railway)
5. Deploy

### 2.4 Alternative: Deploy to AWS Lambda + API Gateway

For serverless deployment:

1. Install Serverless Framework:
   ```bash
   npm install -g serverless
   serverless login
   ```

2. Create `serverless.yml`:
   ```yaml
   service: nexus-api
   provider:
     name: aws
     runtime: nodejs18.x
     region: us-east-1
     environment:
       SUPABASE_URL: ${env:SUPABASE_URL}
       SUPABASE_SERVICE_KEY: ${env:SUPABASE_SERVICE_KEY}
   functions:
     api:
       handler: dist/main.handler
       events:
         - http:
             path: /{proxy+}
             method: ANY
             cors: true
   ```

3. Deploy:
   ```bash
   npm run build
   serverless deploy
   ```

---

## Phase 3: Frontend Deployment (React/Vite)

### 3.1 Update Frontend Config

Update `.env.production`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://your-api.railway.app/api/v1
```

### 3.2 Deploy to Vercel

**Already Configured!** Vercel auto-deploys on git push to main.

1. Push code:
   ```bash
   git add .
   git commit -m "Frontend: Update API URL"
   git push origin main
   ```

2. Vercel automatically:
   - Builds with `npm run build`
   - Optimizes with Vite
   - Deploys to CDN
   - Sets environment variables

3. Monitor deployment:
   - Go to [vercel.com](https://vercel.com)
   - View deployment logs
   - Get production URL

### 3.3 Custom Domain (Optional)

In Vercel Dashboard:
1. Go to Settings → Domains
2. Add custom domain (e.g., app.nexus-saas.com)
3. Update DNS records from registrar
4. Wait for SSL certificate

---

## Phase 4: Domain & DNS Configuration

### 4.1 Setup Custom Domains

For production SaaS, use these domains:

```
Primary:     app.nexus-saas.com   → Vercel (Frontend)
API:         api.nexus-saas.com   → Railway (Backend)
Marketing:   nexus-saas.com       → Static site / landing
Docs:        docs.nexus-saas.com  → GitHub Pages / docs site
```

### 4.2 DNS Records (with Cloudflare)

Recommended provider: Cloudflare (free, great performance)

1. Add nameservers to Cloudflare
2. Create DNS records:

| Type  | Name                | Value                    |
|-------|---------------------|--------------------------|
| CNAME | app                 | nexus.vercel.app         |
| CNAME | api                 | your-railway.com         |
| CNAME | www                 | nexus-saas.com           |
| A    | @                   | Cloudflare IP            |

### 4.3 SSL/TLS Certificate

- **Vercel**: Automatically provided
- **Railway**: Let's Encrypt (automatic)
- **Cloudflare**: Use "Full" or "Full (strict)" mode

---

## Phase 5: Monitoring & Logging

### 5.1 Backend Monitoring

Add error tracking (Sentry recommended):

1. Create Sentry account at [sentry.io](https://sentry.io)
2. Create new project for NestJS
3. Copy DSN
4. Add to environment:
   ```env
   SENTRY_DSN=https://your-dsn@sentry.io/123456
   ```

5. In `main.ts`:
   ```typescript
   import * as Sentry from '@sentry/node';
   
   Sentry.init({ dsn: process.env.SENTRY_DSN });
   app.use(Sentry.Handlers.requestHandler());
   app.use(Sentry.Handlers.errorHandler());
   ```

### 5.2 Database Monitoring

Use Supabase built-in monitoring:
1. Dashboard → Monitoring
2. Track:
   - Query performance
   - Storage usage
   - Auth usage
   - Real-time connections

### 5.3 Frontend Monitoring

Track user behavior with Sentry JS:

```typescript
// In App.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: 'production',
});
```

### 5.4 Logging

All backend services log to:
- Console (development)
- File (production via Railway logs)
- Database (audit_logs table)

View logs:
```bash
# Railway
railway logs -s api

# Render
render logs

# Local
npm run start:dev
```

---

## Phase 6: Performance Optimization

### 6.1 Database Optimization

1. Add indexes (already in schema):
   ```sql
   CREATE INDEX idx_sub_module_records_tenant 
     ON sub_module_records(tenant_id, module_id);
   CREATE INDEX idx_audit_logs_tenant 
     ON audit_logs(tenant_id, created_at DESC);
   ```

2. Enable connection pooling:
   - Use PgBouncer with Supabase
   - Set pool mode: transaction

3. Archive old data:
   - Move audit logs >1 year to cold storage
   - Archive soft-deleted records

### 6.2 API Optimization

1. Add caching:
   ```typescript
   @Get('/modules')
   @Cacheable({ ttl: 300 }) // 5 minutes
   async getModules() { ... }
   ```

2. Add compression:
   ```typescript
   app.use(compression());
   ```

3. Implement pagination (already done)

4. Use connection pooling:
   - Max 100 connections for free Supabase
   - Upgrade for higher limits

### 6.3 Frontend Optimization

Already configured in `vite.config.ts`:
- Code splitting
- Asset minification
- Image optimization
- Lazy loading

Verify with Lighthouse:
```bash
npm run build
npm run preview
# Open in Chrome → DevTools → Lighthouse
```

---

## Phase 7: Security Hardening

### 7.1 Database Security

✅ Already configured:
- RLS on all tables
- Row-level isolation via tenant_id
- Audit logging
- Soft deletes (data recovery)

Action items:
1. Enable audit logging in Supabase
2. Setup backup retention (7-30 days)
3. Test RLS policies (use Supabase RLS tester)

### 7.2 API Security

✅ Already configured:
- CORS validation
- Helmet security headers
- JWT token validation
- Input validation with pipes

Add:
1. Rate limiting (already done globally)
2. DDoS protection via Cloudflare
3. API key rotation every 90 days

```typescript
// Rate limiting per user
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
```

### 7.3 Frontend Security

✅ Already configured:
- HTTPS/SSL enforced
- CSP headers (via Helmet)
- CSRF protection
- XSS mitigation (React escaping)

Add:
1. Subresource integrity for CDN assets
2. Certificate pinning for mobile apps
3. Content Security Policy:
   ```
   default-src 'self';
   script-src 'self' 'unsafe-inline' cdn.jsdelivr.net;
   style-src 'self' 'unsafe-inline';
   connect-src 'self' api.nexus-saas.com supabase.co;
   ```

### 7.4 Secrets Management

Use environment variables (not in code):
- Railway: Auto-encrypted
- Vercel: Auto-encrypted
- Local: Use `.env.local` (gitignored)

Never commit:
- API keys
- Database credentials
- JWT secrets
- Service keys

---

## Phase 8: Testing & Validation

### 8.1 Backend Testing

Run unit tests:
```bash
npm run test              # Run all tests
npm run test:cov          # Generate coverage
npm run test:e2e          # End-to-end tests
```

### 8.2 API Integration Testing

Using Postman:
1. Import Swagger spec: `/api-json`
2. Create test collection for each module
3. Use variables for token/tenant_id
4. Run full test suite

### 8.3 Load Testing

Using k6:
```bash
npm install -g k6
k6 run load-test.js
```

Test script (`load-test.js`):
```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 100 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  let response = http.get('https://api.nexus-saas.com/api/v1/dashboards');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

### 8.4 Security Testing

1. **OWASP Top 10 scan**:
   - SQL Injection: ✅ Protected by ORM
   - XSS: ✅ React escaping
   - CSRF: ✅ JWT-based
   - Auth bypass: ✅ RLS enforcement
   - Sensitive data: ✅ Audit logging

2. **Dependency scanning**:
   ```bash
   npm audit
   npm audit fix
   ```

3. **Penetration testing**:
   - Use Burp Suite Community
   - Test all endpoints
   - Check for privilege escalation

---

## Checklist Before Production Launch

- [ ] Database schema applied to Supabase
- [ ] All 10 backend modules implemented
- [ ] All endpoints tested via Swagger
- [ ] Frontend API integration complete
- [ ] Environment variables set (no hardcoded secrets)
- [ ] SSL/HTTPS enabled everywhere
- [ ] Monitoring and error tracking configured
- [ ] Backup strategy implemented
- [ ] Load testing completed (min 1000 concurrent users)
- [ ] Security audit completed
- [ ] Legal: Privacy policy and ToS ready
- [ ] Documentation complete and published
- [ ] Support team trained
- [ ] Marketing site ready
- [ ] Analytics configured (GA4)

---

## Production URLs

Once deployed, you'll have:

| Service       | URL                          | Provider |
|---------------|------------------------------|----------|
| Frontend      | https://app.nexus-saas.com   | Vercel   |
| API           | https://api.nexus-saas.com   | Railway  |
| Database      | Project on supabase.co       | Supabase |
| Docs          | https://docs.nexus-saas.com  | GitHub   |
| Admin         | https://app.nexus-saas.com/admin | Vercel |
| API Docs      | https://api.nexus-saas.com/api/docs | Railway |

---

## Troubleshooting

### Backend won't start
```bash
# Check environment variables
echo $SUPABASE_URL
npm run start:dev

# Check logs
railway logs -s api

# Test database connection
npm run test:db
```

### Frontend shows 403 on API calls
```
Reason: RLS policy rejecting request
Solution: Verify JWT token includes tenant_id claim
         Check RLS policies in Supabase SQL
```

### Slow queries on production
```bash
# Enable query logging
SELECT query_start, query FROM pg_stat_statements
ORDER BY query_start DESC LIMIT 10;

# Add missing indexes
EXPLAIN ANALYZE SELECT ...
```

### Email notifications not sending
```
Check SendGrid API key in env
Verify email template exists
Check email_queue table for failed entries
```

---

## Cost Estimate (Monthly)

| Service        | Plan       | Cost    | Notes                      |
|----------------|-----------|--------|----------------------------|
| Supabase       | Pro       | $25    | 500GB storage, RLS         |
| Railway        | Pro       | $20    | Unlimited deployments      |
| Vercel         | Pro       | $20    | Multiple projects          |
| Cloudflare     | Free      | $0     | DNS + CDN                  |
| SendGrid       | Free/Paid | $0-100 | Depends on volume          |
| Sentry         | Pro       | $29    | Error tracking             |
| **Total**      |           | **$94-194** | Scales with usage    |

For 10K users, expect ~$500/month. Enterprise customers can negotiate.

---

## Support & Documentation

- **Setup Help**: [SETUP_GUIDE.md](../SETUP_GUIDE.md)
- **Backend Dev**: [BACKEND_IMPLEMENTATION.md](../BACKEND_IMPLEMENTATION.md)
- **API Docs**: [API.md](./API.md) + Swagger at `/api/docs`
- **Community**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
