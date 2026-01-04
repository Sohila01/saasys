# Backend Module Implementation Guide

## Modules to Implement (All 10 Core Modules)

### 1. **AUTH MODULE** (`src/modules/auth/`)

**Files to create:**
- `auth.service.ts` - Login, refresh token, validate JWT
- `auth.controller.ts` - `/auth/login`, `/auth/refresh`, `/auth/logout`
- `auth.module.ts` - Module definition
- `strategies/jwt.strategy.ts` ✅ (already created)
- `dtos/login.dto.ts` - Login request DTO

**Key Functions:**
```typescript
// Login with email/password
login(email: string, password: string): Promise<{ access_token, refresh_token }>

// Refresh JWT token
refresh(refreshToken: string): Promise<{ access_token }>

// Validate token
validateToken(token: string): Promise<{ userId, tenantId, role }>
```

---

### 2. **TENANT MODULE** (`src/modules/tenant/`)

**Responsibilities:**
- Tenant CRUD operations
- Tenant settings management
- Subscription tier upgrades

**Routes:**
- `GET /tenants/me` - Current tenant
- `PUT /tenants/me` - Update tenant
- `GET /tenants/me/settings` - Get settings
- `PUT /tenants/me/settings` - Update settings

---

### 3. **CONFIG MODULE** (Schema Builder) (`src/modules/config/`)

**Responsibilities:**
- Main modules listing
- Sub-module CRUD
- Field management
- Dynamic schema validation

**Routes:**
- `GET /config/main-modules`
- `GET /config/sub-modules`
- `POST /config/sub-modules`
- `PUT /config/sub-modules/:id`
- `DELETE /config/sub-modules/:id`
- `POST /config/sub-modules/:id/fields`
- `PUT /config/sub-modules/:id/fields/:fieldId`
- `DELETE /config/sub-modules/:id/fields/:fieldId`

**Key Service Methods:**
```typescript
createSubModule(tenantId, data): Promise<SubModule>
updateSubModule(subModuleId, data): Promise<SubModule>
addField(subModuleId, fieldData): Promise<SubModuleField>
getSubModuleSchema(subModuleId): Promise<SubModuleField[]>
validateRecordData(subModuleId, data): Promise<boolean>
```

---

### 4. **DATA MODULE** (Dynamic CRUD) (`src/modules/data/`)

**Responsibilities:**
- Dynamic record CRUD for any sub-module
- Query filtering, sorting, pagination
- Validation based on sub-module schema
- Audit logging

**Routes:**
- `GET /data/:moduleCode` - List records
- `POST /data/:moduleCode` - Create record
- `GET /data/:moduleCode/:recordId` - Get single record
- `PUT /data/:moduleCode/:recordId` - Update record
- `DELETE /data/:moduleCode/:recordId` - Delete record

**Key Features:**
- Query builder with filters, sorts, pagination
- Automatic schema validation
- Relationship loading
- Attachment handling

---

### 5. **DASHBOARD MODULE** (`src/modules/dashboard/`)

**Responsibilities:**
- Dashboard CRUD
- Widget management
- Query execution engine
- Data source integration

**Routes:**
- `GET /dashboards` - List dashboards
- `POST /dashboards` - Create dashboard
- `PUT /dashboards/:id` - Update dashboard
- `DELETE /dashboards/:id` - Delete dashboard
- `POST /dashboards/:id/widgets` - Add widget
- `POST /dashboards/:id/query` - Execute widget query

---

### 6. **NOTIFICATIONS MODULE** (`src/modules/notifications/`)

**Responsibilities:**
- Real-time notifications
- Email notifications
- Push notifications (optional)
- Notification preferences

**Routes:**
- `GET /notifications` - List user notifications
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/read-all` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

---

### 7. **ATTACHMENTS MODULE** (`src/modules/attachments/`)

**Responsibilities:**
- File upload to Supabase Storage
- File listing and metadata
- File deletion
- Access control

**Routes:**
- `POST /attachments` - Upload file
- `GET /attachments` - List files
- `DELETE /attachments/:id` - Delete file

**Using Supabase Storage:**
```typescript
const { data, error } = await supabase.storage
  .from('attachments')
  .upload(`${tenantId}/${filename}`, file);
