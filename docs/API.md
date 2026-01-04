# Nexus SaaS API Documentation

## Base URL

```
Production: https://api.nexus-saas.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All endpoints (except `/auth/login`) require Bearer token:

```
Authorization: Bearer <JWT_TOKEN>
```

Token obtained from `/auth/login` endpoint and refreshed via `/auth/refresh`.

---

## 1. Authentication Module (`/auth`)

### POST /auth/login
**Login with email/password**

Request:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "tenant_id": "uuid",
    "role": "admin"
  }
}
```

---

### POST /auth/refresh
**Refresh access token**

Request:
```json
{
  "refresh_token": "..."
}
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "..."
}
```

---

### POST /auth/logout
**Invalidate current session**

Response: `200 OK`

---

## 2. Tenant Module (`/tenants`)

### GET /tenants/:id
**Get tenant details**

Response:
```json
{
  "id": "uuid",
  "name": "Acme Corporation",
  "description": "Leading B2B SaaS provider",
  "subscription_tier": "enterprise",
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-15T00:00:00Z"
}
```

---

### PATCH /tenants/:id
**Update tenant settings**

Request:
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

---

### GET /tenants/:id/users
**List users in tenant**

Response:
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "admin",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### POST /tenants/:id/users
**Invite user to tenant**

Request:
```json
{
  "email": "newuser@example.com",
  "role": "editor"
}
```

---

### PATCH /tenants/:id/users/:userId
**Update user role/status**

Request:
```json
{
  "role": "viewer",
  "status": "inactive"
}
```

---

## 3. Config Module (`/config`)

### GET /config/modules
**Get all modules for tenant**

Response:
```json
[
  {
    "id": "uuid",
    "name": "Contacts",
    "slug": "contacts",
    "description": "Contact management",
    "icon": "users",
    "order": 1,
    "fields": [
      {
        "id": "uuid",
        "name": "Email",
        "slug": "email",
        "type": "email",
        "required": true,
        "order": 1
      }
    ]
  }
]
```

---

### POST /config/modules
**Create new module**

Request:
```json
{
  "name": "Custom Module",
  "slug": "custom-module",
  "description": "Description",
  "icon": "custom-icon"
}
```

---

### PATCH /config/modules/:id
**Update module**

Request:
```json
{
  "name": "Updated Name",
  "description": "Updated Description"
}
```

---

### POST /config/modules/:id/fields
**Add field to module**

Request:
```json
{
  "name": "Phone",
  "slug": "phone",
  "type": "phone",
  "required": false,
  "validation": {
    "pattern": "^\\+?[1-9]\\d{1,14}$"
  }
}
```

---

### PATCH /config/modules/:moduleId/fields/:fieldId
**Update field**

Request:
```json
{
  "name": "Mobile Phone",
  "required": true
}
```

---

### DELETE /config/modules/:moduleId/fields/:fieldId
**Delete field (soft delete)**

Response: `200 OK`

---

## 4. Data Module (`/data`)

### GET /data/:moduleSlug
**List all records for module (paginated)**

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Records per page (default: 20)
- `sort`: Sort field (default: created_at)
- `order`: asc/desc (default: desc)
- `search`: Search query
- `filters[field]`: Filter by field value

