# Multi-Tenant Isolation Testing Guide

## Overview

NEXUS implements multi-tenancy through:
1. **JWT Custom Claims** - Each JWT includes `tenant_id` and `role`
2. **Row Level Security (RLS)** - Supabase enforces tenant isolation at database level
3. **TenantGuard** - NestJS guard validates user's tenant_id matches request parameter
4. **Database Policies** - SQL policies prevent cross-tenant data access

## Architecture

```
User Login
    ↓
Backend Auth Service
    ↓
Create JWT with tenant_id, role claims
    ↓
Store in localStorage
    ↓
Add to Authorization header
    ↓
TenantGuard validates tenant_id parameter
    ↓
RLS Policies enforce in database
    ↓
Only tenant data returned
```

## Test Scenarios

### 1. Basic JWT Token Structure

**Test:** Verify JWT includes tenant_id claim

```bash
# 1. Login with test user
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tenant1@demo.com","password":"TestPass123!"}'

# 2. Copy the returned access_token
# 3. Decode at jwt.io (Don't enter secret)
# Should see payload like:
#{
#  "sub": "user-id-123",
#  "email": "tenant1@demo.com",
#  "tenant_id": "tenant-id-abc",
#  "role": "admin",
#  "iat": 1672531200,
#  "exp": 1673136000
#}
```

**Expected:** 
- ✅ JWT contains `tenant_id`
- ✅ JWT contains `role`
- ✅ JWT has valid expiration

### 2. TenantGuard Validation

**Test:** User cannot access another tenant's data

```bash
TOKEN="eyJhbGc..." # From previous login as Tenant 1

# Try to access Tenant 2 data with Tenant 1 token
curl -X GET http://localhost:3000/api/v1/tenants/tenant-2-id \
  -H "Authorization: Bearer $TOKEN"

# Expected: 403 Forbidden or 401 Unauthorized
```

**Expected:**
- ✅ Request blocked (403 or 401)
- ✅ Error message indicates authorization failure
- ✅ No tenant data leaked in response

### 3. Data RLS Policy Test

**Test:** Query data from another tenant returns nothing

```bash
TOKEN1="..." # Tenant 1 token
TOKEN2="..." # Tenant 2 token

# Get Tenant 1's records as Tenant 1
curl -X GET http://localhost:3000/api/v1/data/contacts \
  -H "Authorization: Bearer $TOKEN1"
# Returns: [records from Tenant 1]

# Get Tenant 2's records as Tenant 1
curl -X GET http://localhost:3000/api/v1/data/contacts \
  -H "Authorization: Bearer $TOKEN2"
# Returns: [records from Tenant 2 only]

# Verify cross-tenant query isolation
# Tenant 1 should NOT see Tenant 2's records
```

**Expected:**
- ✅ Tenant 1 sees only own records
- ✅ Tenant 2 sees only own records
- ✅ No cross-tenant data leakage

### 4. Tenant User Management

**Test:** User invitation and role-based access

```bash
TOKEN="..." # Admin token

# List users in tenant
curl -X GET http://localhost:3000/api/v1/tenants/:tenantId/users \
  -H "Authorization: Bearer $TOKEN"

# Invite new user
curl -X POST http://localhost:3000/api/v1/tenants/:tenantId/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","role":"user"}'

# Update user role
curl -X PATCH http://localhost:3000/api/v1/tenants/:tenantId/users/:userId \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"editor"}'
```

**Expected:**
- ✅ Only tenant users listed
- ✅ New users assigned to correct tenant
- ✅ Role changes take effect immediately

### 5. Role-Based Access Control

**Test:** Different roles have different permissions

```bash
# Test as Admin
curl -X POST http://localhost:3000/api/v1/data/contacts \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
# Expected: 201 Created

# Test as Editor
curl -X POST http://localhost:3000/api/v1/data/contacts \
  -H "Authorization: Bearer $EDITOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
# Expected: 201 Created (allowed)

# Test as Viewer
curl -X POST http://localhost:3000/api/v1/data/contacts \
  -H "Authorization: Bearer $VIEWER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
# Expected: 403 Forbidden (not allowed)
```

**Expected:**
- ✅ Admin can create records
- ✅ Editor can create records
- ✅ Viewer cannot create records (read-only)

### 6. Token Refresh

**Test:** Verify tokens refresh correctly

```bash
TOKEN="..." # Get access token from login response
REFRESH_TOKEN="..." # Get refresh token from login response

# Wait for token to near expiration (or manually set expiration to 1s)
# Then try to refresh
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"'$REFRESH_TOKEN'"}'

# Expected: New access token returned
```

**Expected:**
- ✅ New token issued with same tenant_id
- ✅ New token has updated expiration
- ✅ Old token becomes invalid

### 7. Logout Isolation

**Test:** User logout clears session

```bash
TOKEN="..." # Valid token

# Logout
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer $TOKEN"

# Try to use old token
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Expected: 401 Unauthorized
```

**Expected:**
- ✅ Logout succeeds
- ✅ Old token becomes invalid
- ✅ Can login again as different user

### 8. Cross-Tenant Attack Simulation

**Test:** Verify impossible to access another tenant

