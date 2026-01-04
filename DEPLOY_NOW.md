# NEXUS SaaS Platform - Deployment Instructions

## Quick Start Deployment (Railway.app) - Recommended

### 1. Prepare Repository

```bash
cd nexus-saas-platform

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Complete NEXUS SaaS platform"

# Create GitHub repository
# Go to github.com/new
# Create repo "nexus-saas-platform"
# Push code

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexus-saas-platform.git
git push -u origin main
```

### 2. Deploy Backend to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Login/Sign up**
3. **New Project → Import from GitHub**
4. **Select your nexus-saas-platform repo**
5. **Configure:**
   - Root directory: `backend/`
   - Build command: `npm install && npm run build`
   - Start command: `npm run start:prod`

6. **Add Environment Variables:**
   - Go to Variables tab
   - Add all from `backend/.env.example`:
     ```
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_SERVICE_KEY=your-service-key
     SUPABASE_ANON_KEY=your-anon-key
     JWT_SECRET=your-32-char-secret
     JWT_EXPIRATION=7d
     PORT=3000
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend-domain.com
     ```

7. **Deploy:** Click "Deploy" button
8. **Get public URL:** Copy domain from Railway dashboard

### 3. Deploy Frontend to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Login/Sign up**
3. **Import Project → Select GitHub repo**
4. **Configure:**
   - Framework: Vite
   - Root directory: `./`

5. **Environment Variables:**
   ```
   VITE_API_URL=https://your-railway-api.railway.app/api/v1
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

6. **Deploy:** Click "Deploy"
7. **Get URL:** Vercel provides automatic domain

### 4. Post-Deployment

```bash
# Test backend health
curl https://your-railway-api.railway.app/api/v1/health

# Test frontend
Open https://your-vercel-domain.vercel.app

# Update backend FRONTEND_URL if needed
# Go to Railway → Variables
# Update FRONTEND_URL=https://your-vercel-domain.vercel.app
```

## Alternative: Render.com Deployment

### Backend on Render

1. **Go to [render.com](https://render.com)**
2. **New → Web Service**
3. **Connect GitHub repository**
4. **Settings:**
   - Name: `nexus-backend`
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Region: closest to users
   - Plan: Free or Paid

5. **Environment Variables:**
   - Add all variables from `.env`

6. **Deploy:** Click "Create Web Service"

### Frontend on Render (Alternative)

1. **New → Static Site**
2. **Connect GitHub repo**
3. **Settings:**
   - Name: `nexus-frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Environment Variables:
     ```
     VITE_API_URL=https://your-render-api-domain.onrender.com/api/v1
     ```

4. **Deploy**

## Manual Deployment (Linux Server)

### Prerequisites
- Ubuntu 20.04+ or similar
- Node.js 18+
- PostgreSQL (or use Supabase)
- nginx or Apache
- SSL certificate (Let's Encrypt)

### Steps

```bash
# 1. SSH into server
ssh root@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone repository
cd /var/www
git clone https://github.com/YOUR_USERNAME/nexus-saas-platform.git
cd nexus-saas-platform

# 4. Setup backend
cd backend
npm install
npm run build

# 5. Create .env
nano .env
# Paste all environment variables
# Press Ctrl+X, Y, Enter to save

# 6. Setup PM2 for process management
sudo npm install -g pm2
pm2 start npm --name "nexus-backend" -- start:prod
pm2 startup
pm2 save

# 7. Setup frontend
cd ..
npm install
npm run build

# 8. Setup nginx
sudo apt-get install nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/nexus

# Paste:
```
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/nexus-saas-platform/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/v1 {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/nexus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 9. Setup SSL (Let's Encrypt)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# 10. Verify services
curl https://your-domain.com/api/v1/health
# Should return: {"status":"ok"}
```

## Docker Deployment

### Dockerfile (Backend)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/src ./src
COPY backend/tsconfig.json ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

### Build and run:

```bash
docker build -t nexus-backend .
docker run -p 3000:3000 \
  -e SUPABASE_URL=your-url \
  -e SUPABASE_SERVICE_KEY=your-key \
  -e JWT_SECRET=your-secret \
  nexus-backend
```

## CI/CD Setup (GitHub Actions)

1. **Create `.github/workflows/deploy.yml`** (already created in repo)
2. **Add Secrets:**
   - Go to GitHub repo → Settings → Secrets
   - Add:
     - `RAILWAY_TOKEN`
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_KEY`
     - `VITE_API_URL`
     - etc.

3. **Push code:**
   ```bash
   git push origin main
   ```
   - Automatically triggers GitHub Actions
   - Tests and builds
   - Deploys if tests pass

## Verification Checklist

After deployment:

- [ ] Backend health check passes: `curl https://api-domain.com/api/v1/health`
- [ ] Frontend loads without errors
- [ ] Login works with test credentials
- [ ] Create test record and verify in database
- [ ] Verify multi-tenant isolation
- [ ] Check error logs for issues
- [ ] SSL certificate valid
- [ ] Performance acceptable (<2s load time)

## Database Backup

### Supabase
- Automatic daily backups
- Manual backup: Supabase Dashboard → Backups
- 1-month retention with Pro plan

### PostgreSQL (Self-hosted)
```bash
# Backup
pg_dump -U postgres dbname > backup.sql

# Restore
psql -U postgres dbname < backup.sql
```

## Monitoring

### Railway
- Logs tab shows all output
- Metrics tab shows CPU/memory
- Set alerts for high usage

### Render
- Logs tab shows all output
- Metrics tab shows resource usage
- Email alerts available

### Custom Monitoring
```bash
# Check backend uptime
curl -I https://api-domain.com/api/v1/health

# Monitor logs
pm2 logs nexus-backend

# Check system resources
top
```

## Troubleshooting

### Backend won't start
```
Error: Cannot find module '@nestjs/common'
→ Run: npm install
→ Check Node.js version: node -v (should be 18+)
```

### Database connection fails
```
Error: supabaseUrl is required
→ Check SUPABASE_URL env var
→ Verify Supabase project is active
→ Check network connectivity
```

### Frontend shows API errors
```
CORS error
→ Check VITE_API_URL matches backend domain
→ Verify FRONTEND_URL in backend env vars
→ Check backend CORS settings
```

### High latency
```
Check:
- Region selection (choose closest)
- Database query performance
- API response times
- Network latency
```

## Rollback

If deployment fails:

**Railway:**
- Click "Rollback" on previous deployment
- Select last known-good version

**Render:**
- Go to Deployments
- Click "Deploy" on previous successful version

**GitHub Actions:**
- Go to Actions → failed workflow
- View logs to debug
- Fix issue and push new commit

## Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. Test all features
4. Set up monitoring
5. Configure backups
6. Implement rate limiting
7. Add analytics
8. Optimize performance
9. Plan scaling strategy

## Support

For issues:
1. Check Railway/Render logs
2. Verify environment variables
3. Test locally first: `npm run start:dev`
4. Review deployment guide
5. Contact platform support