Response:
```json
{
  "total": 150,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "id": "uuid",
      "module_id": "uuid",
      "data": {
        "email": "john@example.com",
        "name": "John Doe",
        "phone": "+1234567890"
      },
      "created_by": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST /data/:moduleSlug
**Create new record**

Request:
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

---

### GET /data/:moduleSlug/:recordId
**Get record details**

Response:
```json
{
  "id": "uuid",
  "module_id": "uuid",
  "data": {...},
  "created_by": "uuid",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### PATCH /data/:moduleSlug/:recordId
**Update record**

Request:
```json
{
  "email": "newemail@example.com",
  "phone": "+9876543210"
}
```

---

### DELETE /data/:moduleSlug/:recordId
**Delete record (soft delete)**

Response: `200 OK`

---

## 5. Dashboard Module (`/dashboards`)

### GET /dashboards
**List all dashboards**

Response:
```json
[
  {
    "id": "uuid",
    "name": "Sales Dashboard",
    "description": "Q4 Sales Performance",
    "layout": "grid",
    "widgets": [...],
    "created_by": "uuid",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### POST /dashboards
**Create new dashboard**

Request:
```json
{
  "name": "Revenue Dashboard",
  "description": "Monthly revenue tracking",
  "layout": "grid"
}
```

---

### GET /dashboards/:id
**Get dashboard with widgets**

Response:
```json
{
  "id": "uuid",
  "name": "Sales Dashboard",
  "widgets": [
    {
      "id": "uuid",
      "title": "Total Revenue",
      "type": "metric",
      "position": {"x": 0, "y": 0, "width": 3, "height": 2},
      "query_id": "uuid"
    }
  ]
}
```

---

### PATCH /dashboards/:id
**Update dashboard**

Request:
```json
{
  "name": "Updated Name",
  "layout": "flex"
}
```

---

### POST /dashboards/:id/widgets
**Add widget to dashboard**

Request:
```json
{
  "title": "New Widget",
  "type": "chart",
  "position": {"x": 3, "y": 0, "width": 3, "height": 2},
  "query_id": "uuid"
}
```

---

### DELETE /dashboards/:id
**Delete dashboard**

Response: `200 OK`

---

## 6. Notifications Module (`/notifications`)

### GET /notifications
**List user notifications (paginated)**

Query Parameters:
- `read`: Filter by read status (default: all)
- `type`: Filter by type (email, in-app, push)

Response:
```json
[
  {
    "id": "uuid",
    "type": "email",
    "title": "New comment on Acme Corp",
    "message": "John added a comment",
    "read": false,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### PATCH /notifications/:id
**Mark notification as read**

Request:
```json
{
  "read": true
}
```

---

### DELETE /notifications/:id
**Delete notification**

Response: `200 OK`

---

### POST /notifications/mark-all-read
**Mark all notifications as read**

Response: `200 OK`

---

## 7. Attachments Module (`/attachments`)

### POST /attachments/upload
**Upload file**

Form Data:
- `file`: Binary file
- `record_id`: Optional record association
- `module_id`: Optional module association

Response:
```json
{
  "id": "uuid",
  "filename": "document.pdf",
  "url": "https://supabase.../attachments/document.pdf",
  "size": 2048000,
  "mime_type": "application/pdf",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### GET /attachments/:recordId
**List files for record**

Response:
```json
[
  {
    "id": "uuid",
    "filename": "document.pdf",
    "url": "...",
    "size": 2048000,
    "mime_type": "application/pdf",
    "uploaded_by": "uuid",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### DELETE /attachments/:id
**Delete file**

Response: `200 OK`

---

## 8. Comments Module (`/comments`)

### POST /comments
**Add comment to record**

Request:
```json
{
  "record_id": "uuid",
  "module_id": "uuid",
  "content": "This is a great opportunity!"
}
```

Response:
```json
{
  "id": "uuid",
  "record_id": "uuid",
  "content": "This is a great opportunity!",
  "author": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### GET /comments/:recordId
**Get all comments for record**

Response:
```json
[
  {
    "id": "uuid",
    "content": "...",
    "author": {...},
    "created_at": "...",
    "replies": [...]
  }
]
```

---

### PATCH /comments/:id
**Update comment**

Request:
```json
{
  "content": "Updated comment text"
}
```

---

### DELETE /comments/:id
**Delete comment**

Response: `200 OK`

---

## 9. Suppliers Module (`/suppliers`)

### GET /suppliers
**List all suppliers**

Query Parameters:
- `status`: active/inactive
- `rating`: Minimum rating
- `search`: Search by name

Response:
```json
[
  {
    "id": "uuid",
    "name": "Acme Supplies",
    "description": "Leading supplier",
    "website": "https://acme.com",
    "email": "contact@acme.com",
    "phone": "+1234567890",
    "status": "active",
    "rating": 4.5,
    "review_count": 23,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### POST /suppliers
**Add supplier**

Request:
```json
{
  "name": "New Supplier",
  "description": "Description",
  "website": "https://example.com",
  "email": "contact@example.com",
  "phone": "+1234567890"
}
```

---

### PATCH /suppliers/:id
**Update supplier**

Request:
```json
{
  "status": "inactive",
  "phone": "+9876543210"
}
```

---

### POST /suppliers/:id/ratings
**Rate/review supplier**

Request:
```json
{
  "rating": 5,
  "comment": "Excellent service and quality!"
}
```

---

## 10. Workflows Module (`/workflows`)

### GET /workflows
**List all workflows**

Response:
```json
[
  {
    "id": "uuid",
    "name": "Follow-up Email",
    "description": "Send follow-up 3 days after creation",
    "trigger": {
      "type": "record_created",
      "module_id": "uuid"
    },
    "actions": [
      {
        "type": "send_email",
        "template_id": "uuid",
        "delay_hours": 72
      }
    ],
    "enabled": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### POST /workflows
**Create workflow**

Request:
```json
{
  "name": "Auto-assign Lead",
  "trigger": {
    "type": "record_created",
    "module_id": "uuid"
  },
  "actions": [
    {
      "type": "assign_to_user",
      "user_id": "uuid"
    }
  ]
}
```

---

### PATCH /workflows/:id
**Update workflow**

Request:
```json
{
  "enabled": false
}
```

---

### DELETE /workflows/:id
**Delete workflow**

Response: `200 OK`

---

### GET /workflows/:id/executions
**View workflow execution history**

Response:
```json
[
  {
    "id": "uuid",
    "workflow_id": "uuid",
    "record_id": "uuid",
    "status": "completed",
    "executed_at": "2024-01-15T10:30:00Z",
    "results": [...]
  }
]
```

---

## Error Responses

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

### Common Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation failed)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (no permission)
- `404`: Not Found
- `409`: Conflict (duplicate record)
- `500`: Internal Server Error

---

## Rate Limiting

All endpoints are rate-limited to prevent abuse:

- **Free tier**: 100 requests/minute per IP
- **Pro tier**: 1,000 requests/minute per IP
- **Enterprise**: Unlimited

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705315200
```

---

## Pagination

For list endpoints, use query parameters:

```
GET /data/contacts?page=1&limit=20&sort=created_at&order=desc
```

Response includes:
```json
{
  "total": 500,
  "page": 1,
  "limit": 20,
  "pages": 25,
  "data": [...]
}
```

---

## Testing Endpoints

Use Swagger UI for interactive testing:

```
http://localhost:3000/api/docs
```

Or use cURL:

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer your_token_here"
```

Or use Postman/Insomnia with the Swagger JSON:

```
http://localhost:3000/api-json
```