```

---

### 8. **COMMENTS MODULE** (`src/modules/comments/`)

**Responsibilities:**
- Comments on records
- Mention system (@user)
- Comment threads

**Routes:**
- `POST /comments` - Post comment
- `GET /comments?recordId=...` - Get comments
- `PUT /comments/:id` - Edit comment
- `DELETE /comments/:id` - Delete comment

---

### 9. **SUPPLIERS MODULE** (`src/modules/suppliers/`)

**Responsibilities:**
- B2B supplier management
- Supplier ratings
- Supplier dashboard/analytics

**Routes:**
- `GET /suppliers/:supplierId/profile` - Supplier profile
- `POST /suppliers/:supplierId/ratings` - Submit rating
- `GET /suppliers/:supplierId/ratings` - Get ratings
- `GET /suppliers/:supplierId/dashboard` - Supplier stats

---

### 10. **WORKFLOWS MODULE** (`src/modules/workflows/`)

**Responsibilities:**
- Workflow creation and management
- Trigger-based actions
- Notification triggers
- Email triggers

**Routes:**
- `POST /workflows` - Create workflow
- `GET /workflows` - List workflows
- `PUT /workflows/:id` - Update workflow
- `DELETE /workflows/:id` - Delete workflow
- `POST /workflows/:id/execute` - Execute manual workflow

**Example Workflow:**
```json
{
  "trigger_type": "record_created",
  "trigger_config": {
    "sub_module_code": "opportunities"
  },
  "actions": [
    {
      "type": "send_notification",
      "target_users": ["user123"],
      "title": "New Opportunity: {{ record.name }}"
    }
  ]
}
```

---

## Shared Architecture

### Decorators

Create custom decorators:

```typescript
// @CurrentUser() - Get current user from JWT
@Get('/profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: User) {
  return user;
}

// @TenantId() - Get current tenant ID
@Get('/data/:moduleCode')
getData(@TenantId() tenantId: string) {
  // All queries automatically filtered by tenantId
}
```

### Guards

- `JwtAuthGuard` - Validate JWT token
- `TenantGuard` - Verify user belongs to tenant
- `RoleGuard` - Role-based access (admin, user, supplier)

### Middleware

- `AuthMiddleware` - Extract and validate JWT
- `TenantMiddleware` - Inject tenant context
- `AuditMiddleware` - Log all modifications

### Error Handling

```typescript
// Use consistent error responses
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Access denied');
throw new ForbiddenException('Not allowed');
throw new NotFoundException('Resource not found');
```

---

## Database Query Patterns

### Read with RLS (respects tenant isolation)

```typescript
const { data } = await supabase
  .from('sub_module_records')
  .select('*')
  .eq('sub_module_id', subModuleId)
  .eq('tenant_id', tenantId);
```

### Write with Audit

```typescript
// 1. Create/update record
const { data: record } = await supabase
  .from('sub_module_records')
  .insert({ sub_module_id, tenant_id, data })
  .select()
  .single();

// 2. Log to audit table
await supabase
  .from('audit_logs')
  .insert({
    tenant_id,
    user_id: currentUser.id,
    entity_type: 'sub_module_record',
    entity_id: record.id,
    action: 'create',
    changes: record,
  });
```

---

## Testing

Create test files for each module:

```typescript
// src/modules/data/data.service.spec.ts
describe('DataService', () => {
  it('should list records for the current tenant', async () => {
    const records = await dataService.listRecords(
      tenantId,
      moduleCode,
      filters,
    );
    expect(records).toHaveLength(3);
  });

  it('should prevent cross-tenant data access', async () => {
    expect(async () => {
      await dataService.getRecord(
        differentTenantId,
        subModuleId,
        recordId,
      );
    }).rejects.toThrow();
  });
});
```

---

## Deployment Checklist

- [ ] All 10 modules implemented
- [ ] Unit tests written (>80% coverage)
- [ ] E2E tests passing
- [ ] Swagger docs generated
- [ ] RLS policies verified
- [ ] Cross-tenant access blocked
- [ ] Error handling consistent
- [ ] Audit logging working
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] Environment variables set
- [ ] Database backups enabled
- [ ] Monitoring configured
- [ ] CI/CD pipeline set up

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development
npm run start:dev

# Run tests
npm test

# Build for production
npm run build

# Start production
npm run start:prod

# Generate Swagger docs
npm run generate:docs
```

---

**Next**: Implement modules 1-10 in this order for maximum dependencies satisfaction.
