#!/usr/bin/env pwsh

# Deployment script for Vercel and Railway

Write-Host "🚀 Nexus SaaS Platform - Deployment Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Set environment variables
$env:VERCEL_TOKEN = "vck_1tkz4AFcquLU2cuA54Of2YNVYvbWnJUC2wa5zzKaeDeubuTcQb0zGptb"
$projectPath = "c:\Users\Walid Genidy\Desktop\nexus-saas-platform"

Write-Host "`n📦 Step 1: Adding Vercel environment variables..." -ForegroundColor Yellow

# Add environment variables to Vercel
$vars = @{
    "VITE_API_URL" = "https://nexus-saas-backend.up.railway.app/api"
    "VITE_SUPABASE_URL" = "https://zupngmmhtpnkyxcjhnoo.supabase.co"
    "VITE_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cG5nbW1odHBua3l4Y2pobm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MTMxNTAsImV4cCI6MjA4MzA4OTE1MH0.IL2FxjVD5bJ6JUBDP2ZPBaWxZ6L6B206ovEpbhUIilg"
}

Write-Host "✅ Variables configured" -ForegroundColor Green

Write-Host "`n🚀 Step 2: Building Frontend..." -ForegroundColor Yellow
Set-Location $projectPath
npm run build

Write-Host "`n📤 Step 3: Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod --skip-domain --token $env:VERCEL_TOKEN

Write-Host "`n✅ Deployment initiated!" -ForegroundColor Green
Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Wait for Vercel deployment to complete"
Write-Host "2. Deploy Backend to Railway: https://railway.app"
Write-Host "3. Update VITE_API_URL with Railway URL"
Write-Host "4. Redeploy on Vercel"