```bash
# Scenario: Tenant A tries to read Tenant B's data

# 1. Get Tenant A records (valid)
curl -X GET http://localhost:3000/api/v1/data/contacts?page=1 \
  -H "Authorization: Bearer $TENANT_A_TOKEN"
# Returns: [Tenant A records only]

# 2. Modify URL to target Tenant B (invalid)
curl -X GET http://localhost:3000/api/v1/tenants/TENANT_B_ID \
  -H "Authorization: Bearer $TENANT_A_TOKEN"
# Expected: 403 Forbidden

# 3. Try to modify query parameters
curl -X GET http://localhost:3000/api/v1/data/contacts?tenant_id=TENANT_B_ID \
  -H "Authorization: Bearer $TENANT_A_TOKEN"
# Expected: Parameter ignored, still sees Tenant A data only
```

**Expected:**
- ✅ Direct access blocked
- ✅ URL manipulation blocked
- ✅ Query parameter injection blocked
- ✅ RLS policies prevent database access

## Automated Testing

### Using curl scripts

Create `test-multitenant.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:3000/api/v1"

# Test 1: Login Tenant 1
echo "Testing Tenant 1 Login..."
TENANT1=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tenant1@demo.com","password":"TestPass123!"}')
TOKEN1=$(echo $TENANT1 | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# Test 2: Login Tenant 2
echo "Testing Tenant 2 Login..."
TENANT2=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tenant2@demo.com","password":"TestPass123!"}')
TOKEN2=$(echo $TENANT2 | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# Test 3: Tenant 1 reads own data
echo "Tenant 1 reading own data..."
curl -s -X GET $API_URL/data/contacts \
  -H "Authorization: Bearer $TOKEN1" | grep -o '"id":"[^"]*' | wc -l

# Test 4: Tenant 2 reads own data
echo "Tenant 2 reading own data..."
curl -s -X GET $API_URL/data/contacts \
  -H "Authorization: Bearer $TOKEN2" | grep -o '"id":"[^"]*' | wc -l

# Test 5: Verify isolation
echo "Verifying data isolation..."
TENANT1_COUNT=$(curl -s -X GET "$API_URL/data/contacts?limit=1000" \
  -H "Authorization: Bearer $TOKEN1" | grep -o '"id":"[^"]*' | wc -l)
TENANT2_COUNT=$(curl -s -X GET "$API_URL/data/contacts?limit=1000" \
  -H "Authorization: Bearer $TOKEN2" | grep -o '"id":"[^"]*' | wc -l)

if [ $TENANT1_COUNT -ne $TENANT2_COUNT ]; then
  echo "✅ Data isolation verified - different record counts"
else
  echo "⚠️  Warning - same record counts (may or may not be OK)"
fi
```

Run:
```bash
chmod +x test-multitenant.sh
./test-multitenant.sh
```

### Using Postman

1. **Create Collection:** Multi-Tenant Tests
2. **Environment Variables:**
   - `api_url`: http://localhost:3000/api/v1
   - `token_1`: (filled after login test)
   - `token_2`: (filled after login test)
   - `tenant_id`: (from JWT claims)

3. **Test Requests:**
   - POST Login Tenant 1
   - POST Login Tenant 2
   - GET Read Tenant 1 Data
   - GET Read Tenant 2 Data
   - POST Cross-Tenant Access (should fail)

## Security Checklist

- [ ] JWT tokens include tenant_id
- [ ] TenantGuard blocks unauthorized tenant access
- [ ] RLS policies enabled on all tables
- [ ] SELECT policy checks `auth.jwt() ->> 'tenant_id'`
- [ ] INSERT policy validates tenant_id
- [ ] UPDATE policy restricts to own records
- [ ] DELETE policy restricts to own records
- [ ] Token refresh maintains tenant_id
- [ ] Logout invalidates all tokens
- [ ] Cross-tenant queries return 403 Forbidden

## Performance Considerations

### Query Optimization
```sql
-- Good: RLS filter applied first
SELECT * FROM records 
WHERE tenant_id = auth.jwt() ->> 'tenant_id'
LIMIT 20;

-- Bad: Without RLS (slower)
SELECT * FROM records LIMIT 20;
```

### Indexing
```sql
-- Add index for tenant_id for faster filtering
CREATE INDEX idx_records_tenant_id ON records(tenant_id);
CREATE INDEX idx_records_tenant_created ON records(tenant_id, created_at DESC);
```

## Monitoring

### Log Suspicious Activity
```sql
-- Check RLS policy violations
SELECT 
  event_message,
  record_time,
  record
FROM audit.record_version
WHERE event_message LIKE '%RLS%'
ORDER BY record_time DESC;
```

### Monitor Failed Auth
```bash
# Check backend logs for failed auth attempts
docker logs backend | grep "401\|403\|Unauthorized"
```

## Incident Response

If data breach suspected:

1. **Immediate Actions:**
   - Rotate JWT_SECRET
   - Force logout all users
   - Audit RLS policies
   - Check access logs

2. **Investigation:**
   - Review failed login attempts
   - Check token usage logs
   - Verify no policy modifications

3. **Communication:**
   - Notify affected tenants
   - Provide remediation steps
   - Document timeline

## Compliance

### GDPR
- [ ] Data segregation enforced
- [ ] Tenant can request data export
- [ ] Tenant can request data deletion
- [ ] Access logs maintained

### HIPAA
- [ ] Encryption at rest
- [ ] Encryption in transit (HTTPS)
- [ ] Audit trails
- [ ] Access controls

### SOC 2
- [ ] Authentication mechanisms
- [ ] Authorization checks
- [ ] Logging and monitoring
- [ ] Incident response plan

## Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [OWASP Multi-Tenancy](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Data_Isolation_Cheat_Sheet.html)
