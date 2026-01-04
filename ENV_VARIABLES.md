# Environment Variables Reference

## Backend Configuration (backend/.env)

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `SUPABASE_URL` | string | Yes | Supabase project URL | `https://zupngmmhtpnkyxcjhnoo.supabase.co` |
| `SUPABASE_SERVICE_KEY` | string | Yes | Supabase service role key (for admin operations) | `eyJhbGc...` |
| `SUPABASE_ANON_KEY` | string | Yes | Supabase anonymous key (for client operations) | `sb_publish...` |
| `JWT_SECRET` | string | Yes | Secret key for signing JWT tokens (min 32 chars) | `your-super-secret-key-with-32-chars-min` |
| `JWT_EXPIRATION` | string | No | JWT token expiration time | `7d`, `24h`, `30m` |
| `PORT` | number | No | Server port | `3000` |
| `NODE_ENV` | string | No | Environment (development/production) | `production` |
| `FRONTEND_URL` | string | No | Frontend URL for CORS configuration | `https://nexus.example.com` |
| `SENDGRID_API_KEY` | string | No | SendGrid API key for email (optional) | `SG.xxxxx` |
| `SENDGRID_FROM_EMAIL` | string | No | SendGrid sender email | `noreply@nexus.local` |

## Frontend Configuration (root/.env.local)

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `VITE_API_URL` | string | Yes | Backend API base URL | `http://localhost:3000/api/v1` |
| `VITE_SUPABASE_URL` | string | Yes | Supabase project URL | `https://zupngmmhtpnkyxcjhnoo.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | string | Yes | Supabase anonymous key | `sb_publish...` |

## Getting Credentials

### Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project or select existing
3. Go to **Settings** → **API**
4. Copy:
   - `Project URL` → `SUPABASE_URL`
   - `Service Role Key` → `SUPABASE_SERVICE_KEY` (backend only!)
   - `Anon Public Key` → `SUPABASE_ANON_KEY` (can be public)

### JWT Secret

Generate a strong secret:
```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

## Environment by Deployment

### Local Development
```env
# backend/.env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=dev-secret-key-32-chars-minimum
JWT_EXPIRATION=7d
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```env
# .env.local (frontend)
VITE_API_URL=http://localhost:3000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Staging
```env
# backend/.env
SUPABASE_URL=https://your-staging-project.supabase.co
SUPABASE_SERVICE_KEY=staging-service-key
SUPABASE_ANON_KEY=staging-anon-key
JWT_SECRET=staging-secret-key-32-chars-minimum
JWT_EXPIRATION=7d
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://staging.nexus.example.com
```

### Production
```env
# backend/.env
SUPABASE_URL=https://your-production-project.supabase.co
SUPABASE_SERVICE_KEY=prod-service-key
SUPABASE_ANON_KEY=prod-anon-key
JWT_SECRET=prod-secret-key-VERY-STRONG-32-CHARS-MIN
JWT_EXPIRATION=7d
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://nexus.example.com
```

## Important Security Notes

1. **Never commit `.env` files to git**
   - Add to `.gitignore`
   - Use `.env.example` for reference

2. **SERVICE_KEY is sensitive**
   - Only for backend use
   - Never expose to frontend
   - Never commit to version control

3. **JWT_SECRET should be strong**
   - Minimum 32 characters
   - Use cryptographically random generation
   - Change if compromised

4. **FRONTEND_URL is for CORS**
   - Must match deployment domain
   - Used to validate cross-origin requests

5. **Store in deployment platform**
   - Railway: Environment variables in dashboard
   - Render: Environment variables in service settings
   - Heroku: `heroku config:set VAR=value`

## Validation

Check your variables are set correctly:

```bash
# Backend
cd backend
echo $SUPABASE_URL
echo $JWT_SECRET
# ... check others

# Frontend
echo $VITE_API_URL
echo $VITE_SUPABASE_ANON_KEY
```

## Troubleshooting

### Database Connection Error
```
Error: supabaseUrl is required.
```
→ Check `SUPABASE_URL` is set in `.env`

### JWT Errors
```
Error: JWT malformed
```
→ Verify `JWT_SECRET` is set and token format is correct

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
→ Check `FRONTEND_URL` matches your deployment URL

### Token Expiration
```
TokenExpiredError: jwt expired
```
→ Increase `JWT_EXPIRATION` or adjust `JWT_SECRET`

## Updating Variables

### Local Development
```bash
# Edit .env file directly
nano backend/.env
# Restart server
npm run start:dev
```

### Production (Railway)
1. Go to Railway dashboard
2. Click project → Variables
3. Edit values
4. Redeploy
5. Restart server

### Production (Render)
1. Go to Render dashboard
2. Click service → Environment
3. Edit variables
4. Redeploy
5. Auto-restarts

## Variable Precedence

1. Environment variables (system/shell)
2. `.env` file (local development)
3. Platform secrets (production)
4. Default values (hardcoded)

## Next Steps

1. Create `.env` with all required variables
2. Test locally: `npm run start:dev`
3. Test API: `curl http://localhost:3000/api/v1/health`
4. Deploy with same variables to production
5. Verify connection after deployment
