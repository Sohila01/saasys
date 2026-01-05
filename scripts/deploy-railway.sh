#!/bin/bash

# Railway Deployment Script
export RAILWAY_TOKEN="d399a7b7-5399-42fb-b904-eb3df186180e"

echo "🚀 Deploying Backend to Railway..."

cd /c/Users/Walid\ Genidy/Desktop/nexus-saas-platform/backend

# Create railway.json if not exists
cat > railway.json << EOF
{
  "rootDirectory": ".",
  "buildCommand": "npm install && npm run build",
  "startCommand": "npm run start:prod"
}
EOF

# Deploy
railway up --service nexus-backend

echo "✅ Backend deployment initiated!"
