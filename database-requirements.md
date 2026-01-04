# Database Requirements & Architectural Specifications

## 1. Core Architecture
The Nexus Platform utilizes a **Single-Database, Shared-Schema** multi-tenant model. Isolation is enforced strictly via **PostgreSQL Row Level Security (RLS)**.

### Tenant Isolation Strategy
- Every table (except `main_modules`) contains a `tenant_id` UUID column.
- Supabase JWT includes `tenant_id` in `app_metadata` or via a lookup in the `users` table.
- RLS Policies ensure users can only `SELECT`, `INSERT`, `UPDATE`, or `DELETE` rows matching their `tenant_id`.

## 2. Dynamic Schema Engine
Instead of executing DDL (Data Definition Language) commands like `ALTER TABLE` when a user adds a field, Nexus uses a **Metadata-Driven Approach**:

1.  **Definitions**: Field definitions (label, type, validation) are stored in `sub_module_fields`.
2.  **Storage**: Actual data is stored in the `sub_module_records` table within a `data` column of type `JSONB`.
3.  **Indexing**: Highly queried fields can be indexed using GIN (Generalized Inverted Index) on the JSONB column for performance.

## 3. Data Integrity
- **Foreign Keys**: Cascade deletes are implemented to ensure that deleting a tenant or module removes all associated fields, records, and attachments.
- **Uniqueness**: Composite unique keys (e.g., `tenant_id` + `code` in `sub_modules`) prevent collisions between tenants.

## 4. Key Tables & Relationships
- `tenants`: Root entity.
- `main_modules`: System-wide categories (e.g., Procurement, HR).
- `sub_modules`: Tenant-specific functional areas (e.g., "Supplier Management").
- `sub_module_fields`: Configuration of the dynamic form/list.
- `sub_module_records`: The data store.

## 5. Security Requirements
- **RLS Enabled**: Mandatory for all tenant-data tables.
- **Service Role**: Only backend-only operations (like system-level cleanup) use the Supabase Service Role.
- **Auth Hook**: A custom Supabase trigger should populate the `users` table when a new user signs up in `auth.users`.
