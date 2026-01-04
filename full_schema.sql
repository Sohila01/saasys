-- Full database schema for Nexus SaaS Platform (Supabase)
-- Generated: 2026-01-04

-- Enable needed extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Trigger helper to update `updated_at`
CREATE OR REPLACE FUNCTION trigger_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subdomain text UNIQUE NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER tenants_update BEFORE UPDATE ON tenants
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

-- Users (application profile table)
-- Note: authentication is handled by Supabase Auth; this table stores profile data
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  tenant_id uuid REFERENCES tenants(id) ON DELETE SET NULL,
  full_name text,
  email text UNIQUE,
  role text DEFAULT 'user',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER users_update BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

-- Main modules (global navigation entries)
CREATE TABLE IF NOT EXISTS main_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER main_modules_update BEFORE UPDATE ON main_modules
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

-- Sub modules (tenant-scoped modules)
CREATE TABLE IF NOT EXISTS sub_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  main_module_id uuid REFERENCES main_modules(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (tenant_id, code)
);

CREATE TRIGGER sub_modules_update BEFORE UPDATE ON sub_modules
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

-- Sub module fields (schema definition per sub-module)
CREATE TABLE IF NOT EXISTS sub_module_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  sub_module_id uuid REFERENCES sub_modules(id) ON DELETE CASCADE,
  name text NOT NULL,
  db_name text NOT NULL,
  field_type text NOT NULL,
  options jsonb DEFAULT '[]'::jsonb,
  is_required boolean DEFAULT false,
  is_visible_in_list boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (sub_module_id, db_name)
);

CREATE TRIGGER sub_module_fields_update BEFORE UPDATE ON sub_module_fields
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

-- Sub module records (dynamic data stored as JSONB)
CREATE TABLE IF NOT EXISTS sub_module_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  sub_module_id uuid REFERENCES sub_modules(id) ON DELETE CASCADE,
  data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sub_module_records_sub_module_id ON sub_module_records(sub_module_id);
CREATE INDEX IF NOT EXISTS idx_sub_module_records_tenant_id ON sub_module_records(tenant_id);
CREATE TRIGGER sub_module_records_update BEFORE UPDATE ON sub_module_records
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

-- Workflows
CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  trigger_module_id uuid,
  trigger_event text,
  action_type text,
  action_config jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workflows_tenant_id ON workflows(tenant_id);
CREATE TRIGGER workflows_update BEFORE UPDATE ON workflows
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

-- Dashboards and widgets
CREATE TABLE IF NOT EXISTS dashboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER dashboards_update BEFORE UPDATE ON dashboards
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TABLE IF NOT EXISTS dashboard_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id uuid REFERENCES dashboards(id) ON DELETE CASCADE,
  title text NOT NULL,
  widget_type text NOT NULL,
  query_config jsonb DEFAULT '{}'::jsonb,
  layout_config jsonb DEFAULT '{}'::jsonb,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_dashboard_id ON dashboard_widgets(dashboard_id);
CREATE TRIGGER dashboard_widgets_update BEFORE UPDATE ON dashboard_widgets
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

-- Optional: sample admin tenant and basic seed for main modules
INSERT INTO tenants (id, name, subdomain)
SELECT gen_random_uuid(), 'Default Tenant', 'default'
WHERE NOT EXISTS (SELECT 1 FROM tenants);

-- End of schema
