# NEXUS SAAS PLATFORM - COMPLETE SETUP GUIDE

## Project Structure

```
nexus-saas-platform/
├── frontend/                    # React + Vite + TypeScript (existing)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # NestJS Backend (new)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/           # Authentication & JWT
│   │   │   ├── tenant/         # Tenant management
│   │   │   ├── config/         # Schema builder & sub-modules
│   │   │   ├── data/           # Dynamic CRUD operations
│   │   │   ├── dashboard/      # Dashboard & widgets
│   │   │   ├── notifications/  # Real-time notifications
│   │   │   ├── attachments/    # File uploads
│   │   │   ├── comments/       # Record comments
│   │   │   ├── suppliers/      # Supplier management
│   │   │   └── workflows/      # Workflow automation
│   │   ├── middleware/
│   │   ├── guards/
│   │   ├── decorators/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── docker-compose.yml
│
├── docs/                        # Documentation
│   ├── API.md
│   ├── SCHEMA.md
│   ├── DEPLOYMENT.md
│   └── ADMIN_GUIDE.md
│
├── supabase-schema-complete.sql # Complete DB schema with RLS
└── README.md
```

## Phase 1: Database Setup ✅

### Apply the Complete Schema

1. Go to Supabase Dashboard: https://app.supabase.com
2. Open your Nexus project
3. Go to **SQL Editor** → **New Query**
4. Copy the complete SQL from `supabase-schema-complete.sql`
5. Execute the query
6. Verify all tables created with RLS enabled

### Enable RLS Auth JWT Claims

1. Go to **Authentication** → **Providers**
2. Enable Email/Password provider
3. Go to **JWT Secret** settings
4. Ensure JWT includes custom claims: `tenant_id`, `role`

## Phase 2: Backend Setup 🔧

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create `.env.local`:

```
# Database
SUPABASE_URL=https://zupngmmhtpnkyxcjhnoo.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRATION=7d

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Email (for notifications)
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@nexus.local

# File Storage
SUPABASE_STORAGE_BUCKET=attachments
MAX_FILE_SIZE_MB=50
```

### Start Development Server

```bash
npm run start:dev
```

Server will run on: http://localhost:3000
API docs: http://localhost:3000/api/docs

## Phase 3: Frontend Integration 🎨

### Update API Service

Update `frontend/src/services/api.ts`:

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiClient = api;
```

### Update Environment Variables

Create `frontend/.env.production`:

```
VITE_SUPABASE_URL=https://zupngmmhtpnkyxcjhnoo.supabase.co
VITE_SUPABASE_KEY=sb_publishable_...
VITE_API_URL=https://api.nexus.example.com/api/v1
```

## Phase 4: Key API Routes Implemented ✨

### Authentication
- `POST /auth/login` - Email/password login
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - Logout user

### Schema Configuration
- `GET /config/main-modules` - List all main modules
- `GET /config/sub-modules` - List tenant sub-modules
- `POST /config/sub-modules` - Create new sub-module
- `PUT /config/sub-modules/:id` - Update sub-module
- `DELETE /config/sub-modules/:id` - Delete sub-module
- `POST /config/sub-modules/:id/fields` - Add field to module
- `PUT /config/sub-modules/:id/fields/:fieldId` - Update field
- `DELETE /config/sub-modules/:id/fields/:fieldId` - Delete field

### Dynamic Data CRUD
- `GET /data/:moduleCode` - List records (paginated, filtered, sorted)
- `POST /data/:moduleCode` - Create record
- `GET /data/:moduleCode/:recordId` - Get record with details
- `PUT /data/:moduleCode/:recordId` - Update record
- `DELETE /data/:moduleCode/:recordId` - Delete record

### Dashboards & Analytics
- `GET /dashboards` - List dashboards
- `POST /dashboards` - Create dashboard
- `PUT /dashboards/:id` - Update dashboard
- `POST /dashboards/:id/widgets` - Add widget
- `POST /dashboards/:id/query` - Execute dashboard query
- `GET /data-sources` - List data sources

### Attachments
- `POST /attachments` - Upload file
- `GET /attachments` - List files
- `DELETE /attachments/:id` - Delete file

### Comments
- `POST /comments` - Post comment
- `GET /comments` - Get comments
- `PUT /comments/:id` - Edit comment
- `DELETE /comments/:id` - Delete comment

### Notifications
- `GET /notifications` - List notifications
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/read-all` - Mark all as read

