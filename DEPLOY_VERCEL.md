Deployment to Vercel — Nexus SaaS Platform

This project is a Vite React app. To deploy to Vercel and wire it to your Supabase project, follow these steps.

1) Ensure DB schema is applied
- Apply `full_schema.sql` in the Supabase SQL Editor or run locally with `psql` against the Postgres connection. See `full_schema.sql` in the project root.

2) Create the Storage bucket
- In Supabase Dashboard → Storage, create a bucket named `attachments` and set its public access according to your security requirements. The app expects `attachments` bucket for uploads.

3) Vercel Environment Variables
Set the following Environment Variables in your Vercel Project (Dashboard → Settings → Environment Variables):

- `VITE_SUPABASE_URL` = https://zupngmmhtpnkyxcjhnoo.supabase.co
- `VITE_SUPABASE_KEY` = <publishable_key> (sb_publishable_qXJrs6URUkOiTxUmzSL7Cw_0nMtWm9b)

Optional / server-only (keep secret):
- `SUPABASE_SERVICE_ROLE` = <service_role_key> (only if you need server-side admin actions)
- `DATABASE_URL` = your Postgres connection (if using server functions)

Also set the `NEXT_PUBLIC_*` names if other tools expect them.

4) Build & Deploy
- Connect your Git repository to Vercel and select the repo. Vercel will use `npm run build` (vite build) by default.
- Deploy. The app will be served as a static site.

5) Post-deploy checks
- Open the app and sign in via Supabase Auth (if configured).
- Verify uploads: try uploading a file and confirm it appears in the `attachments` bucket and that `getPublicUrl` returns a working URL.
- Ensure dynamic modules and records work by creating a sample sub-module and record via the UI.

If you want, I can:
- Apply the SQL to your Supabase if you provide the `service_role` key (I will not store it beyond the session).
- Trigger a Vercel deployment programmatically if you provide a Vercel token and confirm.

Security note: keep `service_role` and DB passwords secret. Do not commit them to the repo.
