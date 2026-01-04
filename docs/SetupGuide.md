
# Nexus SaaS Platform - Setup Guide

## 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and execute the contents of `supabase-schema.sql`.
3. Enable **Google Auth** or **Email Auth** in the Authentication settings.
4. Add a custom claim `tenant_id` to your users using Supabase Edge Functions or the `auth.users` hook to enable RLS isolation.

## 2. Environment Variables
Ensure you have the following keys in your environment (or `.env` file):
```bash
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
API_KEY=your_gemini_api_key
```

## 3. Dynamic Module Creation
1. Log in as a `tenant_admin`.
2. Navigate to **Schema Builder**.
3. Create a new module (e.g., "Quality Control").
4. Add fields (Text, Date, Numeric, File Upload).
5. The module will automatically appear in the Sidebar and generate a fully functional CRUD UI.

## 4. Deployment
- **Frontend**: Deploy to Vercel/Netlify. Ensure `HashRouter` is used if deploying to environments without full SPA rewrite support.
- **Backend**: This is a Serverless-first architecture. Most logic resides in Supabase Edge Functions and the client-side hooks.