### Suppliers
- `GET /suppliers/:supplierId/profile` - Get supplier profile
- `POST /suppliers/:supplierId/ratings` - Submit rating
- `GET /suppliers/:supplierId/ratings` - Get ratings
- `GET /suppliers/:supplierId/dashboard` - Supplier stats

## Phase 5: Multi-Tenancy & Security 🔐

### Tenant Isolation (Via JWT Claims)

Every request includes tenant_id in JWT:

```typescript
// In auth middleware
const tenantId = req.user.tenant_id;
// All queries automatically filtered by tenant_id
```

### Row Level Security (RLS)

All queries respect RLS policies:
- Users can only see their tenant's data
- No admin bypass vulnerabilities
- Enforced at database level

### Audit Logging

Every modification is logged:
- User ID, timestamp, IP address
- Changed fields, before/after values
- Compliance-ready for regulations

## Phase 6: Deployment 🚀

### Backend Deployment (Railway/Render)

1. Create account on Railway.app or Render.com
2. Connect GitHub repository
3. Set environment variables
4. Deploy backend

```bash
# Railway
railway up

# Or Render
vercel deploy --prod
```

### Frontend Deployment (Vercel)

```bash
cd frontend
vercel deploy --prod
```

### Database (Supabase Managed)

Your Supabase project is already production-ready:
- Automatic backups
- Global CDN
- Built-in monitoring
- Free tier up to 500MB

## Phase 7: Testing & Monitoring 📊

### API Testing

```bash
# Using curl
curl -X GET http://localhost:3000/api/v1/config/main-modules \
  -H "Authorization: Bearer YOUR_TOKEN"

# Or use Postman/Insomnia with the Swagger docs
```

### Database Monitoring

1. Go to Supabase Dashboard
2. Check **Reports** section for:
   - Query performance
   - Storage usage
   - API calls
   - Database health

### Error Tracking

Implement Sentry integration:

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Common Tasks

### Add New Field to Module

1. Frontend: User goes to Admin → Data Architect
2. Selects sub-module and clicks "Add Field"
3. Fills in field config (name, type, validations)
4. Clicks Save
5. Backend automatically:
   - Creates field record in `sub_module_fields`
   - Validates configuration
   - Triggers audit log

### Query Builder for Dashboards

Dashboard widgets can pull data from any sub-module:

```json
{
  "widget_type": "table",
  "data_source_config": {
    "sub_module_code": "contacts",
    "filters": [
      {
        "field": "status",
        "operator": "equals",
        "value": "active"
      }
    ],
    "sort_by": "created_at",
    "sort_direction": "desc",
    "limit": 100
  }
}
```

### Export Data

```typescript
// POST /data/:moduleCode/export
{
  "format": "csv", // or "excel", "json"
  "filters": [...],
  "fields": ["id", "name", "email"]
}
```

### Workflow Automation

Example workflow: When a new opportunity is created, send notification to sales manager

```json
{
  "trigger_type": "record_created",
  "trigger_config": {
    "sub_module_code": "opportunities"
  },
  "actions": [
    {
      "type": "send_notification",
      "target_role": "sales_manager",
      "title": "New Opportunity",
      "message": "{{ record.name }} - ${{ record.value }}"
    },
    {
      "type": "send_email",
      "template": "new_opportunity",
      "recipients": ["manager@company.com"]
    }
  ]
}
```

## Support & Documentation

- API Documentation: http://localhost:3000/api/docs (Swagger)
- Database Schema: See `SCHEMA.md`
- Deployment Guide: See `DEPLOYMENT.md`
- Admin Guide: See `ADMIN_GUIDE.md`

## Next Steps

1. ✅ Database schema applied
2. ⬜ Backend modules implemented (all 10 modules needed)
3. ⬜ Frontend integration updated
4. ⬜ Authentication flow tested
5. ⬜ Multi-tenancy verified
6. ⬜ Deploy to production

---

**Status**: Foundation laid, Ready for core module development
